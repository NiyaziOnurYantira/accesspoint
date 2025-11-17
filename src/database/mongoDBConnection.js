import mongoose from "mongoose";
import { MONGO } from "../config/config.js";

const connectMongoDB = async () => {
  try {
    // .env içinde MONGODB_URI tuttuğunu varsayıyorum
    const mongoUri = MONGO.URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI tanımlı değil. .env dosyanı kontrol et.");
    }

    // (Opsiyonel) strictQuery ayarı
    mongoose.set("strictQuery", true);

    await mongoose.connect(mongoUri, {
      // mongoose 7+ için çoğu seçenek default geliyor
      // ama istersen buraya extra options ekleyebilirsin
    });

    console.log("MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err.message);
    process.exit(1); // bağlantı yoksa uygulamayı kapatmak mantıklı
  }
};

export default connectMongoDB;
