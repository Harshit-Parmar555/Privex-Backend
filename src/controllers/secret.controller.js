import { Secret } from "../models/secret.model.js";
import { encrypt } from "../utils/crypto.js";
import { v4 as uuidv4 } from "uuid";

export const createSecret = async (req, res) => {
  try {
    const { secretText, expireAt } = req.body;

    if (!secretText || !expireAt) {
      return res.status(400).json({
        message: "Secret text and expiration date are required",
      });
    }

    // Encrypt the secret text
    const encrypted = encrypt(secretText);

    // Store both content and iv as a JSON string in encryptedSecret
    const newSecret = new Secret({
      uuid: uuidv4(),
      encryptedSecret: JSON.stringify(encrypted),
      expireAt: new Date(expireAt),
    });

    await newSecret.save();

    return res.status(201).json({
      message: "Secret created successfully",
      uuid: newSecret.uuid,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating secret",
      error: error.message,
    });
  }
};
