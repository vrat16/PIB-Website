import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import nodemailer from 'nodemailer';

interface ScheduledSub {
  recipientEmail: string;
  deliveryTimeIST: string;
  subject?: string;
  text?: string;
  html?: string;
  lastSentDate?: string;
}

let activeSubscriptions: ScheduledSub[] = [];
const defaultPass = typeof Buffer !== 'undefined' ? Buffer.from('YmdveHV5amZicHltZGp1Yg==', 'base64').toString() : '';

function pibSmtpApiPlugin(): Plugin {
  return {
    name: 'pib-smtp-api',
    configureServer(server) {
      // 1. Send Instant Email Endpoint
      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const data = JSON.parse(body || '{}');
              const { recipientEmail, subject, text, html } = data;

              if (!recipientEmail) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Recipient email is required.' }));
                return;
              }

              const smtpUser = process.env.PIB_SMTP_USER || 'pib03112549@gmail.com';
              const smtpPass = process.env.PIB_SMTP_PASS || defaultPass;

              const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: smtpUser,
                  pass: smtpPass
                }
              });

              const info = await transporter.sendMail({
                from: `"Press Information Bureau" <${smtpUser}>`,
                to: recipientEmail,
                subject: subject || 'Official PIB Information Bulletin',
                text: text || 'Official PIB Bulletin',
                html: html || undefined
              });

              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                messageId: info.messageId,
                message: `Official PIB digest successfully dispatched to ${recipientEmail} via Gmail SMTP.`
              }));
            } catch (err: any) {
              const isBadCredentials = Boolean(err.message && err.message.includes('535'));
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: false,
                error: err.message,
                isBadCredentials,
                note: isBadCredentials
                  ? 'Gmail SMTP authentication: Google requires a 16-character App Password (generated in myaccount.google.com/apppasswords) rather than a regular account password.'
                  : err.message
              }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
      });

      // 2. Schedule Subscription Endpoint (Registers custom timing)
      server.middlewares.use('/api/schedule-subscription', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const sub = JSON.parse(body || '{}');
              if (sub.recipientEmail && sub.deliveryTimeIST) {
                activeSubscriptions = activeSubscriptions.filter(s => s.recipientEmail !== sub.recipientEmail);
                activeSubscriptions.push({
                  recipientEmail: sub.recipientEmail,
                  deliveryTimeIST: sub.deliveryTimeIST,
                  subject: sub.subject,
                  text: sub.text,
                  html: sub.html
                });
                res.statusCode = 200;
                res.end(JSON.stringify({
                  success: true,
                  message: `Subscription scheduled for ${sub.recipientEmail} daily at ${sub.deliveryTimeIST} (IST).`
                }));
                return;
              }
            } catch (e) {}
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid subscription schedule payload.' }));
          });
        } else if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            activeSchedules: activeSubscriptions.map(s => ({ email: s.recipientEmail, time: s.deliveryTimeIST, lastSent: s.lastSentDate }))
          }));
        } else {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }
      });

      // 3. Background Automated Schedule Runner (Checks every 30 seconds against Asia/Kolkata clock)
      setInterval(async () => {
        if (activeSubscriptions.length === 0) return;
        const now = new Date();
        const timeIST = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }); // e.g. "08:00 AM" or "10:30 PM"
        const dateKey = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        for (const sub of activeSubscriptions) {
          if (sub.deliveryTimeIST.trim().toUpperCase() === timeIST.trim().toUpperCase()) {
            if (sub.lastSentDate !== dateKey) {
              sub.lastSentDate = dateKey;
              try {
                const smtpUser = process.env.PIB_SMTP_USER || 'pib03112549@gmail.com';
                const smtpPass = process.env.PIB_SMTP_PASS || defaultPass;
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  auth: { user: smtpUser, pass: smtpPass }
                });
                await transporter.sendMail({
                  from: `"Press Information Bureau" <${smtpUser}>`,
                  to: sub.recipientEmail,
                  subject: sub.subject || `[Official PIB Digest] Daily Information Bulletin (${timeIST} IST)`,
                  text: sub.text || 'Official Daily PIB Digest',
                  html: sub.html || undefined
                });
              } catch (err: any) {
                console.error('[PIB Automated Scheduler Error]:', err.message);
              }
            }
          }
        }
      }, 30000);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    pibSmtpApiPlugin()
  ],
});
