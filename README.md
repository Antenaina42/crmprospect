# Prospect Mada CRM 🇲🇬

Application Web SaaS moderne de prospection commerciale B2B dédiée aux entreprises de Madagascar.

## 🚀 Stack Technique
- **Framework**: Next.js 15 (App Router) + React 18 / 19
- **Langage**: TypeScript
- **Styles**: Tailwind CSS (Light Theme uniquement, design Stripe / Linear / Notion inspired)
- **Base de données & ORM**: MySQL / SQLite via Prisma ORM
- **Authentification**: NextAuth.js (Auth.js) avec stratégie Credentials & Rôles (Super Admin, Admin, Commercial)
- **APIs**: API Officielle Google Places (Recherche textuelle et Nearby Search)
- **Animations**: Framer Motion
- **Icônes**: Lucide React
- **Graphiques**: Recharts
- **Exports**: PDF (`jspdf` + `jspdf-autotable`), Excel (`xlsx`), CSV (`papaparse`)
- **Déploiement**: Prêt pour Docker (`docker-compose.yml`)

---

## 🔑 Comptes de Démo Pré-configurés
Les mots de passe de tous les comptes démo sont : `admin123`

| Rôle | Email | Description |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@prospectmada.mg` | Accès complet à l'ensemble du CRM |
| **Admin** | `admin@prospectmada.mg` | Chef des Ventes & Supervision |
| **Commercial** | `rakoto@prospectmada.mg` | Commercial terrain Rakoto Jean |
| **Commercial** | `rasoa@prospectmada.mg` | Commerciale Rasoa Marie |

---

## 🛠️ Installation & Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Initialisation de la base de données
```bash
npx prisma db push
node prisma/seed.js
```

### 3. Lancement du serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🐳 Déploiement avec Docker
```bash
docker-compose up --build -d
```

---

## 🌟 Fonctionnalités Clés
1. **Module Google Places Madagascar** : Recherche par catégorie B2B (BTP, Garages, Hôtels, Pharmacies, Avocats, etc.) et villes de Madagascar (Antananarivo, Majunga, Tamatave, Antsirabe, etc.) avec sélection multiple et import direct.
2. **Fiche Prospect 360°** : Suivi des statuts, niveau de priorité, historique des appels, agenda & rappels, création de devis MGA et conversion en client en 1 clic.
3. **Tableau de bord Exécutif** : KPIs en temps réel et graphiques Recharts.
4. **Devis & Exports** : Génération instantanée de devis PDF et exports Excel/CSV.
