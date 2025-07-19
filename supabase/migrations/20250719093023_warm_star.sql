/*
  # Portfolio Database Schema

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `created_at` (timestamp)
      - `read` (boolean, default false)
    
    - `chat_conversations`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `user_message` (text)
      - `ai_response` (text)
      - `created_at` (timestamp)
    
    - `page_analytics`
      - `id` (uuid, primary key)
      - `page_path` (text)
      - `visitor_id` (text)
      - `user_agent` (text)
      - `referrer` (text)
      - `created_at` (timestamp)
    
    - `project_views`
      - `id` (uuid, primary key)
      - `project_id` (text)
      - `visitor_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and authenticated admin access
*/

-- Messages table for contact form submissions
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Chat conversations for AI chat tracking
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_message text NOT NULL,
  ai_response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Page analytics for tracking visits
CREATE TABLE IF NOT EXISTS page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  visitor_id text NOT NULL,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Project views tracking
CREATE TABLE IF NOT EXISTS project_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  visitor_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

-- Policies for messages (public can insert, only authenticated can read)
CREATE POLICY "Anyone can submit messages"
  ON messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for chat conversations (public can insert, only authenticated can read)
CREATE POLICY "Anyone can create chat conversations"
  ON chat_conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read chat conversations"
  ON chat_conversations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for analytics (public can insert, only authenticated can read)
CREATE POLICY "Anyone can submit analytics"
  ON page_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read analytics"
  ON page_analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for project views (public can insert, only authenticated can read)
CREATE POLICY "Anyone can track project views"
  ON project_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read project views"
  ON project_views
  FOR SELECT
  TO authenticated
  USING (true);