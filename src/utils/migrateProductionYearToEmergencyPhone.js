// src/utils/migrateProductionYearToEmergencyPhone.js
// Mevcut Access Point verilerindeki productionYear alanını emergencyPhone alanına migration script'i

import connectMongoDB from '../database/mongoDBConnection.js';
import AccessPoint from '../models/AccessPointSchema.js';

const migrateProductionYearToEmergencyPhone = async () => {
  try {
    console.log('🔄 Migration başlatılıyor: productionYear -> emergencyPhone');
    
    // MongoDB'ye bağlan
    await connectMongoDB();
    
    // Mevcut Access Point'leri bul (productionYear alanı olan)
    const accessPoints = await AccessPoint.find({
      productionYear: { $exists: true }
    });

    if (accessPoints.length === 0) {
      console.log('✅ Migration gerekli değil. productionYear alanı bulunan Access Point yok.');
      process.exit(0);
    }

    console.log(`📊 ${accessPoints.length} adet Access Point bulundu. Migration başlıyor...`);

    let successCount = 0;
    let errorCount = 0;

    for (const ap of accessPoints) {
      try {
        // productionYear değerini emergencyPhone alanına taşı
        // Eğer productionYear bir yıl ise (örn: "2024"), varsayılan bir telefon numarası ata
        let emergencyPhoneValue;
        
        if (ap.productionYear && /^\d{4}$/.test(ap.productionYear)) {
          // Eğer sadece yıl ise varsayılan numara ver
          emergencyPhoneValue = '+90 555 000 00 00'; // Varsayılan numara
          console.log(`⚠️  ${ap.id}: Üretim yılı "${ap.productionYear}" varsayılan telefon numarasına çevrildi.`);
        } else {
          // Eğer zaten telefon numarası benzeri bir değer ise onu kullan
          emergencyPhoneValue = ap.productionYear || '+90 555 000 00 00';
        }

        // Güncelleme yap
        await AccessPoint.updateOne(
          { _id: ap._id },
          { 
            $set: { emergencyPhone: emergencyPhoneValue },
            $unset: { productionYear: 1 } // Eski alanı sil
          }
        );

        successCount++;
        console.log(`✅ ${ap.id}: Migration tamamlandı.`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ ${ap.id}: Migration hatası:`, error.message);
      }
    }

    console.log('\n📈 Migration Raporu:');
    console.log(`   ✅ Başarılı: ${successCount}`);
    console.log(`   ❌ Hatalı: ${errorCount}`);
    console.log(`   📊 Toplam: ${accessPoints.length}`);

    if (errorCount === 0) {
      console.log('\n🎉 Migration başarıyla tamamlandı!');
    } else {
      console.log('\n⚠️  Migration kısmen tamamlandı. Bazı kayıtlarda hata oluştu.');
    }

    process.exit(errorCount === 0 ? 0 : 1);
    
  } catch (error) {
    console.error('💥 Migration sırasında kritik hata:', error);
    process.exit(1);
  }
};

// Script direkt çalıştırıldığında
migrateProductionYearToEmergencyPhone();

export { migrateProductionYearToEmergencyPhone };
