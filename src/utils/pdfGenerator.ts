import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { PressRelease } from '../types';

/**
 * Renders an HTML element onto a multipage A4 jsPDF document and triggers download.
 */
async function renderHtmlElementToPdf(container: HTMLElement, fileName: string) {
  document.body.appendChild(container);
  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution for crystal clear print
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save(fileName);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Generates and triggers download of an individual official PIB Press Release in PDF format.
 * Uses native HTML canvas rendering to guarantee 100% correct font rendering in both English and Hindi (Devanagari).
 */
export async function generateReleasePdf(release: PressRelease) {
  if (typeof document === 'undefined') return;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // standard A4 at 96dpi (210mm)
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", "Mangal", "Nirmala UI", sans-serif';
  container.style.padding = '40px 48px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.6';

  const formattedDate = new Date(release.publishedAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const isHindi = release.language === 'hi' || /[\u0900-\u097F]/.test(release.title);

  container.innerHTML = `
    <div>
      <!-- National Tricolor Bar -->
      <div style="display: flex; height: 4px; width: 100%; margin-bottom: 12px;">
        <div style="background-color: #ff671f; flex: 1;"></div>
        <div style="background-color: #ffffff; flex: 1; border: 1px solid #e2e8f0;"></div>
        <div style="background-color: #138808; flex: 1;"></div>
      </div>

      <!-- Masthead Header -->
      <div style="text-align: center; border-bottom: 2px solid #0b3558; padding-bottom: 14px; margin-bottom: 20px;">
        <p style="color: #b45309; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">
          ${isHindi ? 'भारत सरकार • GOVERNMENT OF INDIA' : 'GOVERNMENT OF INDIA • भारत सरकार'}
        </p>
        <h1 style="color: #0b3558; font-size: 24px; margin: 4px 0; font-family: Georgia, serif; font-weight: bold;">
          ${isHindi ? 'पत्र सूचना कार्यालय (PIB)' : 'PRESS INFORMATION BUREAU'}
        </h1>
        <p style="color: #64748b; font-size: 11px; margin: 0;">
          National Media Centre, 7E Raisina Road, New Delhi 110001 • Official Gazette Record
        </p>
      </div>

      <!-- Ministry & Metadata Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <div style="color: #0b3558; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${release.ministry}
          </div>
          <div style="color: #64748b; font-size: 11px; margin-top: 3px;">
            ${isHindi ? 'जारी किया गया:' : 'Posted On:'} ${formattedDate} • ${release.location || 'New Delhi'} • ${release.category}
          </div>
        </div>
        <div>
          <span style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 4px; font-family: monospace; font-size: 12px; font-weight: bold; color: #1e293b;">
            PRID: ${release.prid}
          </span>
        </div>
      </div>

      <!-- Title Headline -->
      <h2 style="color: #0f172a; font-size: 19px; line-height: 1.45; margin: 0 0 18px 0; font-weight: bold;">
        ${release.title}
      </h2>

      <!-- Article Body Paragraphs -->
      <div style="color: #334155; font-size: 13px; line-height: 1.75; margin-bottom: 24px;">
        ${(release.originalText || release.excerpt || '').split('\n\n').map(p => `<p style="margin: 0 0 14px 0; text-align: justify;">${p}</p>`).join('')}
      </div>

      <!-- Official Key Figures -->
      ${release.keyFigures && release.keyFigures.length > 0 ? `
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <h3 style="color: #0b3558; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">
            ${isHindi ? 'प्रमुख आधिकारिक आंकड़े एवं लक्ष्य' : 'OFFICIAL KEY FIGURES & TARGETS'}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            ${release.keyFigures.map(kf => `
              <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px;">
                <div style="color: #64748b; font-size: 11px;">${kf.metric}</div>
                <div style="color: #047857; font-size: 15px; font-weight: bold; margin: 2px 0;">${kf.value}</div>
                <div style="color: #94a3b8; font-size: 10px;">${kf.context}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Summary Highlights -->
      ${release.summaryBullets && release.summaryBullets.length > 0 ? `
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <h3 style="color: #0369a1; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 0 0 8px 0;">
            ${isHindi ? 'मुख्य सार एवं मुख्य बिंदु' : 'SUMMARY HIGHLIGHTS'}
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 12px; line-height: 1.65;">
            ${release.summaryBullets.map(b => `<li style="margin-bottom: 5px;">${b}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Footer Bar -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 28px; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;">
        <span>Press Information Bureau (PIB), Government of India • PRID: ${release.prid}</span>
        <span>Official Gazette Record • pib.gov.in</span>
      </div>
    </div>
  `;

  await renderHtmlElementToPdf(container, `PIB_Release_${release.prid}.pdf`);
}

/**
 * Generates and triggers download of a personalized PIB Daily Digest Bulletin in PDF format.
 */
export async function generateDigestPdf(subscriberEmail: string, matchingReleases: PressRelease[]) {
  if (typeof document === 'undefined') return;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", "Mangal", sans-serif';
  container.style.padding = '40px 48px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.6';

  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div>
      <div style="display: flex; height: 4px; width: 100%; margin-bottom: 12px;">
        <div style="background-color: #ff671f; flex: 1;"></div>
        <div style="background-color: #ffffff; flex: 1; border: 1px solid #e2e8f0;"></div>
        <div style="background-color: #138808; flex: 1;"></div>
      </div>

      <div style="text-align: center; border-bottom: 2px solid #0b3558; padding-bottom: 14px; margin-bottom: 20px;">
        <p style="color: #b45309; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">
          GOVERNMENT OF INDIA • भारत सरकार
        </p>
        <h1 style="color: #0b3558; font-size: 24px; margin: 4px 0; font-family: Georgia, serif; font-weight: bold;">
          PRESS INFORMATION BUREAU
        </h1>
        <p style="color: #64748b; font-size: 11px; margin: 0;">
          Official Daily Information Bulletin • Dispatched on ${dateStr}
        </p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
        <span style="font-weight: bold; color: #0b3558; font-size: 12px;">OFFICIAL SUBSCRIBED FEED SUMMARY</span>
        <div style="color: #64748b; font-size: 11px; margin-top: 2px;">
          Subscriber: ${subscriberEmail} • Total matching releases: ${matchingReleases.length}
        </div>
      </div>

      <div style="space-y: 16px;">
        ${matchingReleases.slice(0, 8).map((rel, index) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px; background: #ffffff;">
            <div style="color: #b45309; font-size: 11px; font-weight: bold; text-transform: uppercase;">
              ${index + 1}. [${rel.ministry}] • PRID: ${rel.prid}
            </div>
            <h3 style="color: #0f172a; font-size: 14px; font-weight: bold; margin: 4px 0 6px 0;">
              ${rel.title}
            </h3>
            <p style="color: #475569; font-size: 11px; margin: 0 0 8px 0; line-height: 1.5;">
              ${rel.excerpt}
            </p>
            <div style="font-size: 10px; color: #64748b;">
              Source Link: http://localhost:5174/release/${rel.id}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px; text-align: center; font-size: 10px; color: #94a3b8;">
        National Media Centre, 7E Raisina Road, New Delhi 110001 • Official PIB Communications
      </div>
    </div>
  `;

  await renderHtmlElementToPdf(container, `PIB_Digest_Bulletin_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generates and triggers download of Saved Releases in PDF format.
 */
export async function generateSavedReleasesPdf(savedReleases: PressRelease[]) {
  if (typeof document === 'undefined') return;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", "Mangal", sans-serif';
  container.style.padding = '40px 48px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.6';

  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div>
      <div style="display: flex; height: 4px; width: 100%; margin-bottom: 12px;">
        <div style="background-color: #ff671f; flex: 1;"></div>
        <div style="background-color: #ffffff; flex: 1; border: 1px solid #e2e8f0;"></div>
        <div style="background-color: #138808; flex: 1;"></div>
      </div>

      <div style="text-align: center; border-bottom: 2px solid #0b3558; padding-bottom: 14px; margin-bottom: 20px;">
        <p style="color: #b45309; font-size: 11px; font-weight: bold; letter-spacing: 1.5px; margin: 0; text-transform: uppercase;">
          GOVERNMENT OF INDIA • भारत सरकार
        </p>
        <h1 style="color: #0b3558; font-size: 24px; margin: 4px 0; font-family: Georgia, serif; font-weight: bold;">
          PRESS INFORMATION BUREAU
        </h1>
        <p style="color: #64748b; font-size: 11px; margin: 0;">
          Saved Releases & Policy Reference Dossier • Generated on ${dateStr}
        </p>
      </div>

      <div style="margin-bottom: 20px;">
        ${savedReleases.map((rel, index) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px; background: #ffffff;">
            <div style="color: #0b3558; font-size: 11px; font-weight: bold; text-transform: uppercase;">
              ${index + 1}. ${rel.ministry} • PRID: ${rel.prid}
            </div>
            <h3 style="color: #0f172a; font-size: 14px; font-weight: bold; margin: 4px 0 6px 0;">
              ${rel.title}
            </h3>
            <p style="color: #475569; font-size: 11px; margin: 0 0 8px 0; line-height: 1.5;">
              ${rel.excerpt}
            </p>
          </div>
        `).join('')}
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px; text-align: center; font-size: 10px; color: #94a3b8;">
        National Media Centre, 7E Raisina Road, New Delhi 110001 • Official PIB Archive
      </div>
    </div>
  `;

  await renderHtmlElementToPdf(container, `PIB_Saved_Dossier_${new Date().toISOString().slice(0, 10)}.pdf`);
}
