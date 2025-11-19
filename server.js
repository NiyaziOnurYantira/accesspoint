import express from 'express';
import cors from 'cors';
import { SERVER } from './src/config/config.js';
import connectMongoDB from './src/database/mongoDBConnection.js';
import accessPointRoutes from './src/routes/accessPointRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { v4 as uuidv4 } from 'uuid'; // <-- EKLE

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
connectMongoDB();

// Önce API route'ları
app.use('/api', accessPointRoutes);
app.use('/api', adminRoutes);

app.get('/new-access-point', (req, res) => {
    const newId = uuidv4(); // Yeni eklenecek Access Point için id

    res.send(`<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <title>Yeni Access Point - ${newId}</title>
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

      input[type="text"] {
        width: 100%;
        box-sizing: border-box;
        padding: 6px;
      }

      .btn {
        padding: 8px 14px;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        margin-right: 8px;
      }

      .btn-primary {
        background-color: #28a745;
        color: white;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }

      #message {
        margin-top: 10px;
      }

      a {
        color: #007bff;
      }
    </style>
  </head>
  <body>
    <h1>Yeni Access Point Ekle</h1>
    <p>Bu sayfada yeni bir Access Point oluşturacaksınız.</p>

    <table>
      <tbody>
        <tr>
          <th>ID</th>
          <td><input type="text" id="id" value="${newId}" readonly /></td>
        </tr>
        <tr>
          <th>MAC</th>
          <td><input type="text" id="mac" /></td>
        </tr>
        <tr>
          <th>Seri Numarası</th>
          <td><input type="text" id="serialNumber" /></td>
        </tr>
        <tr>
          <th>Üretim Yılı</th>
          <td><input type="text" id="productionYear" /></td>
        </tr>
        <tr>
          <th>Model</th>
          <td><input type="text" id="model" /></td>
        </tr>
        <tr>
          <th>Lokasyon</th>
          <td><input type="text" id="location" /></td>
        </tr>
        <tr>
          <th>Durum</th>
          <td>
            <input type="text" id="status" placeholder="active / inactive / faulty / maintenance" value="active" />
          </td>
        </tr>
      </tbody>
    </table>

    <h3 style="margin-top: 30px; color: #dc3545;">Admin Doğrulaması</h3>
    <table style="margin-top: 10px;">
      <tbody>
        <tr>
          <th>Admin Kullanıcı Adı</th>
          <td><input type="text" id="adminUsername" placeholder="Admin kullanıcı adınız" /></td>
        </tr>
        <tr>
          <th>Admin Şifre</th>
          <td><input type="password" id="adminPassword" placeholder="Admin şifreniz" /></td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 10px;">
      <button class="btn btn-primary" id="btnSave">Kaydet</button>
      <button class="btn btn-secondary" id="btnGotoDetail" disabled>Detay Sayfasına Git</button>
    </div>

    <div id="message"></div>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        var inputId = document.getElementById("id");
        var inputMac = document.getElementById("mac");
        var inputSerial = document.getElementById("serialNumber");
        var inputYear = document.getElementById("productionYear");
        var inputModel = document.getElementById("model");
        var inputLocation = document.getElementById("location");
        var inputStatus = document.getElementById("status");
        var inputAdminUsername = document.getElementById("adminUsername");
        var inputAdminPassword = document.getElementById("adminPassword");
        var messageDiv = document.getElementById("message");
        var btnGotoDetail = document.getElementById("btnGotoDetail");

        document.getElementById("btnSave").addEventListener("click", function () {
          messageDiv.textContent = "";

          var payload = {
            id: inputId.value,
            mac: inputMac.value,
            serialNumber: inputSerial.value,
            productionYear: inputYear.value,
            model: inputModel.value,
            location: inputLocation.value,
            status: inputStatus.value || "active",
            adminUsername: inputAdminUsername.value,
            adminPassword: inputAdminPassword.value,
          };

          if (!payload.mac || !payload.serialNumber || !payload.productionYear || !payload.model || !payload.location) {
            messageDiv.textContent = "MAC, Seri Numarası, Üretim Yılı, Model, Lokasyon zorunludur.";
            return;
          }

          if (!payload.adminUsername || !payload.adminPassword) {
            messageDiv.textContent = "Admin kullanıcı adı ve şifresi zorunludur.";
            return;
          }

          fetch("/api/admin/access-points", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
            .then(function (response) {
              if (!response.ok) {
                return response.json().then(function (data) {
                  throw new Error(data.message || "Access Point oluşturulamadı.");
                }).catch(function () {
                  throw new Error("Access Point oluşturulamadı.");
                });
              }
              return response.json();
            })
            .then(function (data) {
              var ap = data.accessPoint;
              messageDiv.innerHTML = "Access Point başarıyla oluşturuldu. ID: <strong>" + (ap && ap.id) + "</strong>";
              btnGotoDetail.disabled = false;
              btnGotoDetail.addEventListener("click", function () {
                if (ap && ap.id) {
                  window.open("/" + encodeURIComponent(ap.id), "_blank");
                }
              });
            })
            .catch(function (err) {
              console.error(err);
              messageDiv.textContent = err.message || "Bir hata oluştu.";
            });
        });
      });
    </script>
  </body>
</html>`);
});

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

      .btn {
        padding: 8px 14px;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        margin-right: 8px;
        background-color: #007bff;
        color: white;
      }
    </style>
  </head>
  <body>
    <h1>Access Point Detay</h1>
    <p><strong>ID:</strong> <span id="ap-id">${id}</span></p>

    <button class="btn" id="btnNewAp">Yeni Access Point Ekle (Yeni Sekme)</button>
    <button class="btn" id="btnEditMode" style="display: none; background-color: #28a745;">Düzenleme Modunu Aç</button>
    <button class="btn" id="btnSaveChanges" style="display: none; background-color: #ffc107; color: #000;">Değişiklikleri Kaydet</button>
    <button class="btn" id="btnCancelEdit" style="display: none; background-color: #6c757d;">İptal</button>

    <div id="error"></div>
    <div id="updateMessage" style="color: green; margin-top: 10px;"></div>

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

    <!-- Admin Doğrulaması Formu (Güncelleme için) -->
    <div id="adminForm" style="display: none; margin-top: 30px; border: 2px solid #dc3545; padding: 20px; border-radius: 5px;">
      <h3 style="color: #dc3545; margin-top: 0;">Admin Doğrulaması (Güncelleme İçin)</h3>
      <table>
        <tbody>
          <tr>
            <th>Admin Kullanıcı Adı</th>
            <td><input type="text" id="updateAdminUsername" placeholder="Admin kullanıcı adınız" style="width: 100%; padding: 8px;" /></td>
          </tr>
          <tr>
            <th>Admin Şifre</th>
            <td><input type="password" id="updateAdminPassword" placeholder="Admin şifreniz" style="width: 100%; padding: 8px;" /></td>
          </tr>
        </tbody>
      </table>
    </div>

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

        var originalData = {}; // Orijinal verileri saklamak için
        var isEditMode = false;

        // Yeni Access Point sayfasını yeni sekmede aç
        document.getElementById("btnNewAp").addEventListener("click", function () {
          window.open("/new-access-point", "_blank");
        });

        // Düzenleme modunu aç
        document.getElementById("btnEditMode").addEventListener("click", function () {
          isEditMode = true;
          enableEditMode();
        });

        // Değişiklikleri kaydet
        document.getElementById("btnSaveChanges").addEventListener("click", function () {
          saveChanges();
        });

        // Düzenlemeyi iptal et
        document.getElementById("btnCancelEdit").addEventListener("click", function () {
          isEditMode = false;
          disableEditMode();
          restoreOriginalData();
        });

        function enableEditMode() {
          // Düzenlenebilir alanları input'a çevir
          document.getElementById("field-mac").innerHTML = '<input type="text" id="edit-mac" value="' + originalData.mac + '" style="width: 100%; padding: 4px;" />';
          document.getElementById("field-serialNumber").innerHTML = '<input type="text" id="edit-serialNumber" value="' + originalData.serialNumber + '" style="width: 100%; padding: 4px;" />';
          document.getElementById("field-productionYear").innerHTML = '<input type="text" id="edit-productionYear" value="' + originalData.productionYear + '" style="width: 100%; padding: 4px;" />';
          document.getElementById("field-model").innerHTML = '<input type="text" id="edit-model" value="' + originalData.model + '" style="width: 100%; padding: 4px;" />';
          document.getElementById("field-location").innerHTML = '<input type="text" id="edit-location" value="' + originalData.location + '" style="width: 100%; padding: 4px;" />';
          document.getElementById("field-status").innerHTML = '<select id="edit-status" style="width: 100%; padding: 4px;"><option value="active">active</option><option value="inactive">inactive</option><option value="faulty">faulty</option><option value="maintenance">maintenance</option></select>';
          document.getElementById("edit-status").value = originalData.status;

          // Butonları göster/gizle
          document.getElementById("btnEditMode").style.display = "none";
          document.getElementById("btnSaveChanges").style.display = "inline-block";
          document.getElementById("btnCancelEdit").style.display = "inline-block";
          document.getElementById("adminForm").style.display = "block";
        }

        function disableEditMode() {
          // Input'ları geri text'e çevir
          document.getElementById("field-mac").textContent = originalData.mac;
          document.getElementById("field-serialNumber").textContent = originalData.serialNumber;
          document.getElementById("field-productionYear").textContent = originalData.productionYear;
          document.getElementById("field-model").textContent = originalData.model;
          document.getElementById("field-location").textContent = originalData.location;
          document.getElementById("field-status").textContent = originalData.status;

          // Butonları göster/gizle
          document.getElementById("btnEditMode").style.display = "inline-block";
          document.getElementById("btnSaveChanges").style.display = "none";
          document.getElementById("btnCancelEdit").style.display = "none";
          document.getElementById("adminForm").style.display = "none";
          
          // Admin form alanlarını temizle
          document.getElementById("updateAdminUsername").value = "";
          document.getElementById("updateAdminPassword").value = "";
          document.getElementById("updateMessage").textContent = "";
        }

        function restoreOriginalData() {
          // Orijinal verileri geri yükle (herhangi bir değişiklik varsa)
          // Bu fonksiyon gerekirse genişletilebilir
        }

        function saveChanges() {
          var adminUsername = document.getElementById("updateAdminUsername").value;
          var adminPassword = document.getElementById("updateAdminPassword").value;
          var updateMessage = document.getElementById("updateMessage");
          
          updateMessage.textContent = "";
          
          if (!adminUsername || !adminPassword) {
            updateMessage.textContent = "Admin kullanıcı adı ve şifresi zorunludur.";
            updateMessage.style.color = "red";
            return;
          }

          var updatePayload = {
            mac: document.getElementById("edit-mac").value,
            serialNumber: document.getElementById("edit-serialNumber").value,
            productionYear: document.getElementById("edit-productionYear").value,
            model: document.getElementById("edit-model").value,
            location: document.getElementById("edit-location").value,
            status: document.getElementById("edit-status").value,
            adminUsername: adminUsername,
            adminPassword: adminPassword,
          };

          fetch("/api/admin/access-points/" + encodeURIComponent(id), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePayload),
          })
            .then(function (response) {
              if (!response.ok) {
                return response.json().then(function (data) {
                  throw new Error(data.message || "Access Point güncellenemedi.");
                }).catch(function () {
                  throw new Error("Access Point güncellenemedi.");
                });
              }
              return response.json();
            })
            .then(function (data) {
              updateMessage.textContent = "Access Point başarıyla güncellendi!";
              updateMessage.style.color = "green";
              
              // Orijinal verileri güncelle
              originalData = data.accessPoint;
              
              // Edit modundan çık
              isEditMode = false;
              disableEditMode();
              
              // Sayfayı yenile (verileri güncel göster)
              setTimeout(function() {
                location.reload();
              }, 1500);
            })
            .catch(function (err) {
              console.error(err);
              updateMessage.textContent = err.message || "Güncelleme sırasında bir hata oluştu.";
              updateMessage.style.color = "red";
            });
        }

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

            // Orijinal verileri sakla
            originalData = {
              id: ap.id || "",
              mac: ap.mac || "",
              serialNumber: ap.serialNumber || "",
              productionYear: ap.productionYear || "",
              model: ap.model || "",
              location: ap.location || "",
              status: ap.status || "",
              createdAt: ap.createdAt,
              updatedAt: ap.updatedAt
            };

            table.style.display = "table";
            document.getElementById("btnEditMode").style.display = "inline-block";

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
