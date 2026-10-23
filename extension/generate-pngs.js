import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = path.join(__dirname, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal pure-Node uncompressed PNG builder
function createPngBuffer(width, height, drawPixel) {
  // RGBA buffer with filter byte at start of each scanline
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter: Adaptive
  ihdrData[12] = 0; // Interlace: None
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcBuffer = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crcValue = calculateCRC(crcBuffer);
  chunk.writeUInt32BE(crcValue, 8 + length);
  return chunk;
}

// Standard CRC32 table & calculation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function calculateCRC(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// VeriScope Icon Pixel Shader: Dark Slate Frame with Precision Emerald Checkmark
function veriscopeShader(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Outer rounded border box
  const pad = 0.08;
  if (nx < pad || nx > 1 - pad || ny < pad || ny > 1 - pad) {
    return [0, 0, 0, 0]; // Transparent padding
  }

  // Precision Reticle ticks
  const isReticleX = (Math.abs(nx - 0.5) < 0.02) && (ny < 0.16 || ny > 0.84);
  const isReticleY = (Math.abs(ny - 0.5) < 0.02) && (nx < 0.16 || nx > 0.84);
  if (isReticleX || isReticleY) {
    return [100, 116, 139, 255]; // Slate border ticks
  }

  // Distance for checkmark lines:
  // Segment 1: from (0.32, 0.56) to (0.46, 0.70)
  // Segment 2: from (0.46, 0.70) to (0.74, 0.34)
  const d1 = distToSegment(nx, ny, 0.32, 0.56, 0.46, 0.70);
  const d2 = distToSegment(nx, ny, 0.46, 0.70, 0.74, 0.34);
  const thickness = 0.065;

  if (d1 < thickness || d2 < thickness) {
    return [16, 185, 129, 255]; // Emerald #10b981
  }

  // Inner Document rect
  if (nx > 0.24 && nx < 0.76 && ny > 0.22 && ny < 0.78) {
    return [30, 41, 59, 255]; // Darker slate inner document #1e293b
  }

  // Main Background Reticle Body
  return [15, 23, 42, 255]; // Deep navy/slate #0f172a
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Generate 16, 32, 48, 128
[16, 32, 48, 128].forEach(size => {
  const png = createPngBuffer(size, size, veriscopeShader);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), png);
  console.log(`Generated icon${size}.png (${size}x${size})`);
});
