import express from 'express';
import cors from 'cors';
import { SERVER } from './config/config.js';
import connectMongoDB from './database/mongoDBConnection.js';
import accessPointRoutes from './routes/accessPointRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
connectMongoDB();

// Önce API route'ları
app.use('/api', accessPointRoutes);

// Sonra HTML sayfası: GET /:id
app.get('/:id', (req, res) => {
  const { id } = req.params;

  res.send(`<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <title>Access Point Detay - ${id}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }

      h1 {
        margin-bottom: 10px;
      }

      table {
        margin-top: 20px;
        border-collapse: collapse;
        min-width: 500px;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 8px;
      }

      th {
        background-color: #f2f2f2;
        text-align: left;
      }

      #error {
        color: red;
        margin-top: 10px;
      }

      #qr-container {
        margin-top: 20px;
      }

      #qr-container img {
        max-width: 300px;
      }
    </style>
  </head>
  <body>
    <h1>Access Point Detay</h1>
    <p><strong>ID:</strong> <span id="ap-id">${id}</span></p>

    <div id="error"></div>

    <table id="apTable" style="display: none;">
      <thead>
        <tr>
          <th>Alan</th>
          <th>Değer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ID</td>
          <td id="field-id"></td>
        </tr>
        <tr>
          <td>MAC</td>
          <td id="field-mac"></td>
        </tr>
        <tr>
          <td>Seri Numarası</td>
          <td id="field-serialNumber"></td>
        </tr>
        <tr>
          <td>Üretim Yılı</td>
          <td id="field-productionYear"></td>
        </tr>
        <tr>
          <td>Model</td>
          <td id="field-model"></td>
        </tr>
        <tr>
          <td>Lokasyon</td>
          <td id="field-location"></td>
        </tr>
        <tr>
          <td>Durum</td>
          <td id="field-status"></td>
        </tr>
        <tr>
          <td>Oluşturulma Tarihi</td>
          <td id="field-createdAt"></td>
        </tr>
        <tr>
          <td>Güncellenme Tarihi</td>
          <td id="field-updatedAt"></td>
        </tr>
      </tbody>
    </table>

    <div id="qr-container" style="display: none;">
      <h3>QR Kodu</h3>
      <img id="qrImage" alt="Access Point QR Kod" />
    </div>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        var path = window.location.pathname; // "/:id"
        var id = path.charAt(0) === "/" ? path.slice(1) : path;

        var errorDiv = document.getElementById("error");
        var table = document.getElementById("apTable");
        var qrContainer = document.getElementById("qr-container");

        errorDiv.textContent = "";
        table.style.display = "none";
        qrContainer.style.display = "none";

        if (!id) {
          errorDiv.textContent = "Geçerli bir Access Point ID bulunamadı.";
          return;
        }

        fetch("/api/access-points/" + encodeURIComponent(id))
          .then(function (response) {
            if (!response.ok) {
              return response.json().then(function (data) {
                throw new Error(data.message || "Access Point bulunamadı.");
              }).catch(function () {
                throw new Error("Access Point bulunamadı.");
              });
            }
            return response.json();
          })
          .then(function (data) {
            var ap = data.accessPoint;
            var qrCode = data.qrCode;

            if (!ap) {
              errorDiv.textContent = "Access Point verisi bulunamadı.";
              return;
            }

            document.getElementById("field-id").textContent = ap.id || "";
            document.getElementById("field-mac").textContent = ap.mac || "";
            document.getElementById("field-serialNumber").textContent = ap.serialNumber || "";
            document.getElementById("field-productionYear").textContent = ap.productionYear || "";
            document.getElementById("field-model").textContent = ap.model || "";
            document.getElementById("field-location").textContent = ap.location || "";
            document.getElementById("field-status").textContent = ap.status || "";
            document.getElementById("field-createdAt").textContent = ap.createdAt
              ? new Date(ap.createdAt).toLocaleString()
              : "";
            document.getElementById("field-updatedAt").textContent = ap.updatedAt
              ? new Date(ap.updatedAt).toLocaleString()
              : "";

            table.style.display = "table";

            if (qrCode) {
              var qrImage = document.getElementById("qrImage");
              qrImage.src = qrCode;
              qrContainer.style.display = "block";
            }
          })
          .catch(function (err) {
            console.error(err);
            errorDiv.textContent = err.message || "Bir hata oluştu.";
          });
      });
    </script>
  </body>
</html>`);
});

// Sunucu
app.listen(SERVER.PORT, () => {
  console.log('API listening on ' + SERVER.PORT);
});
