// src/utils/qrCodeGenerator.js

import QRCode from 'qrcode';

/**
 * Verilen id için QR code üretir.
 * QR içindeki URL: http://localhost:3003/:id
 *
 * @param {string} id - uuidv4 ile üretilmiş access point id
 * @returns {Promise<string>} - QR kodun base64 DataURL'i
 */
export const generateAccessPointQr = async (id) => {
  if (!id) {
    throw new Error('QR oluşturmak için geçerli bir id gerekli');
  }

  const url = `http://localhost:3002/${id}`;

  // İsterseniz ayarları özelleştirebilirsiniz
  const options = {
    width: 300,
    margin: 2,
  };

  const qrDataUrl = await QRCode.toDataURL(url, options);
  return qrDataUrl;
};

export default generateAccessPointQr;
