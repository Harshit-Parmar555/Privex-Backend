import { Secret } from "../models/secret.model.js";
import { encrypt, decrypt } from "../utils/crypto.js";
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

    const url = process.env.GET_SECRET_URL + `/${newSecret.uuid}`;

    return res.status(201).json({
      message: "Secret created successfully",
      uuid: newSecret.uuid,
      url,
    });
  } catch (error) {
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
    if (secretDoc.viewed) {
      return res.status(410).json({ message: "Secret already viewed" });
    }
    if (new Date() > secretDoc.expireAt) {
      return res.status(410).json({ message: "Secret expired" });
    }

    // Decrypt secret
    const encrypted = JSON.parse(secretDoc.encryptedSecret);
    const secretText = decrypt(encrypted);

    // Mark as viewed
    secretDoc.viewed = true;
    await secretDoc.save();

    return res.status(200).json({ secretText });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving secret", error: error.message });
  }
};
