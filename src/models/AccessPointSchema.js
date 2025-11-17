// models/AccessPoint.js

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AccessPointSchema = new Schema(
  {
    // Cihazı senin sisteminde tanımlayan id
    id: {
      type: String,
      required: true,
      unique: true, // aynı id iki kez olmasın
      trim: true,
    },

    // MAC adresi
    mac: {
      type: String,
      required: true,
      unique: true, // istersen kaldırabilirsin
      trim: true,
      uppercase: true,
    },

    // Seri numarası
    serialNumber: {
      type: String,
      required: true,
      unique: true, // istersen kaldırabilirsin
      trim: true,
    },

    // Üretim yılı
    productionYear: {
      type: String,
      required: true,
      trim: true,
    },

    // Model adı / kodu
    model: {
      type: String,
      required: true,
      trim: true,
    },

    // Lokasyon bilgisi (ör: "İstanbul Ofis 3. Kat")
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Durum (örnek enum — keyfi, ihtiyacına göre değiştir)
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "faulty", "maintenance"],
      default: "active",
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt otomatik eklensin
    versionKey: false, // __v alanını kapat
  }
);

// Sık kullanılan alanlara index (performans için)
AccessPointSchema.index({ mac: 1 });
AccessPointSchema.index({ serialNumber: 1 });

// Model oluşturup export et
const AccessPoint = model("AccessPoint", AccessPointSchema);

export default AccessPoint;
