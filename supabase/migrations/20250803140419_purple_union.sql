/*
  # Fix Contact Messages System

  1. Tables
    - Drop and recreate messages table with proper structure
    - Enable RLS with correct policies for anonymous submissions

  2. Security
    - Allow anonymous users to INSERT messages
    - Allow authenticated users to SELECT and UPDATE messages
    - Proper RLS policies that actually work
*/

-- Drop existing table and policies to start fresh
DROP TABLE IF EXISTS messages CASCADE;

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to insert messages
CREATE POLICY "Allow anonymous message submission"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users to read messages
CREATE POLICY "Allow authenticated users to read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update messages
CREATE POLICY "Allow authenticated users to update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);