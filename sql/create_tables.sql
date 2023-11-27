-- Create Extension to enable uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Table to store prize configurations
CREATE TABLE IF NOT EXISTS
  prize (
    id TEXT NOT NULL,
    title TEXT NOT NULL,
    daily_quota INT,
    total_quota INT,
    probability FLOAT,
    active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id)
  );

-- Create Table to store lucky draw results
CREATE TABLE IF NOT EXISTS
  result (
    id UUID DEFAULT uuid_generate_v4 (),
    user_id TEXT NOT NULL,
    prize_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    phone_no TEXT,
    PRIMARY KEY (id)
  );
