-- ==============================================================================
-- WealthPulse: Production Database Schema for Supabase (PostgreSQL Free Tier)
-- ==============================================================================
-- Execute this script in your Supabase project's SQL Editor (Dashboard > SQL Editor)
-- This creates the core tables, indexes, and sample seed data for WealthPulse.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Stores personal details and account settings)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Arunaswin S',
    email TEXT UNIQUE NOT NULL,
    username VARCHAR(50) DEFAULT 'sarunaswin',
    avatar_url TEXT,
    phone_number VARCHAR(25) DEFAULT '+91 98765 43210',
    monthly_salary NUMERIC(12, 2) NOT NULL DEFAULT 50000.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    savings_goal_percent NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration query if table already exists in Supabase:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Arunaswin S';
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username VARCHAR(50) DEFAULT 'sarunaswin';
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number VARCHAR(25) DEFAULT '+91 98765 43210';

-- 3. Transactions Table (Income, Expenses, with the signature "is_waste" tag)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL, -- 'Food', 'Travel', 'Bills', 'Shopping', 'Investments', 'Entertainment', 'Health', 'Other'
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    is_waste BOOLEAN NOT NULL DEFAULT FALSE, -- Crucial for tracking impulse buying & money leaks
    notes TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast queries by user and date
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_is_waste ON transactions(user_id, is_waste);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(user_id, category);

-- 4. Recurring Bills & Fixed Costs Table
CREATE TABLE IF NOT EXISTS recurring_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, -- e.g. 'Rent', 'Home Loan EMI', 'Netflix', 'SIP Mutual Fund'
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL DEFAULT 'Bills',
    due_day_of_month INT NOT NULL CHECK (due_day_of_month BETWEEN 1 AND 31),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recurring_user ON recurring_bills(user_id, is_active);

-- ==============================================================================
-- Row Level Security (RLS) - Optional for Supabase Auth
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_bills ENABLE ROW LEVEL SECURITY;

-- Allow public access for development / service role, or tie to auth.uid()
CREATE POLICY "Allow full access to profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow full access to transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow full access to recurring_bills" ON recurring_bills FOR ALL USING (true);

-- ==============================================================================
-- Sample Demo Data
-- ==============================================================================
INSERT INTO profiles (id, email, monthly_salary, currency, savings_goal_percent)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@wealthpulse.app', 65000.00, 'INR', 25.00)
ON CONFLICT (email) DO UPDATE SET monthly_salary = EXCLUDED.monthly_salary;

-- Sample Recurring Fixed Costs
INSERT INTO recurring_bills (user_id, title, amount, category, due_day_of_month, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'House Rent', 18000.00, 'Bills', 5, true),
    ('00000000-0000-0000-0000-000000000001', 'SIP - Nifty 50 Index', 10000.00, 'Investments', 10, true),
    ('00000000-0000-0000-0000-000000000001', 'Netflix & Spotify Bundle', 999.00, 'Entertainment', 15, true),
    ('00000000-0000-0000-0000-000000000001', 'WiFi Fiber Broadband', 850.00, 'Bills', 2, true)
ON CONFLICT DO NOTHING;

-- Sample Transactions showing both regular and impulsive "waste" expenses
INSERT INTO transactions (user_id, amount, category, type, is_waste, notes, date)
VALUES
    ('00000000-0000-0000-0000-000000000001', 65000.00, 'Salary', 'income', false, 'Monthly salary credited', CURRENT_DATE - INTERVAL '10 days'),
    ('00000000-0000-0000-0000-000000000001', 18000.00, 'Bills', 'expense', false, 'Rent paid to landlord', CURRENT_DATE - INTERVAL '6 days'),
    ('00000000-0000-0000-0000-000000000001', 3450.00, 'Shopping', 'expense', true, 'Midnight sneakers order on sale', CURRENT_DATE - INTERVAL '5 days'),
    ('00000000-0000-0000-0000-000000000001', 1200.00, 'Food', 'expense', true, 'Fancy bubble tea & cupcakes delivery', CURRENT_DATE - INTERVAL '4 days'),
    ('00000000-0000-0000-0000-000000000001', 2800.00, 'Food', 'expense', false, 'Weekly grocery haul', CURRENT_DATE - INTERVAL '3 days'),
    ('00000000-0000-0000-0000-000000000001', 650.00, 'Travel', 'expense', false, 'Metro card recharge', CURRENT_DATE - INTERVAL '2 days'),
    ('00000000-0000-0000-0000-000000000001', 1850.00, 'Food', 'expense', true, 'Late night party nachos & sodas', CURRENT_DATE - INTERVAL '1 days'),
    ('00000000-0000-0000-0000-000000000001', 10000.00, 'Investments', 'expense', false, 'Monthly Index SIP investment', CURRENT_DATE - INTERVAL '1 days')
ON CONFLICT DO NOTHING;
