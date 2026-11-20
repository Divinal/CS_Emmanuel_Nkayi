import React, { useCallback, useEffect, useState } from 'react';
import { Inbox, Mail, MailOpen, MessageCircle, Phone, RefreshCw, Trash2 } from 'lucide-react';
import { confirmDialog, notify } from '../ui/feedback';
import { NOTIFICATION_EVENT } from '../../lib/notifications';
import {
  ContactMessage,
  deleteContactMessage,
  fetchContactMessages,
  setContactMessageRead,
} from '../../lib/contact';

// Numéro congolais (9 chiffres commençant par 0) → lien WhatsApp international.
const whatsappLink = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('242') && digits.length >= 11) return `https://wa.me/${digits}`;
  if (digits.length === 9) return `https://wa.me/242${digits}`;
  return null;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

interface ContactInboxProps {
  onUnreadChange?: (count: number) => void;
}

// Messages envoyés par les visiteurs depuis la page Contact du site.
const ContactInbox: React.FC<ContactInboxProps> = ({ onUnreadChange }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchContactMessages();
      setMessages(rows);
      setLoadError('');
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Un nouveau message arrive avec une notification : la liste se recharge seule.
    const onNotification = (event: Event) => {
      const types = (event as CustomEvent<{ types?: string[] }>).detail?.types || [];
      if (types.includes('contact')) load();
    };
    window.addEventListener(NOTIFICATION_EVENT, onNotification);
    return () => window.removeEventListener(NOTIFICATION_EVENT, onNotification);
  }, [load]);

  const unreadCount = messages.filter((message) => !message.is_read).length;
  useEffect(() => {
    if (!loading && !loadError) onUnreadChange?.(unreadCount);
  }, [unreadCount, loading, loadError, onUnreadChange]);

  const toggleRead = async (message: ContactMessage) => {
    const next = !message.is_read;
    setMessages((previous) => previous.map((row) => (row.id === message.id ? { ...row, is_read: next } : row)));
    try {
      await setContactMessageRead(message.id, next);
    } catch (error) {
      notify(`❌ ${error instanceof Error ? error.message : 'Modification impossible.'}`);
      load();
    }
  };

  const remove = async (message: ContactMessage) => {
    const confirmed = await confirmDialog(`Supprimer définitivement le message de ${message.name} ?`, {
      title: 'Supprimer le message',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!confirmed) return;
    try {
      await deleteContactMessage(message.id);
      setMessages((previous) => previous.filter((row) => row.id !== message.id));
      notify('✅ Message supprimé');
    } catch (error) {
      notify(`❌ ${error instanceof Error ? error.message : 'Suppression impossible.'}`);
    }
  };

  const visible = filter === 'unread' ? messages.filter((message) => !message.is_read) : messages;

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Messages du site ({messages.length})</h2>
          <p className="text-sm text-gray-500">Demandes envoyées par les visiteurs depuis la page Contact.</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                filter === value ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-gray-100'
              }`}
            >
              {value === 'all' ? 'Tous' : `Non lus (${unreadCount})`}
            </button>
          ))}
          <button
            type="button"
            onClick={load}
            className="px-3 py-2 rounded-lg border hover:bg-gray-100"
            title="Actualiser"
            aria-label="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loadError ? (
        <p className="text-center py-8 text-red-700">{loadError}</p>
      ) : loading && messages.length === 0 ? (
        <p className="text-center py-8">Chargement...</p>
      ) : visible.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Inbox className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          {filter === 'unread' ? 'Aucun message non lu.' : 'Aucun message reçu pour le moment.'}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((message) => {
            const whatsapp = message.phone ? whatsappLink(message.phone) : null;
            return (
              <li
                key={message.id}
                className={`rounded-lg border p-4 ${message.is_read ? 'bg-white' : 'bg-indigo-50/60 border-indigo-200'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!message.is_read && <span className="w-2 h-2 rounded-full bg-indigo-600" aria-label="Non lu" />}
                      <span className="font-semibold text-gray-900">{message.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                        {message.subject}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(message.created_at)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRead(message)}
                      className="p-2 rounded hover:bg-gray-100 text-gray-700"
                      title={message.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                      aria-label={message.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                    >
                      {message.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(message)}
                      className="p-2 rounded hover:bg-red-50 text-red-600"
                      title="Supprimer"
                      aria-label={`Supprimer le message de ${message.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap break-words">{message.message}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  {message.phone && (
                    <a href={`tel:${message.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border hover:bg-gray-50">
                      <Phone className="w-4 h-4" /> {message.phone}
                    </a>
                  )}
                  {whatsapp && (
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  )}
                  {message.email && (
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(`Re : ${message.subject}`)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                    >
                      <Mail className="w-4 h-4" /> {message.email}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ContactInbox;
