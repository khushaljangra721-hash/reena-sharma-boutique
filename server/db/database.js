import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', '.data');
const DB_FILE = path.join(DATA_DIR, 'boutique_data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbCache = null;

function readDB() {
  if (dbCache) return dbCache;
  if (!fs.existsSync(DB_FILE)) {
    dbCache = {
      products: [],
      categories: [],
      offers: [],
      banners: [],
      enquiries: [],
      videos: [],
      testimonials: [],
      admin: [],
      settings: {}
    };
    saveDB(dbCache);
    return dbCache;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbCache = JSON.parse(raw);
    return dbCache;
  } catch (err) {
    console.error('Error reading database file, returning empty schema', err);
    dbCache = {
      products: [],
      categories: [],
      offers: [],
      banners: [],
      enquiries: [],
      videos: [],
      testimonials: [],
      admin: [],
      settings: {}
    };
    return dbCache;
  }
}

function saveDB(data) {
  dbCache = data;
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

export const db = {
  get: (collection) => {
    const data = readDB();
    return data[collection] || [];
  },
  getSettings: () => {
    const data = readDB();
    return data.settings || {};
  },
  updateSettings: (newSettings) => {
    const data = readDB();
    data.settings = { ...data.settings, ...newSettings, updatedAt: new Date().toISOString() };
    saveDB(data);
    return data.settings;
  },
  find: (collection, filterFn = () => true) => {
    const data = readDB();
    const items = data[collection] || [];
    return items.filter(filterFn);
  },
  findById: (collection, id) => {
    const data = readDB();
    const items = data[collection] || [];
    return items.find((item) => String(item.id) === String(id));
  },
  findBySlug: (collection, slug) => {
    const data = readDB();
    const items = data[collection] || [];
    return items.find((item) => item.slug === slug);
  },
  findOne: (collection, filterFn) => {
    const data = readDB();
    const items = data[collection] || [];
    return items.find(filterFn);
  },
  insert: (collection, item) => {
    const data = readDB();
    if (!data[collection]) data[collection] = [];
    const newItem = {
      ...item,
      id: item.id || `${collection.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data[collection].unshift(newItem);
    saveDB(data);
    return newItem;
  },
  updateById: (collection, id, updates) => {
    const data = readDB();
    if (!data[collection]) return null;
    const index = data[collection].findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;
    data[collection][index] = {
      ...data[collection][index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDB(data);
    return data[collection][index];
  },
  deleteById: (collection, id) => {
    const data = readDB();
    if (!data[collection]) return false;
    const beforeCount = data[collection].length;
    data[collection] = data[collection].filter((item) => String(item.id) !== String(id));
    const deleted = data[collection].length < beforeCount;
    if (deleted) saveDB(data);
    return deleted;
  },
  setCollection: (collection, items) => {
    const data = readDB();
    data[collection] = items;
    saveDB(data);
  },
  reload: () => {
    dbCache = null;
    return readDB();
  }
};
