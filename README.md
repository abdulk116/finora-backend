# Finora Backend

Backend API for **Finora**, a personal finance and loan tracking application built with Node.js, Express, and MongoDB.

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT** — Authentication
* **bcryptjs** — Password hashing
* **CORS**
* **dotenv**
* **Nodemon** — Development

## 📁 Project Structure

```text
finora-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── loanController.js
│   └── expensesController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Loan.js
│   └── Expense.js
│
├── routes/
│   ├── authRoutes.js
│   ├── loanRoutes.js
│   └── expensesRoutes.js
│
├── .env
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
```

> The actual project structure may vary depending on the modules currently implemented.

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/finora-backend.git
```

Move into the project:

```bash
cd finora-backend
```

Install dependencies:

```bash
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/finora
JWT_SECRET=your_secret_key
PORT=5000
```

For production, use your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/finora
JWT_SECRET=your_production_secret
```

### ⚠️ Security

Never commit your `.env` file to GitHub.

The repository should contain `.env.example` instead:

```env
MONGO_URI=
JWT_SECRET=
PORT=
```

## ▶️ Running the Application

### Development

```bash
npm run dev
```

The development server will run on:

```text
http://localhost:5000
```

### Production

```bash
npm start
```

The application uses the `PORT` environment variable when provided by the hosting platform.

## 🌐 API

Base URL:

```text
/api
```

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Loans

```text
GET    /api/loans
POST   /api/loans
GET    /api/loans/:id
PUT    /api/loans/:id
DELETE /api/loans/:id
```

### Expenses

```text
GET    /api/expenses
POST   /api/expenses
GET    /api/expenses/:id
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

> API endpoints may change as the Finora application continues to evolve.

## 🗄️ Database

Finora uses MongoDB with Mongoose.

### Local Development

```text
mongodb://127.0.0.1:27017/finora
```

### Production

MongoDB Atlas is used for the production database.

```text
mongodb+srv://...
```

The production database credentials should be stored as environment variables and never committed to the repository.

## 🔒 Authentication

Finora uses JWT-based authentication.

Passwords are securely hashed using `bcryptjs`.

Protected API requests require a valid JWT token.

Example:

```http
Authorization: Bearer <token>
```

## 🚀 Deployment

The backend can be deployed using **Render**.

### Render Configuration

**Build Command**

```bash
npm install
```

**Start Command**

```bash
npm start
```

Required environment variables:

```text
MONGO_URI
JWT_SECRET
```

Render automatically provides:

```text
PORT
```

The application uses:

```js
const PORT = process.env.PORT || 5000;
```

## 🧪 API Testing

You can test the API using:

* Postman
* Thunder Client
* Insomnia
* Frontend application

Example health check:

```http
GET /
```

Response:

```json
{
  "success": true,
  "message": "Finora API is running..."
}
```

## 🛠️ Development

Start the development server:

```bash
npm run dev
```

The project uses **Nodemon** for automatic server restarting during development.

## 📌 Project Status

Finora Backend is under active development.

### Current Modules

* Authentication
* Loan Management
* Expense Management
* MongoDB Database
* JWT Authentication

### Planned Modules

* EMI Management
* Accounts
* Income Management
* Dashboard
* Reports
* Notifications
* Financial Analytics
* AI Financial Insights

## 👨‍💻 Author

**Abdul Kareem**

Finora — Personal Finance Management Application

---

## 📄 License

This project is currently for personal/development use.
