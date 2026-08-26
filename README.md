# E-commerce Website

## Overview

This is an E-Commerce website built using React & Vite. The project features user authentication and authorization, search functionality, product details pages, shopping cart and checkout functionality, and a wishlist feature.

## Features

-   User authentication and authorization
-   Search functionality
-   Product details page with images, descriptions, and reviews
-   Shopping cart and checkout functionality with stripe integration
-   Wishlist feature
-   Responsive design with mobile-friendly layout

## Technical Details

-   Front-end built using React, Vite, and Tailwind CSS
-   State management using React Context and Reducers
-   Form handling and validation using Formik and Yup

## Folder Structure

The project is organized in a modular structure, with separate folders for:

-   `src`: contains the application code
-   `assets`: contains static assets such as images and icons
-   `components`: contains reusable UI components
-   `context`: contains React context for state management
-   `pages`: contains routes for the application
-   `styles`: contains CSS styles for the application

## Dependencies

-   `@tanstack/react-query` for data fetching and caching
-   `@fortawesome/fontawesome-free` for icons
-   `react-router-dom` for client-side routing
-   `react-slick` for carousel functionality
-   `yup` for form validation
-   `axios` for making HTTP requests
-   `flowbite` for UI components
-   `formik` for form handling

## Local Development

To run the project locally:

1. Clone the repository using `git clone`
2. Install dependencies using `npm install`
3. Start the development server using `npm run dev` or `yarn dev`
4. Open the application in your browser at `http://localhost:5173/`

### Local PHP API and MySQL database

Install PHP 8.1+ with the `pdo_mysql` extension and MySQL (XAMPP is fine). The API uses the MySQL database named `3d-prints`; JSON files are no longer used for application data.

1. Open phpMyAdmin and import `backend/schema.sql`. This creates the database, tables, starter products, and one persisted demo order (`#PF-DEMO1`) for `demo@printforge.in` (password: `Demo@123`).
2. Copy `backend/.env.example` to `backend/.env` and set your MySQL credentials. If you use XAMPP defaults, `DB_USER=root` and an empty `DB_PASSWORD` usually work.
3. Start both Vite and the PHP API from the project root:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`, the API runs at `http://localhost:8000`, and the API reads `DB_*` environment variables. The frontend defaults to `http://localhost:8000/api/v1`; set `VITE_API_URL` in `.env` to the hosted API URL when the domain is ready.

Health check: `http://localhost:8000/api/v1/health`

## Video Demo

https://github.com/user-attachments/assets/8c5d7dd3-3130-482c-a7d7-0d9b690827aa
