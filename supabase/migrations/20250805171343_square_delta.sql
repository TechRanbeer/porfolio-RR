/*
  # Create Admin Messages System

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `read` (boolean, default false)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for anonymous users to insert messages
    - Add policy for authenticated users to read/update messages
*/

-- Drop existing messages table if it exists
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;

-- Create new contact_messages table
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to insert messages
CREATE POLICY "Allow anonymous message submission"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for authenticated users to read all messages
CREATE POLICY "Allow authenticated users to read messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update messages (mark as read)
CREATE POLICY "Allow authenticated users to update messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);