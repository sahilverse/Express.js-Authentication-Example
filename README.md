# Express.js Authentication Example

This is a simple authentication example using Express.js. It demonstrates how to implement user authentication with JWT (JSON Web Token).

## Features
- User registration
- User login with JWT authentication
- Protected routes
- Password hashing using bcrypt
- Environment variable support with dotenv

## Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose for ODM)
- JSON Web Token (JWT)
- bcrypt for password hashing
- dotenv for environment variables

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/express-auth-example.git
   cd express-auth-example
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_database_url
   ACCESS_TOKEN_SECRET=this_is_a_secret_key
   REFRESH_TOKEN_SECRET=this_is_a_refresh_secret_key
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

### Register User
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### Login User
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

## License
This project is licensed under the MIT License.

## Contact
For any inquiries, contact [the.sahil.verse@gmail.com](mailto:the.sahil.verse@gmail.com).

