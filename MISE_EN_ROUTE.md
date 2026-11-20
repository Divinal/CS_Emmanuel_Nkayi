# Mise en route — Complexe Scolaire Emmanuel (Nkayi)

Application de gestion scolaire et site vitrine du Complexe Scolaire Emmanuel.
Projet Supabase : `ucpnjgcdpnjaysapdkwa`.

## Déjà fait

| Élément | Où |
|---|---|
| Nom, devise « Amour – Travail – Réussite », adresse (Rue Nzaou Kayes, n° 47), téléphone, directeur (Durand Précieux MANKESSI) | `src/config/site.config.ts` |
| Logo de l'école (rond, fond transparent) | `public/Images/logo-cs-emmanuel.png` |
| Cycles : Garderie, Préscolaire, Primaire, Collège, Lycée | `site.config.ts` → `cycles` |
| Matricules au format `EM-6E260001` | `supabase/functions/admin-users/handler.ts` |
| Clés Supabase (URL + clé publishable) | `.env` (fichier local, jamais envoyé sur GitHub) |

## 1. Créer les tables (3 fichiers, dans l'ordre)

Dans Supabase → **SQL Editor** → **New query**, copiez-collez **tout** le contenu de chaque fichier
puis cliquez **Run**, un fichier après l'autre :

1. `supabase/migrations/20261120000001_structure_roles_finances.sql`
2. `supabase/migrations/20261120000002_niveaux_notes_notifications.sql`
3. `supabase/migrations/20261120000003_inscriptions_corbeille_contact.sql`

Chaque fichier doit afficher « Success. No rows returned ». À n'exécuter qu'une fois, sur une base vide.

(Autre possibilité, en une commande : `npx supabase link --project-ref ucpnjgcdpnjaysapdkwa` puis `npx supabase db push`.)

## 2. Déployer la fonction serveur (création des comptes, matricules, inscriptions)

Dans un terminal ouvert dans ce dossier :

```powershell
npx supabase login
```
```powershell
npx supabase link --project-ref ucpnjgcdpnjaysapdkwa
```
```powershell
npx supabase functions deploy admin-users --no-verify-jwt
```
```powershell
npx supabase secrets set SCHOOL_CODE=EM
```

## 3. Premier compte administrateur

1. Supabase → **Authentication → Users → Add user** : email et mot de passe du directeur, cochez *Auto Confirm User*.
2. SQL Editor :
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' FROM auth.users WHERE email = 'email-du-directeur@exemple.com';
   ```

## 4. Mettre en ligne sur Vercel

1. https://vercel.com/new → importez le dépôt `Divinal/CS_Emmanuel_Nkayi`.
2. **Environment Variables** :
   - `VITE_SUPABASE_URL` = `https://ucpnjgcdpnjaysapdkwa.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = la clé `sb_publishable_…` (la même que dans `.env`)
3. **Deploy**, puis reportez l'adresse obtenue :
   - dans `siteUrl` (`src/config/site.config.ts`) ;
   - dans Supabase → **Authentication → URL Configuration** (Site URL et Redirect URLs).

## À compléter

- `contact.email` dans `site.config.ts` : l'email de l'école (tant qu'il reste `contact@exemple.com`, il n'est pas affiché).
- `src/content/events.ts` : l'agenda reprend un calendrier type (rentrée, compositions, Noël, examens d'État…) ; ajustez les dates à celles de l'école.
- Photos d'élèves par cycle : voir `public/Images/eleves/LISEZ-MOI.txt`.

## Tester en local

```powershell
npm install
```
```powershell
npm run dev
```
