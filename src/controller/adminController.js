// src/controller/adminController.js

import Admin from "../models/AdminSchema.js";

// Admin oluşturma (ilk kurulum için)
export const createAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Kullanıcı adı ve şifre zorunludur.",
      });
    }

    // Admin zaten var mı kontrol et
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Bu kullanıcı adı ile admin zaten mevcut.",
      });
    }

    const newAdmin = await Admin.create({
      username,
      password,
      email,
    });

    // Şifreyi response'da gösterme
    const adminResponse = {
      id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      isActive: newAdmin.isActive,
      createdAt: newAdmin.createdAt,
    };

    return res.status(201).json({
      message: "Admin başarıyla oluşturuldu.",
      admin: adminResponse,
    });
  } catch (error) {
    console.error("Admin oluşturulurken hata:", error);
    return res.status(500).json({
      message: "Admin oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};

// Admin girişi / doğrulama
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Kullanıcı adı ve şifre zorunludur.",
      });
    }

    // Admin'i bul
    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({
        message: "Geçersiz kullanıcı adı veya şifre.",
      });
    }

    // Şifre kontrol et
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Geçersiz kullanıcı adı veya şifre.",
      });
    }

    // Başarılı giriş - basit bir session veya token olmadan sadece başarı döndür
    return res.status(200).json({
      message: "Admin girişi başarılı.",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin girişi sırasında hata:", error);
    return res.status(500).json({
      message: "Admin girişi sırasında bir hata oluştu.",
      error: error.message,
    });
  }
};

// Basit admin doğrulama middleware fonksiyonu
export const verifyAdmin = async (req, res, next) => {
  try {
    const { adminUsername, adminPassword } = req.body;

    if (!adminUsername || !adminPassword) {
      return res.status(401).json({
        message: "Admin doğrulaması için kullanıcı adı ve şifre gerekli.",
      });
    }

    // Admin'i bul ve şifreyi kontrol et
    const admin = await Admin.findOne({ username: adminUsername, isActive: true });
    if (!admin) {
      return res.status(401).json({
        message: "Geçersiz admin bilgileri.",
      });
    }

    const isPasswordValid = await admin.comparePassword(adminPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Geçersiz admin bilgileri.",
      });
    }

    // Admin bilgilerini req objesine ekle
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin doğrulaması sırasında hata:", error);
    return res.status(500).json({
      message: "Admin doğrulaması sırasında bir hata oluştu.",
      error: error.message,
    });
  }
};

// Tüm adminleri listele (geliştirme amaçlı)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 }); // Şifreleri gizle

    return res.status(200).json({
      admins,
    });
  } catch (error) {
    console.error("Adminler listelenirken hata:", error);
    return res.status(500).json({
      message: "Adminler listelenirken bir hata oluştu.",
      error: error.message,
    });
  }
};
