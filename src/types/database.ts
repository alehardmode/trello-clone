export interface Board {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface List {
  id: string;
  title: string;
  board_id: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  list_id: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: Board;
        Insert: Omit<Board, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Board, 'id' | 'created_at' | 'updated_at'>>;
      };
      lists: {
        Row: List;
        Insert: Omit<List, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<List, 'id' | 'created_at' | 'updated_at'>>;
      };
      cards: {
        Row: Card;
        Insert: Omit<Card, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Card, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
