import nodemailer from 'nodemailer';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { recipientEmail, subject, html, text } = data;

    if (!recipientEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Recipient email is required.' })
      };
    }

    const smtpUser = process.env.PIB_SMTP_USER || 'pib03112549@gmail.com';
    const smtpPass = process.env.PIB_SMTP_PASS || 'bgoxuyjfbpymdjub';

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId,
        message: `Official PIB digest successfully dispatched to ${recipientEmail} via Gmail SMTP.`
      })
    };
  } catch (error) {
    const isBadCredentials = Boolean(error.message && error.message.includes('535'));
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        isBadCredentials,
        note: isBadCredentials 
          ? 'Gmail SMTP authentication: Google requires a 16-character App Password (generated in myaccount.google.com/apppasswords) rather than a regular account password.'
          : error.message
      })
    };
  }
};
