// Import necessary modules
import crypto from "crypto";

// Dotenv configuration
import dotenv from "dotenv";
dotenv.config();

const algorithm = "aes-256-cbc";

// Throw error if key is missing
if (!process.env.SECRET_ENCRYPTION_KEY) {
  throw new Error("SECRET_ENCRYPTION_KEY is not set in environment variables.");
}

const secretKey = crypto
  .createHash("sha256")
  .update(process.env.SECRET_ENCRYPTION_KEY)
  .digest();

// Encrypts a string using AES-256-CBC.
const encrypt = (text) => {
  if (typeof text !== "string") throw new TypeError("Text must be a string.");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

// Decrypts a string using AES-256-CBC.
const decrypt = ({ content, iv }) => {
  if (!content || !iv) throw new Error("Invalid encrypted data.");
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
};

// Export the encrypt and decrypt functions
export { encrypt, decrypt };
