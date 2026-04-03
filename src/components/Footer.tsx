'use client'

import { Mail, FileText, Shield } from 'lucide-react'
import { translations, Language } from '@/lib/translations'

interface FooterProps {
  language: Language
}

export function Footer({ language }: FooterProps) {
  const t = (key: keyof typeof translations.en) => 
    translations[language][key] || translations.en[key]

  return (
    <footer className="bg-black/50 border-t border-green-500/30 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-green-400 font-semibold mb-4">{t('company')}</h3>
            <p className="text-gray-300 text-sm mb-2">
              {t('powered')}
            </p>
            <p className="text-gray-400 text-xs">
              {t('rights')}
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-green-400 font-semibold mb-4">{t('legal')}</h3>
            <div className="space-y-2">
              <a
                href="/privacy"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                <Shield className="w-4 h-4" />
                {t('privacy')}
              </a>
              <a
                href="/terms"
                className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                {t('terms')}
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-green-400 font-semibold mb-4">{t('support')}</h3>
            <a
              href="mailto:bulletbait604@gmail.com"
              className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              bulletbait604@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-500/30 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-xs">
            {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
