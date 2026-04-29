<div align="center">
  <h1>✈️ Aerogarage</h1>
  <p><strong>A Next-Generation Aviation & Facility Management Platform</strong></p>

  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-teal.svg)](https://tailwindcss.com/)
</div>

<br />

## 📖 Overview

**Aerogarage** is a comprehensive, full-stack web application tailored for aviation enterprise management. Built with modern web technologies, it features a highly scalable architecture that integrates four distinct portals to serve various stakeholders: Public Users, Airline/Airport Clients, Trainees, and Administrators.

## 🚀 Key Features

- **Public Portal**: Engaging landing pages, services overviews, career boards, and contact systems.
- **Client Portal**: Dedicated dashboard for airlines and airport clients to manage requests and track services.
- **Training Portal**: Educational hub for students and trainees to access courses, progress, and assessments.
- **Admin System**: Internal control panel for managing users, monitoring systems, and overseeing operations.
- **Real-Time Communication**: Integrated WebSocket support for live updates.
- **Background Processing**: Redis and BullMQ for robust job scheduling and email dispatching.
- **3D Integrations**: Immersive 3D model viewing utilizing React Three Fiber.

## 💻 Tech Stack

### Frontend (`/aerogarage`)
- **Core Framework**: React 19, React Router v7
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4, Lucide React (Icons)
- **State & Data Fetching**: TanStack React Query, Axios
- **Graphics & Visualization**: Three.js, React Three Fiber/Drei, Recharts

### Backend (`/server`)
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Caching & Queues**: Redis, BullMQ
- **Authentication**: JWT (JSON Web Tokens), bcrypt
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)

## 🏗️ Architecture

The monorepo is divided into two primary environments:

```bash
myproj/
├── aerogarage/           # Frontend React Application
│   ├── src/
│   │   ├── modules/      # Portal-specific logic (public, client, training, admin)
│   │   ├── components/   # Shared UI components
│   │   └── services/     # API integration layer
├── server/               # Backend Node.js/Express API
│   ├── src/
│   │   ├── modules/      # Modular REST endpoints matching frontend portals
│   │   ├── shared/       # Shared models and utilities
│   │   ├── config/       # Environment & DB configurations
│   │   └── workers/      # BullMQ background job processors
```

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher recommended)
- MongoDB (Local instance or Atlas URI)
- Redis (Required for BullMQ background jobs)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sandeep-lpu/Aerogarage.git
   cd Aerogarage
   ```

2. **Setup Backend:**
   ```bash
   cd server
   npm install
   # Configure your environment variables in a .env file based on server/src/config/env.js
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../aerogarage
   npm install
   npm run dev
   ```

4. The application will be running locally. Check your terminal output for the designated local host ports.

## 🧪 Testing & QA

End-to-end smoke tests and admin route validations are provided in the `server/scripts/` directory.

```bash
# Run backend smoke tests
cd server
npm run test

# Run admin-specific tests
npm run test:admin
```

## 📄 License

This project is proprietary and confidential. Unauthorized copying of files, via any medium, is strictly prohibited.
