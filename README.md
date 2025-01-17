# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# task-management

# Vite + React.js Project

This project is a web application built with **Vite** and **React.js**. It features **Google Authentication** powered by **Firebase Authentication** and uses **Tailwind CSS** for styling.

## Features

- **Fast Development with Vite**: The project uses Vite for lightning-fast builds and development.
- **React.js**: A modern JavaScript library for building user interfaces.
- **Google Authentication**: Implemented using Firebase Authentication, enabling secure user sign-in with Google.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ankabattulavamsi/task-management.git
   cd task-manager

# Install Dependencies:
# npm install


# Configure Firebase:

Create a Firebase project in the Firebase Console.
Enable Google Authentication in the Authentication section.
Add your Firebase configuration to the project.

# Start the Development Server:

# npm run dev
