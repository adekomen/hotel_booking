# Hotel Booking - Gestion des Réservations

**Hotel Booking** est une application de gestion des réservations d’hôtels, construite avec **Node.js (Express)** pour le backend et **React (Vite + TypeScript + TailwindCSS)** pour le frontend.

## Technologies Utilisées

- **Backend** : Node.js, Express, MySQL, Sequelize
- **Frontend** : React 19, Vite, TypeScript, TailwindCSS
- **Autres** : Zustand, React Router, JWT, bcryptjs

## Installation et Configuration

### Prérequis

Avant de commencer, assure-toi d’avoir installé :

- **Node.js 18+**, **npm**
- **MySQL**
  
### Installation du Backend (Laravel)


- cd backend
- npm install
- cp .env.example .env
- npm run dev
- adapter le fichier /config/config.json suivant vos identifiants mysql
- npx sequelize db:migrate (pour éxécuter les migrations)

### Installation du Frontend (React + Vite + TypeScript + TailwindCSS)

- cd frontend
- npm install
- npm run dev
