const fs = require('fs');
const path = require('path');

// Basit bir PNG dosyası oluşturmak için minimal PNG header
const createMinimalPNG = (width = 1024, height = 1024) => {
  // PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk (image header)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0); // width
  ihdrData.writeUInt32BE(height, 4); // height
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(2, 9); // color type (RGB)
  ihdrData.writeUInt8(0, 10); // compression method
  ihdrData.writeUInt8(0, 11); // filter method
  ihdrData.writeUInt8(0, 12); // interlace method

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk (image data) - basit beyaz resim
  const pixelData = Buffer.alloc(width * height * 3);
  for (let i = 0; i < pixelData.length; i += 3) {
    pixelData[i] = 255; // R
    pixelData[i + 1] = 255; // G
    pixelData[i + 2] = 255; // B
  }

  const idatChunk = createChunk('IDAT', pixelData);

  // IEND chunk (end of file)
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
};

const createChunk = (type, data) => {
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = require('crc-32');

  const chunkData = Buffer.concat([typeBuffer, data]);
  const crcValue = crc.buf(chunkData);

  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeInt32BE(crcValue, 0);

  return Buffer.concat([length, chunkData, crcBuffer]);
};

// Resim dosyalarını oluştur
const imagesDir = path.join(__dirname, '..', 'assets', 'images');

const images = [
  { name: 'icon.png', size: 1024 },
  { name: 'adaptive-icon.png', size: 1024 },
  { name: 'favicon.png', size: 32 },
  { name: 'splash-icon.png', size: 200 },
];

images.forEach(({ name, size }) => {
  const pngData = createMinimalPNG(size, size);
  const filePath = path.join(imagesDir, name);
  fs.writeFileSync(filePath, pngData);
  console.log(`✅ ${name} oluşturuldu (${size}x${size})`);
});

console.log('\n🎉 Tüm resim dosyaları başarıyla oluşturuldu!');
