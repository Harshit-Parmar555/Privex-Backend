import mongoose from "mongoose";

const secretSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    encryptedSecret: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
      expires: 0,
    },
    viewOnce: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Secret = mongoose.model("Secret", secretSchema);
