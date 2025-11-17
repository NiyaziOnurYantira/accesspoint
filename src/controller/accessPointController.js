// src/controller/accessPointController.js

import { v4 as uuidv4 } from "uuid";
import AccessPoint from "../models/AccessPointSchema.js";
import { generateAccessPointQr } from "../utils/qrCodeGenerator.js";

export const createAccessPoint = async (req, res) => {
  try {
    const { mac, serialNumber, productionYear, model, location, status } =
      req.body;

    const id = uuidv4();

    const newAccessPoint = await AccessPoint.create({
      id,
      mac,
      serialNumber,
      productionYear,
      model,
      location,
      status,
    });

    // QR code üret
    const qrCode = await generateAccessPointQr(id);

    // İstersen response'a QR'ı da ekleyebilirsin
    return res.status(201).json({
      accessPoint: newAccessPoint,
      qrCode, // DataURL (frontend bunu <img src="..."> ile gösterebilir)
    });
  } catch (error) {
    console.error("Access Point oluşturulurken hata:", error);
    return res.status(500).json({
      message: "Access Point oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};
