import { supabase } from './supabaseClient';

// Mêmes valeurs que la contrainte CHECK de la table contact_messages.
export const CONTACT_SUBJECTS = ['Inscription', 'Renseignement', 'Scolarité et frais', 'Vie scolaire', 'Autre'] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: ContactSubject;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactDraft {
  name: string;
  email: string;
  phone: string;
  subject: ContactSubject;
  message: string;
}

// Message lisible par un visiteur, quelle que soit l'erreur technique.
const friendlyError = (error: { code?: string; message?: string }): string => {
  if (error.code === 'P0001' && error.message) return error.message; // anti-envoi en masse
  if (error.code === 'PGRST205') return "Le service de messagerie n'est pas encore activé.";
  if (error.code === '23514') return 'Vérifiez les champs du formulaire (nom, email ou téléphone, message).';
  return "Votre message n'a pas pu être envoyé.";
};

// Le visiteur n'a pas le droit de relire la table : insertion sans retour de ligne.
export const sendContactMessage = async (draft: ContactDraft): Promise<void> => {
  const { error } = await supabase.from('contact_messages').insert({
    name: draft.name.trim(),
    email: draft.email.trim() || null,
    phone: draft.phone.trim() || null,
    subject: draft.subject,
    message: draft.message.trim(),
  });
  if (error) {
    console.error('Erreur envoi message de contact:', error);
    throw new Error(friendlyError(error));
  }
};

export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, phone, subject, message, is_read, created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw new Error(friendlyError(error));
  return (data || []) as ContactMessage[];
};

export const countUnreadContactMessages = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('is_read', false);
  if (error) return 0;
  return count ?? 0;
};

export const setContactMessageRead = async (id: string, isRead: boolean): Promise<void> => {
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
  if (error) throw new Error(friendlyError(error));
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw new Error(friendlyError(error));
};
