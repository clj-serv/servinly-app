-- Create simplified user_experiences table that matches your onboarding state exactly
CREATE TABLE IF NOT EXISTS user_experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core experience fields (matches your onboarding state exactly)
  role TEXT NOT NULL,
  org_name TEXT,
  location TEXT,
  start_date TEXT, -- Keep as YYYY-MM to match your code
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  
  -- Personality and work style (matches your state exactly)
  traits TEXT[], -- Matches your TraitId[]
  scenario TEXT, -- Matches your ScenarioId
  vibe TEXT,
  
  -- Career content (matches your state exactly)
  highlight_text TEXT,
  highlight_suggestions TEXT[],
  responsibilities TEXT[],
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_experiences ENABLE ROW LEVEL SECURITY;

-- Create policies for user data isolation
CREATE POLICY "Users can view their own experiences" ON user_experiences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences" ON user_experiences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" ON user_experiences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" ON user_experiences
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_experiences_user_id ON user_experiences(user_id);
CREATE INDEX idx_user_experiences_role ON user_experiences(role);
CREATE INDEX idx_user_experiences_created_at ON user_experiences(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_experiences_updated_at 
  BEFORE UPDATE ON user_experiences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
