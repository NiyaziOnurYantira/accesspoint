// src/controller/accessPointController.js

import { v4 as uuidv4 } from "uuid";
import AccessPoint from "../models/AccessPointSchema.js";
import { generateAccessPointQr } from "../utils/qrCodeGenerator.js";
import { verifyAdmin } from "./adminController.js";

// Admin doğrulamalı Access Point oluşturma
export const createAccessPointWithAuth = async (req, res) => {
  try {
    const {
      id: bodyId,
      mac,
      serialNumber,
      emergencyPhone,
      model,
      location,
      status,
    } = req.body;

    // Eğer body'de id yoksa yine uuid üret
    const id = bodyId || uuidv4();

    const newAccessPoint = await AccessPoint.create({
      id,
      mac,
      serialNumber,
      emergencyPhone,
      model,
      location,
      status,
    });

    const qrCode = await generateAccessPointQr(id);

    return res.status(201).json({
      message: "Access Point başarıyla oluşturuldu.",
      accessPoint: newAccessPoint,
      qrCode,
      createdBy: req.admin.username,
    });
  } catch (error) {
    console.error("Access Point oluşturulurken hata:", error);
    return res.status(500).json({
      message: "Access Point oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};

// Eski createAccessPoint fonksiyonu (geriye uyumluluk için)
export const createAccessPoint = async (req, res) => {
  try {
    const {
      id: bodyId,
      mac,
      serialNumber,
      emergencyPhone,
      model,
      location,
      status,
    } = req.body;

    // Eğer body'de id yoksa yine uuid üret
    const id = bodyId || uuidv4();

    const newAccessPoint = await AccessPoint.create({
      id,
      mac,
      serialNumber,
      emergencyPhone,
      model,
      location,
      status,
    });

    const qrCode = await generateAccessPointQr(id);

    return res.status(201).json({
      accessPoint: newAccessPoint,
      qrCode,
    });
  } catch (error) {
    console.error("Access Point oluşturulurken hata:", error);
    return res.status(500).json({
      message: "Access Point oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};

export const getAccessPointById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "id parametresi gerekli",
      });
    }

    const accessPoint = await AccessPoint.findOne({ id });

    if (!accessPoint) {
      return res.status(404).json({
        message: "Bu id ile kayıtlı bir AccessPoint bulunamadı.",
      });
    }

    const qrCode = await generateAccessPointQr(id);

    return res.status(200).json({
      accessPoint,
      qrCode,
    });
  } catch (err) {
    console.error(`AccessPoint bilgisi getirilirken hata -> ${err}`);
    return res.status(500).json({
      message: "AccessPoint bilgisi getirilirken hata",
      error: err.message,
    });
  }
};

// Admin doğrulamalı Access Point güncelleme
export const updateAccessPointWithAuth = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "id parametresi gerekli",
      });
    }

    const { mac, serialNumber, emergencyPhone, model, location, status } =
      req.body;

    const updatedAccessPoint = await AccessPoint.findOneAndUpdate(
      { id },
      {
        mac,
        serialNumber,
        emergencyPhone,
        model,
        location,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAccessPoint) {
      return res.status(404).json({
        message: "Bu id ile güncellenecek AccessPoint bulunamadı.",
      });
    }

    const qrCode = await generateAccessPointQr(id);

    return res.status(200).json({
      message: "Access Point başarıyla güncellendi.",
      accessPoint: updatedAccessPoint,
      qrCode,
      updatedBy: req.admin.username,
    });
  } catch (err) {
    console.error(`AccessPoint güncellenirken hata -> ${err}`);
    return res.status(500).json({
      message: "AccessPoint güncellenirken hata",
      error: err.message,
    });
  }
};

// YENİ: Access Point güncelleme (eski versiyon - geriye uyumluluk için)
export const updateAccessPoint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "id parametresi gerekli",
      });
    }

    const { mac, serialNumber, emergencyPhone, model, location, status } =
      req.body;

    const updatedAccessPoint = await AccessPoint.findOneAndUpdate(
      { id },
      {
        mac,
        serialNumber,
        emergencyPhone,
        model,
        location,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAccessPoint) {
      return res.status(404).json({
        message: "Bu id ile güncellenecek AccessPoint bulunamadı.",
      });
    }

    const qrCode = await generateAccessPointQr(id);

    return res.status(200).json({
      accessPoint: updatedAccessPoint,
      qrCode,
    });
  } catch (err) {
    console.error(`AccessPoint güncellenirken hata -> ${err}`);
    return res.status(500).json({
      message: "AccessPoint güncellenirken hata",
      error: err.message,
    });
  }
};

// Tüm Access Point'leri listele
export const getAllAccessPoints = async (req, res) => {
  try {
    const accessPoints = await AccessPoint.find({});

    return res.status(200).json({
      count: accessPoints.length,
      accessPoints,
    });
  } catch (err) {
    console.error(`Access Point'ler listelenirken hata -> ${err}`);
    return res.status(500).json({
      message: "Access Point'ler listelenirken hata",
      error: err.message,
    });
  }
};

// Access Point silme (admin doğrulamalı)
export const deleteAccessPointWithAuth = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "id parametresi gerekli",
      });
    }

    const deletedAccessPoint = await AccessPoint.findOneAndDelete({ id });

    if (!deletedAccessPoint) {
      return res.status(404).json({
        message: "Bu id ile silinecek AccessPoint bulunamadı.",
      });
    }

    return res.status(200).json({
      message: "Access Point başarıyla silindi.",
      deletedAccessPoint,
      deletedBy: req.admin.username,
    });
  } catch (err) {
    console.error(`AccessPoint silinirken hata -> ${err}`);
    return res.status(500).json({
      message: "AccessPoint silinirken hata",
      error: err.message,
    });
  }
};
