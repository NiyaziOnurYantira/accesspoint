// src/utils/setupAdmin.js
// İlk admin'i oluşturmak için kullanabileceğiniz script

import connectMongoDB from '../database/mongoDBConnection.js';
import Admin from '../models/AdminSchema.js';

const setupInitialAdmin = async () => {
  try {
    // MongoDB'ye bağlan
    await connectMongoDB();
    
    console.log('🔍 Mevcut adminleri kontrol ediliyor...');
    
    // Mevcut admin var mı kontrol et
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('❌ Zaten admin mevcut:', existingAdmin.username);
      console.log('   Yeni admin oluşturmak için önce mevcut admini silin.');
      process.exit(0);
    }

    // İlk admin'i oluştur
    const initialAdmin = {
      username: 'admin',
      password: 'admin123', // GÜÇLÜ ŞİFRE KULLLANIN!
      email: 'admin@accesspoint.com',
    };

    const admin = await Admin.create(initialAdmin);
    
    console.log('✅ İlk admin başarıyla oluşturuldu!');
    console.log('📋 Admin Bilgileri:');
    console.log(`   Kullanıcı Adı: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Şifre: ${initialAdmin.password}`);
    console.log('');
    console.log('⚠️  GÜVENLİK UYARISI:');
    console.log('   Bu varsayılan şifreyi hemen değiştirin!');
    console.log('   Üretim ortamında güçlü şifreler kullanın!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Admin oluşturulurken hata:', error.message);
    process.exit(1);
  }
};

// Script direkt çalıştırıldığında
setupInitialAdmin();

export { setupInitialAdmin };
