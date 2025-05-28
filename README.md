# Privex Backend

Privex is a secure, privacy-focused backend service for sharing secrets via self-destructing links. This backend is built with **Node.js**, **Express**, and **MongoDB**, featuring robust encryption, automatic expiration, and "view once" functionality.

---

## 🚀 Features

- **AES-256 Encryption:** All secrets are encrypted before storage.
- **Self-Destructing Links:** Secrets expire after a set time or after being viewed once.
- **RESTful API:** Clean, versioned endpoints for secret creation and retrieval.
- **MongoDB TTL Index:** Automatic deletion of expired secrets.
- **Comprehensive Logging:** Winston-based logging with colorized console and file output.
- **Security Best Practices:** Helmet, CORS, and environment-based configuration.
- **Production-Ready:** Robust error handling, validation, and modular structure.

---

## 🛠️ Tech Stack

- **Node.js** & **Express** – API server
- **MongoDB** & **Mongoose** – Database and schema modeling
- **Zustand** (for frontend state, not used here)
- **Winston** – Logging
- **crypto** – AES-256-CBC encryption
- **dotenv** – Environment variable management
- **helmet** – Security headers
- **morgan** – HTTP request logging

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/privex-backend.git
   cd privex-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   
   MONGO_URL=your_mongodb_connection_string
   PORT=4000
   SECRET_ENCRYPTION_KEY=your_super_secret_key
   FRONTEND_URL=http://localhost:5173
   GET_SECRET_URL=https://your-frontend-domain.com/read
   NODE_ENV=development
   ```

---

## 🏗️ Project Structure

```
server/
├── src/
│   ├── controllers/
│   │   └── secret.controller.js
│   ├── db/
│   │   └── connect.js
│   ├── models/
│   │   └── secret.model.js
│   ├── routes/
│   │   └── secret.route.js
│   └── utils/
│       ├── crypto.js
│       └── logger.js
├── server.js
└── .env
```

---

## 🔐 API Endpoints

### Create a Secret

- **POST** `/api/v1/secret/create-secret`
- **Body:**
  ```json
  {
    "secretText": "your secret message",
    "expireAt": "2025-06-01T12:00:00.000Z",
    "viewOnce": true
  }
  ```
- **Response:**
  ```json
  {
    "message": "Secret created successfully",
    "uuid": "generated-uuid",
    "url": "https://your-frontend-domain.com/read/generated-uuid",
    "expireAt": "2025-06-01T12:00:00.000Z"
  }
  ```

### Read a Secret

- **GET** `/api/v1/secret/read-secret/:uuid`
- **Response (Success):**
  ```json
  {
    "secretText": "your secret message"
  }
  ```
- **Response (Expired):**
  ```json
  {
    "message": "Secret expired"
  }
  ```
- **Response (Not Found):**
  ```json
  {
    "message": "Secret not found"
  }
  ```

---

## 🛡️ Security

- **All secrets are encrypted** using AES-256-CBC before being stored in MongoDB.
- **Environment variables** are used for all sensitive configuration.
- **CORS** is restricted to your frontend domain.
- **Helmet** is used for secure HTTP headers.
- **Secrets are deleted** after expiration or after being viewed (if "view once" is enabled).

---

## 📝 Logging

- **Winston** is used for logging to both console (colorized) and file (`app.log`).
- All API requests and errors are logged for audit and debugging.

---

## 🩺 Health Check

- **GET** `/health`
- Returns `{ "status": "ok" }` for uptime monitoring.

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Winston](https://github.com/winstonjs/winston)
- [Helmet](https://helmetjs.github.io/)
- [dotenv](https://github.com/motdotla/dotenv)

---

> Made with ❤️ by HARSHIT X CODE
