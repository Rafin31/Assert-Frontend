# ASSERT Frontend

Welcome to the frontend of **ASSERT** – a blockchain-powered prediction platform. This React + Vite application allows users to explore, vote, and create predictions across different domains like sports and politics. It integrates tightly with a backend service and smart contract for token-based reward logic.

---

## Project Structure

```
├── assets/               # Static assets (images, icons)
├── components/           # Reusable UI components
│   ├── header/
│   ├── hero/
│   ├── predictionCard/
│   └── ...
├── pages/                # Main page views
│   ├── LandingPage.jsx
│   ├── Dashboard/
│   └── ...
├── services/             # Axios services for API interaction
├── context/              # React Context (e.g., AuthContext)
├── routes/               # Route configuration
├── App.jsx               # App wrapper with layout
├── main.jsx              # Entry point
├── tailwind.config.js    # TailwindCSS config
└── vite.config.js        # Vite config
```

---

## Features

- React 18 with Vite for fast development
- Tailwind CSS and DaisyUI for consistent styling
- React Router for page navigation
- Token-based prediction and voting logic
- Context API for authentication state
- Framer Motion for animated transitions
- Axios for API communication with token-based auth
- Dashboards for user predictions, tokens, and threads

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/assert-frontend.git
cd assert-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment variables
Create a `.env` file in the root directory and add the following:

```
VITE_API_BASE_URL=https://your-server-url.com
```

> You can find the backend server or API URL in the [Backend Repository](https://github.com/Rafin31/Assert-backend)

### 4. Start the development server
```bash
npm run dev
```

---

## Available Scripts

- `npm run dev` – Start Vite development server
- `npm run build` – Build the project for production
- `npm run preview` – Preview the production build locally

---

## Technologies Used

- React.js with Vite
- Tailwind CSS and DaisyUI
- React Router DOM
- Context API
- Axios for HTTP requests
- Framer Motion for animations

---

## Contribution Guide

1. Fork the repository
2. Create a new branch: `git checkout -b feature/feature-name`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to your fork: `git push origin feature/feature-name`
5. Submit a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Credits

This project is developed as part of the **ASSERT Capstone** at the University of Wollongong.
