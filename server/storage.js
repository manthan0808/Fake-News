import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SCANS_FILE = path.join(DATA_DIR, 'scans.json');
const SOURCES_FILE = path.join(DATA_DIR, 'sources.json');

function readJSON(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return fallback;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
}

export const db = {
  getScans() {
    return readJSON(SCANS_FILE, []);
  },

  getScanById(id) {
    const scans = this.getScans();
    return scans.find(s => s.id === id) || null;
  },

  saveScan(scanData) {
    const scans = this.getScans();
    const existingIndex = scans.findIndex(s => s.id === scanData.id || (scanData.url && s.url === scanData.url));
    
    if (existingIndex >= 0) {
      // Store previous version for change detection diff
      const previous = scans[existingIndex];
      scanData.previousVersion = {
        scannedAt: previous.scannedAt,
        headline: previous.headline,
        bodyText: previous.bodyText,
        credibilityScore: previous.credibilityScore,
        claims: previous.claims
      };
      scans[existingIndex] = { ...previous, ...scanData, updatedAt: new Date().toISOString() };
    } else {
      scans.unshift(scanData);
    }

    writeJSON(SCANS_FILE, scans);
    return scanData;
  },

  toggleBookmark(id) {
    const scans = this.getScans();
    const scan = scans.find(s => s.id === id);
    if (scan) {
      scan.isSaved = !scan.isSaved;
      writeJSON(SCANS_FILE, scans);
      return { id, isSaved: scan.isSaved };
    }
    return null;
  },

  getSources() {
    return readJSON(SOURCES_FILE, []);
  },

  saveSources(sources) {
    writeJSON(SOURCES_FILE, sources);
  }
};
