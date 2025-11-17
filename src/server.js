import express from "express";
import { SERVER } from "./config/config.js";
import connectMongoDB from "./database/mongoDBConnection.js";
import accessPointRoutes from "./routes/accessPointRoutes.js";

const app = express();

// Body'den JSON okuyabilmek için
app.use(express.json());

// MongoDB bağlantısı
connectMongoDB();

// Route'ları bağla
app.use("/api", accessPointRoutes);

app.listen(SERVER.PORT, () => {
  console.log(`API listening on ${SERVER.PORT}`);
});
