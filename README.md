# ASSERT Frontend

This is the frontend for **ASSERT** – a blockchain-based prediction platform. The project is built using React with Vite, Tailwind CSS, and DaisyUI, and communicates with a Node.js backend via REST API.

---

## Project Structure

```
├── public/                   # Static files
├── dist/                     # Production build output
├── node_modules/             # Installed dependencies
├── src/
│   ├── api/                  # API request handlers
│   ├── assets/               # Images and static media
│   ├── components/           # Reusable UI components
│   ├── Context/              # React Context for global state
│   ├── Layout/               # Layout wrappers like sidebar, headers
│   ├── Page/                 # Page views (e.g., Landing, Dashboard)
│   ├── redux/                # Redux store and slices
│   ├── Services/             # Axios services for external API calls
│   ├── utils/                # Helper functions
│   ├── App.css               # Global styles
│   ├── App.jsx               # Main App component
│   ├── main.jsx              # Entry point
│   └── routes.jsx            # Route definitions
├── .env                      # Environment variables
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Features

- React 18 + Vite setup for fast development
- TailwindCSS + DaisyUI for responsive and modern UI
- Axios-based API integration with backend
- Redux for global state management
- Framer Motion for smooth animations
- Dynamic routing via React Router
- Custom layout structure (header/sidebar)
- Token-based voting and prediction flow

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

### 3. Configure environment variables
Create a `.env` file in the root with:

```
VITE_API_BASE_URL=https://your-server-url.com
```

> Refer to the backend repo here: [ASSERT Backend](https://github.com/Rafin31/Assert-backend)

### 4. Run the development server
```bash
npm run dev
```

---

## Available Scripts

- `npm run dev` – Start the local development server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build locally

---

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- DaisyUI
- Redux Toolkit
- Axios
- React Router DOM
- Framer Motion

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Credits

Developed as part of the **ASSERT Capstone Project** at the University of Wollongong by Team ASSERT.
