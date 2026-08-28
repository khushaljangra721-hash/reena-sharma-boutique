import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', '..', '.data');
const DB_FILE = path.join(DATA_DIR, 'boutique_data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbCache = null;
let isMongoConnected = false;

// Mongoose Schema for Cloud Storage on MongoDB Atlas
const BoutiqueDataSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'boutique_data' },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const BoutiqueModel = mongoose.models.BoutiqueData || mongoose.model('BoutiqueData', BoutiqueDataSchema);

// Connect to MongoDB Atlas if MONGODB_URI is provided
export async function initMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI not found. Running with Local JSON Database.');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('🍃 MongoDB Atlas Cloud Database connected successfully!');

    // Sync cloud data into memory
    let cloudDoc = await BoutiqueModel.findOne({ key: 'boutique_data' });
    if (!cloudDoc) {
      // First time MongoDB setup: seed cloud from local JSON
      const localData = readLocalDB();
      cloudDoc = await BoutiqueModel.create({
        key: 'boutique_data',
        data: localData,
      });
      console.log('✅ Initial boutique data seeded into MongoDB Atlas Cloud!');
    }

    dbCache = cloudDoc.data;
    saveLocalDB(dbCache); // Keep local backup
    return true;
  } catch (err) {
    console.error('⚠️ MongoDB connection error, falling back to Local JSON:', err.message);
    isMongoConnected = false;
    return false;
  }
}

function readLocalDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialSchema = {
      products: [],
      categories: [],
      offers: [],
      banners: [],
      enquiries: [],
      videos: [],
      testimonials: [],
      customers: [],
      admin: [],
      settings: {},
    };
    saveLocalDB(initialSchema);
    return initialSchema;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, returning empty schema', err);
    return {
      products: [],
      categories: [],
      offers: [],
      banners: [],
      enquiries: [],
      videos: [],
      testimonials: [],
      customers: [],
      admin: [],
      settings: {},
    };
  }
}

function saveLocalDB(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // Ignore in read-only serverless filesystems (e.g. Vercel)
  }
}

function readDB() {
  if (dbCache) return dbCache;
  dbCache = readLocalDB();
  return dbCache;
}

async function persistDB(data) {
  dbCache = data;
  saveLocalDB(data);

  // If MongoDB is connected, save to MongoDB Atlas in the background
  if (isMongoConnected) {
    try {
      await BoutiqueModel.findOneAndUpdate(
        { key: 'boutique_data' },
        { data, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Failed to sync to MongoDB Atlas:', err);
    }
  }
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
    persistDB(data);
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
    persistDB(data);
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
    persistDB(data);
    return data[collection][index];
  },
  deleteById: (collection, id) => {
    const data = readDB();
    if (!data[collection]) return false;
    const beforeCount = data[collection].length;
    data[collection] = data[collection].filter((item) => String(item.id) !== String(id));
    const deleted = data[collection].length < beforeCount;
    if (deleted) persistDB(data);
    return deleted;
  },
  setCollection: (collection, items) => {
    const data = readDB();
    data[collection] = items;
    persistDB(data);
  },
  reload: () => {
    dbCache = null;
    return readDB();
  },
};
