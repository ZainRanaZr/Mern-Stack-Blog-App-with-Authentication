# MERN Stack Blog App with Authentication

## Overview

This repository contains a simple blogging website built using the MERN stack (MongoDB, Express.js, React.js, and Node.js) with authentication implemented using JSON Web Tokens (JWT). The application allows users to create, edit, and delete blog posts, with login protection to ensure secure access.

## Features

- **User Authentication**: The application uses JWT for user authentication, providing a secure login system.
- **Blog Post CRUD Operations**: Users can create, read, update, and delete blog posts.
- **Responsive Design**: The frontend is built using React.js and is designed to be responsive for a seamless experience across devices.
- **Backend API**: The backend is powered by Node.js and Express.js, providing a robust API for data manipulation.
- **MongoDB Database**: Data is stored in a MongoDB database, ensuring scalability and flexibility.

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ZainRanaZr/Mern-Stack-Blog-App-with-Authentication.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Mern-Stack-Blog-App-with-Authentication
   ```

3. Install dependencies for both the frontend and backend:

   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

4. Set up the MongoDB database:
   - Create a MongoDB Atlas account or use a local MongoDB instance.
   - Update the MongoDB connection string in `backend/config/index.js` with your database credentials.

5. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend:

   ```bash
   cd frontend
   npm start
   ```

7. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the application.

## Configuration

- Update the JWT secret in `server/config/auth.js` for enhanced security.
- Customize the application according to your needs by modifying React components and backend logic.

## Contributing

If you would like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Thanks to the MERN stack for providing a powerful and efficient framework for web development.
- Special thanks to the open-source community for their valuable contributions.

Feel free to explore, enhance, and modify this project to meet your specific requirements! If you encounter any issues or have suggestions for improvement, please open an issue or create a pull request. Happy coding!
