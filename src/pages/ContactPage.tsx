import React, { useState } from 'react';
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import { PageBanner } from '../components/public/PublicBlocks';
import { siteConfig, phoneHref, hasPublicEmail } from '../config/site.config';
import { CONTACT_SUBJECTS, ContactDraft, ContactSubject, sendContactMessage } from '../lib/contact';

interface ContactPageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const EMPTY_DRAFT: ContactDraft = { name: '', email: '', phone: '', subject: 'Renseignement', message: '' };

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand focus:border-transparent transition';

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onLoginClick }) => {
  const [draft, setDraft] = useState<ContactDraft>(EMPTY_DRAFT);
  // Champ invisible : seul un robot le remplit.
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const update = (field: keyof ContactDraft) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setDraft((previous) => ({ ...previous, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!draft.email.trim() && !draft.phone.trim()) {
      setError('Indiquez un numéro de téléphone ou une adresse email pour que nous puissions vous répondre.');
      return;
    }
    if (website) {
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      await sendContactMessage(draft);
      setStatus('sent');
      setDraft(EMPTY_DRAFT);
    } catch (err) {
      setStatus('idle');
      setError(
        `${err instanceof Error ? err.message : "Votre message n'a pas pu être envoyé."} Vous pouvez aussi nous appeler au ${siteConfig.contact.phone}.`,
      );
    }
  };

  return (
    <PublicLayout currentPage="contact" onNavigate={onNavigate} onLoginClick={onLoginClick}>
      <PageBanner
        eyebrow="Contact"
        title="Contactez-nous"
        description="Une question ? Le secrétariat vous répond rapidement."
      />

      <section className="container mx-auto px-4 lg:px-8 py-14">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-10">
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="bg-brand-light p-3 rounded-sm">
                <MapPin className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">Adresse</h3>
                {siteConfig.contact.addressLines.map((line) => (
                  <p key={line} className="text-gray-600 text-sm">{line}</p>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-brand-light p-3 rounded-sm">
                <Phone className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">Téléphone</h3>
                <a href={phoneHref(siteConfig.contact.phone)} className="text-gray-600 text-sm hover:text-brand">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            {hasPublicEmail() && (
              <div className="flex items-start gap-4">
                <div className="bg-brand-light p-3 rounded-sm">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">Email</h3>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-gray-600 text-sm hover:text-brand">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="bg-brand-light p-3 rounded-sm">
                <Clock className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-navy mb-1">Secrétariat</h3>
                <p className="text-gray-600 text-sm">Accueil des familles pendant les jours de classe.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            {status === 'sent' ? (
              <div className="bg-white p-8 shadow-md border-t-4 border-brand text-center" role="status">
                <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-navy">Message envoyé</h3>
                <p className="text-gray-600 mt-2">
                  Merci ! Votre message a bien été reçu par l'établissement. Nous vous répondrons par téléphone ou par
                  email dans les meilleurs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-brand font-semibold hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 shadow-md border-t-4 border-brand space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom et prénom <span className="text-red-600">*</span>
                  </label>
                  <input id="contact-name" type="text" value={draft.name} onChange={update('name')} className={inputClass} required minLength={2} maxLength={120} autoComplete="name" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input id="contact-phone" type="tel" value={draft.phone} onChange={update('phone')} className={inputClass} minLength={6} maxLength={30} autoComplete="tel" placeholder="06 000 00 00" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input id="contact-email" type="email" value={draft.email} onChange={update('email')} className={inputClass} maxLength={200} autoComplete="email" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 -mt-2">Téléphone ou email : au moins l'un des deux, pour pouvoir vous répondre.</p>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">Objet</label>
                  <select
                    id="contact-subject"
                    value={draft.subject}
                    onChange={(e) => setDraft((previous) => ({ ...previous, subject: e.target.value as ContactSubject }))}
                    className={inputClass}
                  >
                    {CONTACT_SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea id="contact-message" value={draft.message} onChange={update('message')} rows={5} className={inputClass} required minLength={5} maxLength={3000} />
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Site web</label>
                  <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                {error && (
                  <p className="text-sm text-red-700 bg-red-50 rounded-lg px-4 py-3" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-brand text-white py-3 rounded-sm font-display uppercase tracking-wider font-semibold hover:bg-brand-dark transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
                </button>
                <p className="text-xs text-gray-500">
                  Vos coordonnées servent uniquement à vous répondre.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default ContactPage;
