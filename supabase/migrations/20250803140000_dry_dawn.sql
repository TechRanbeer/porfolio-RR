/*
  # Fix Messages Table RLS Policy

  1. Security Changes
    - Drop existing restrictive policies
    - Add policy allowing anonymous users to insert messages
    - Keep read access restricted to authenticated users
    - Add update access for authenticated users to mark as read

  2. Policy Details
    - INSERT: Allow anonymous users to submit contact messages
    - SELECT: Only authenticated users (admin) can read messages
    - UPDATE: Only authenticated users can update message status
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can read messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON messages;

-- Create new policies with proper permissions
CREATE POLICY "Allow anonymous message submission"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);