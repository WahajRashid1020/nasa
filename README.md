# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


 

This project is a full stack web application that allows users to explore NASA's public APIs, including the Astronomy Picture of the Day (APOD), EPIC Earth imagery, SpaceX launches, and rocket comparisons using OpenAI.

---

## 🌐 Tech Stack

### Frontend:

- React + Vite
- Tailwind CSS
- React Router
- Framer Motion (for animations)
- Spline (3D scenes)
- Axios

### Backend:

- Node.js + Express
- Axios
- dotenv
- CORS
- OpenAI API (for rocket comparisons)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nasa-explorer.git
cd nasa-explorer

#for backend
cd backend
npm install

create .env file then add

NASA_API_KEY=your_nasa_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000

node server.js or npm start

#for frontend
cd frontend
npm install

create and add in .env

VITE_BACKEND_URL=http://localhost:5000

npm run dev


This project is for educational purposes and uses public NASA and SpaceX APIs. Built by Wahaj Rashid.

```
