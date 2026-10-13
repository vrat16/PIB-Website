import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Info } from 'lucide-react';
import { PibLogo } from '../brand/PibLogo';
import { useTranslation } from '../../i18n/useTranslation';

export const Footer: React.FC = () => {
  const { lang, t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-[#0b3558] text-sm mt-12">
      <div className="pib-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Column 1: About PIB */}
          <div className="space-y-3">
            <PibLogo variant="light" className="mb-2" />
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'पत्र सूचना कार्यालय के बारे में पढ़ें →' : 'Read Full About PIB & Divisions →'}</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Key Innovation Features */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-3 border-b border-slate-800 pb-1.5">
              Platform Innovations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/assistant" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>PIB AI Assistant (Local Grounded)</span>
                </Link>
              </li>
              <li>
                <Link to="/my-pib-feed" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>My PIB Feed & Scheduled Digest</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Smart Search 2.0 & Typo Filter</span>
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Saved Releases & Bookmarks</span>
                </Link>
              </li>
              <li>
                <Link to="/preferences" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>Persona Personalisation & Themes</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Headquarters */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-3 border-b border-slate-800 pb-1.5">
              {lang === 'hi' ? 'मुख्यालय एवं संपर्क' : 'Headquarters & Contact'}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="leading-relaxed">
                <strong className="text-slate-200">National Media Centre (NMC)</strong><br />
                7E Raisina Road, New Delhi - 110001
              </p>
              <p>
                <strong className="text-slate-300">Central Control:</strong> 011-23488000
              </p>
              <p>
                <strong className="text-slate-300">Fact Check Helpline:</strong> +91 87997 11259
              </p>
              <p>
                <strong className="text-slate-300">Email:</strong> mediafacilitation@pib.gov.in
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Standards */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 Press Information Bureau, Government of India</span>
            <span>•</span>
            <Link to="/preferences" className="hover:text-white underline">Accessibility Standards</Link>
            <span>•</span>
            <Link to="/preferences" className="hover:text-white underline">Language Policy</Link>
          </div>
          <div className="text-slate-500 text-[11px]">
            National Media Centre, New Delhi
          </div>
        </div>
      </div>
    </footer>
  );
};
