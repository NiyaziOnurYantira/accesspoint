# Admin Sistemi Kurulum ve Kullanım Kılavuzu

Bu dokümantasyon, Access Point projesindeki admin sisteminin nasıl kurulacağını ve kullanılacağını açıklar.

## 🚀 Hızlı Kurulum

### 1. İlk Admin Oluşturma

```bash
# Proje dizinine gidin
cd /path/to/your/accesspoint

# İlk admin'i oluşturun
node src/utils/setupAdmin.js
```

Bu komut varsayılan admin bilgileriyle bir admin oluşturacak:

- **Kullanıcı Adı:** `admin`
- **Şifre:** `admin123`
- **Email:** `admin@accesspoint.com`

> ⚠️ **GÜVENLİK UYARISI:** Bu varsayılan şifreyi derhal değiştirin!

### 2. Sunucuyu Başlatma

```bash
node server.js
```

## 📋 API Endpoints

### Admin İşlemleri

#### Admin Oluşturma

```http
POST /api/admin/create
Content-Type: application/json

{
  "username": "yeni_admin",
  "password": "güçlü_şifre",
  "email": "admin@example.com"
}
```

#### Admin Girişi

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Adminleri Listeleme

```http
GET /api/admin/list
```

### Access Point İşlemleri (Admin Doğrulamalı)

#### Yeni Access Point Oluşturma (Admin Doğrulamalı)

```http
POST /api/admin/access-points
Content-Type: application/json

{
  "mac": "AA:BB:CC:DD:EE:FF",
  "serialNumber": "SN123456",
  "emergencyPhone": "+90 555 123 45 67",
  "model": "AP-X1000",
  "location": "Istanbul Ofis",
  "status": "active",
  "adminUsername": "admin",
  "adminPassword": "admin123"
}
```

#### Access Point Güncelleme (Admin Doğrulamalı)

```http
PUT /api/admin/access-points/:id
Content-Type: application/json

{
  "mac": "AA:BB:CC:DD:EE:FF",
  "serialNumber": "SN123456",
  "emergencyPhone": "+90 555 987 65 43",
  "model": "AP-X2000",
  "location": "Ankara Ofis",
  "status": "maintenance",
  "adminUsername": "admin",
  "adminPassword": "admin123"
}
```

#### Access Point Silme (Admin Doğrulamalı)

```http
DELETE /api/admin/access-points/:id
Content-Type: application/json

{
  "adminUsername": "admin",
  "adminPassword": "admin123"
}
```

### Genel Access Point İşlemleri (Admin Doğrulaması Yok)

Bu endpoint'ler geriye uyumluluk için korunmuştur:

```http
# Access Point görüntüleme
GET /api/access-points/:id

# Tüm Access Point'leri listeleme
GET /api/access-points

# Access Point oluşturma (admin doğrulaması yok)
POST /api/access-points

# Access Point güncelleme (admin doğrulaması yok)
PUT /api/access-points/:id
```

## 🔐 Güvenlik Özellikleri

1. **Şifre Hashleme:** Tüm şifreler bcryptjs ile güvenli bir şekilde hashlenir
2. **Admin Doğrulama:** Kritik işlemler admin kullanıcı adı ve şifre gerektirir
3. **Çoklu Admin:** Birden fazla admin hesabı oluşturabilirsiniz
4. **Güvenli Endpoint'ler:** `/api/admin/*` rotaları admin doğrulaması gerektirir

## 🛠️ Örnek Kullanım Senaryoları

### Senaryo 1: İlk Kurulum

```bash
# 1. İlk admin'i oluştur
node src/utils/setupAdmin.js

# 2. Sunucuyu başlat
node server.js

# 3. Admin girişini test et
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Senaryo 2: Admin Doğrulamalı Access Point Oluşturma

```bash
curl -X POST http://localhost:3000/api/admin/access-points \
  -H "Content-Type: application/json" \
  -d '{
    "mac": "AA:BB:CC:DD:EE:FF",
    "serialNumber": "SN123456",
    "productionYear": "2024",
    "model": "AP-X1000",
    "location": "Istanbul Ofis",
    "status": "active",
    "adminUsername": "admin",
    "adminPassword": "admin123"
  }'
```

### Senaryo 3: Access Point Güncelleme

```bash
curl -X PUT http://localhost:3000/api/admin/access-points/your-access-point-id \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Yeni Lokasyon",
    "status": "maintenance",
    "adminUsername": "admin",
    "adminPassword": "admin123"
  }'
```

## ⚠️ Önemli Notlar

1. **Şifre Güvenliği:** Varsayılan `admin123` şifresini mutlaka değiştirin
2. **HTTPS:** Üretim ortamında HTTPS kullanın
3. **Geriye Uyumluluk:** Mevcut `/api/access-points` endpoint'leri admin doğrulaması gerektirmez
4. **Logging:** Tüm admin işlemleri console'a loglanır

## 🔍 Hata Ayıklama

### Yaygın Hatalar

**"Admin doğrulaması için kullanıcı adı ve şifre gerekli"**

- `adminUsername` ve `adminPassword` alanlarını request body'ye eklemeyi unutmuş olabilirsiniz

**"Geçersiz admin bilgileri"**

- Kullanıcı adı veya şifre yanlış
- Admin hesabı deaktif olmuş olabilir

**"Bu kullanıcı adı ile admin zaten mevcut"**

- Aynı kullanıcı adıyla admin oluşturmaya çalışıyorsunuz

### Debug Modunda Çalıştırma

```bash
DEBUG=* node server.js
```

## 📞 Destek

Herhangi bir sorunuz varsa proje dokümantasyonunu inceleyin veya issue açın.
