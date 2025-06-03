-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create boards table
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create lists table
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boards
CREATE POLICY "Users can view their own boards" ON boards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards" ON boards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards" ON boards
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for lists
CREATE POLICY "Users can view lists in their boards" ON lists
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = lists.board_id AND boards.user_id = auth.uid())
  );

CREATE POLICY "Users can insert lists in their boards" ON lists
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = lists.board_id AND boards.user_id = auth.uid())
  );

CREATE POLICY "Users can update lists in their boards" ON lists
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = lists.board_id AND boards.user_id = auth.uid())
  );

CREATE POLICY "Users can delete lists in their boards" ON lists
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM boards WHERE boards.id = lists.board_id AND boards.user_id = auth.uid())
  );

-- RLS Policies for cards
CREATE POLICY "Users can view cards in their lists" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN boards ON lists.board_id = boards.id
      WHERE lists.id = cards.list_id AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert cards in their lists" ON cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists
      JOIN boards ON lists.board_id = boards.id
      WHERE lists.id = cards.list_id AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cards in their lists" ON cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN boards ON lists.board_id = boards.id
      WHERE lists.id = cards.list_id AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards in their lists" ON cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lists
      JOIN boards ON lists.board_id = boards.id
      WHERE lists.id = cards.list_id AND boards.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_lists_position ON lists(position);
CREATE INDEX idx_cards_list_id ON cards(list_id);
CREATE INDEX idx_cards_position ON cards(position);

-- Create functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();