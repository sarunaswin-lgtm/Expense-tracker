import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_PATH = path.join(DATA_DIR, 'local_db.json');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  !supabaseUrl.includes('your-project')
);

let supabase = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Connected to Supabase PostgreSQL Free Tier');
  } catch (err) {
    console.warn('⚠️ Supabase init error, falling back to local persistent store:', err.message);
  }
} else {
  console.log('ℹ️ Running in Local Storage Mode (Supabase not configured in .env). Data will persist locally in /backend/data/local_db.json');
}

// -------------------------------------------------------------
// Local JSON Storage Engine (Fallback for zero-friction local run)
// -------------------------------------------------------------
const INITIAL_DEMO_DATA = {
  profile: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'user@wealthpulse.app',
    monthly_salary: 65000,
    currency: 'INR',
    savings_goal_percent: 25,
    created_at: new Date().toISOString()
  },
  recurring_bills: [
    {
      id: 'rec-1',
      title: 'House Rent',
      amount: 18000,
      category: 'Bills',
      due_day_of_month: 5,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'rec-2',
      title: 'Index Fund SIP',
      amount: 10000,
      category: 'Investments',
      due_day_of_month: 10,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'rec-3',
      title: 'Netflix & Spotify',
      amount: 999,
      category: 'Entertainment',
      due_day_of_month: 15,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'rec-4',
      title: 'Broadband WiFi',
      amount: 850,
      category: 'Bills',
      due_day_of_month: 2,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      amount: 65000,
      category: 'Salary',
      type: 'income',
      is_waste: false,
      notes: 'Monthly salary credited',
      date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'tx-2',
      amount: 18000,
      category: 'Bills',
      type: 'expense',
      is_waste: false,
      notes: 'Rent paid to landlord',
      date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 6 * 86400000).toISOString()
    },
    {
      id: 'tx-3',
      amount: 3450,
      category: 'Shopping',
      type: 'expense',
      is_waste: true,
      notes: 'Midnight sneaker flash sale impulse buy',
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'tx-4',
      amount: 1200,
      category: 'Food',
      type: 'expense',
      is_waste: true,
      notes: 'Fancy bubble tea & gourmet brownies',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'tx-5',
      amount: 2800,
      category: 'Food',
      type: 'expense',
      is_waste: false,
      notes: 'Weekly whole foods grocery haul',
      date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'tx-6',
      amount: 650,
      category: 'Travel',
      type: 'expense',
      is_waste: false,
      notes: 'Metro pass recharge',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'tx-7',
      amount: 1850,
      category: 'Food',
      type: 'expense',
      is_waste: true,
      notes: '3 AM post-gaming party burger order',
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'tx-8',
      amount: 10000,
      category: 'Investments',
      type: 'expense',
      is_waste: false,
      notes: 'Monthly SIP automated investment',
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ]
};

function readLocalDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(INITIAL_DEMO_DATA, null, 2), 'utf8');
    return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }
}

function writeLocalDb(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// -------------------------------------------------------------
// Unified Database Interface
// -------------------------------------------------------------

export async function getProfile() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
    if (!error && data) return data;
  }
  const db = readLocalDb();
  return db.profile;
}

export async function updateProfile(updates) {
  if (isSupabaseConfigured && supabase) {
    const current = await getProfile();
    if (current && current.id) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', current.id)
        .select()
        .single();
      
      if (updates.monthly_salary) {
        await supabase
          .from('transactions')
          .update({ amount: Number(updates.monthly_salary) })
          .eq('category', 'Salary')
          .eq('type', 'income');
      }

      if (!error && data) return data;
    }
  }

  const db = readLocalDb();
  db.profile = { ...db.profile, ...updates, updated_at: new Date().toISOString() };
  if (updates.monthly_salary) {
    db.transactions = (db.transactions || []).map(t => {
      if (t.category === 'Salary' && t.type === 'income') {
        return { ...t, amount: Number(updates.monthly_salary) };
      }
      return t;
    });
  }
  writeLocalDb(db);
  return db.profile;
}

export async function getTransactions(filterWaste = null) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('transactions').select('*').order('date', { ascending: false });
    if (filterWaste !== null) {
      query = query.eq('is_waste', filterWaste);
    }
    const { data, error } = await query;
    if (!error && data) return data;
  }
  const db = readLocalDb();
  let list = db.transactions || [];
  if (filterWaste !== null) {
    list = list.filter(t => t.is_waste === Boolean(filterWaste));
  }
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addTransaction(tx) {
  const newTx = {
    id: tx.id || crypto.randomUUID(),
    amount: Number(tx.amount),
    category: tx.category || 'Other',
    type: tx.type || 'expense',
    is_waste: Boolean(tx.is_waste),
    notes: tx.notes || '',
    date: tx.date || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const profile = await getProfile();
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...newTx, user_id: profile?.id }])
      .select()
      .single();
    if (!error && data) return data;
  }

  const db = readLocalDb();
  db.transactions.unshift(newTx);
  writeLocalDb(db);
  return newTx;
}

export async function deleteTransaction(id) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('transactions').delete().eq('id', id);
    return true;
  }
  const db = readLocalDb();
  db.transactions = (db.transactions || []).filter(t => t.id !== id);
  writeLocalDb(db);
  return true;
}

export async function getRecurringBills() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('recurring_bills').select('*').order('due_day_of_month', { ascending: true });
    if (!error && data) return data;
  }
  const db = readLocalDb();
  return db.recurring_bills || [];
}

export async function addRecurringBill(bill) {
  const newBill = {
    id: bill.id || crypto.randomUUID(),
    title: bill.title,
    amount: Number(bill.amount),
    category: bill.category || 'Bills',
    due_day_of_month: Number(bill.due_day_of_month) || 1,
    is_active: bill.is_active !== undefined ? Boolean(bill.is_active) : true,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const profile = await getProfile();
    const { data, error } = await supabase
      .from('recurring_bills')
      .insert([{ ...newBill, user_id: profile?.id }])
      .select()
      .single();
    if (!error && data) return data;
  }

  const db = readLocalDb();
  db.recurring_bills.push(newBill);
  writeLocalDb(db);
  return newBill;
}

export async function toggleRecurringBill(id, isActive) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('recurring_bills')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) return data;
  }

  const db = readLocalDb();
  const item = db.recurring_bills.find(b => b.id === id);
  if (item) {
    item.is_active = isActive;
    writeLocalDb(db);
  }
  return item;
}

export async function deleteRecurringBill(id) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('recurring_bills').delete().eq('id', id);
    return true;
  }
  const db = readLocalDb();
  db.recurring_bills = (db.recurring_bills || []).filter(b => b.id !== id);
  writeLocalDb(db);
  return true;
}

export async function resetToDemoData() {
  const fresh = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  writeLocalDb(fresh);
  return fresh;
}
