import { Secret } from "../models/secret.model.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

export const createSecret = async (req, res) => {
  try {
    const { secretText, expireAt, viewOnce = false } = req.body;

    if (!secretText || !expireAt) {
      return res.status(400).json({
        message: "Secret text and expiration date are required",
      });
    }

    // Validate expireAt
    const expireDate = new Date(expireAt);
    if (isNaN(expireDate.getTime())) {
      return res.status(400).json({ message: "Invalid expiration date" });
    }

    // Optionally limit secret length
    if (secretText.length > 1000) {
      return res.status(400).json({ message: "Secret text too long" });
    }

    // Encrypt the secret text
    const encrypted = encrypt(secretText);

    // Store both content and iv as a JSON string in encryptedSecret
    const newSecret = new Secret({
      uuid: uuidv4(),
      encryptedSecret: JSON.stringify(encrypted),
      expireAt: expireDate,
      viewOnce,
    });

    await newSecret.save();

    const url = process.env.GET_SECRET_URL + `/${newSecret.uuid}`;

    return res.status(201).json({
      message: "Secret created successfully",
      uuid: newSecret.uuid,
      url,
      expireAt: newSecret.expireAt,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Error creating secret",
      error: error.message,
    });
  }
};

export const viewSecret = async (req, res) => {
  try {
    const { uuid } = req.params;
    const secretDoc = await Secret.findOne({ uuid });

    if (!secretDoc) {
      return res.status(404).json({ message: "Secret not found" });
    }

    // If expired, delete if viewOnce, then return expired message
    if (new Date() > secretDoc.expireAt) {
      if (secretDoc.viewOnce) {
        await Secret.deleteOne({ uuid });
      }
      return res.status(410).json({ message: "Secret expired" });
    }

    // Decrypt secret
    const encrypted = JSON.parse(secretDoc.encryptedSecret);
    const secretText = decrypt(encrypted);

    // If viewOnce, delete after reading
    if (secretDoc.viewOnce) {
      await Secret.deleteOne({ uuid });
    }

    return res.status(200).json({ secretText });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "Error retrieving secret", error: error.message });
  }
};
