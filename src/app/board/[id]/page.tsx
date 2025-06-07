"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { Board, List, Card } from "../../../types/database";
import { Icons } from "../../../components/Icons";
import type { User } from "@supabase/supabase-js";

interface BoardWithLists extends Board {
  lists: (List & { cards: Card[] })[];
}

const gradients = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600", 
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-indigo-500 to-indigo-600",
  "from-red-500 to-red-600",
  "from-teal-500 to-teal-600",
];

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const [board, setBoard] = useState<BoardWithLists | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const supabase = createClient();

  // Generate consistent gradient based on board id
  const gradientIndex = board ? parseInt(board.id.slice(-1), 16) % gradients.length : 0;
  const gradient = gradients[gradientIndex];

  const fetchBoard = useCallback(async () => {
    try {
      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .select("*")
        .eq("id", params.id)
        .single();

      if (boardError) throw boardError;

      const { data: listsData, error: listsError } = await supabase
        .from("lists")
        .select("*, cards(*)")
        .eq("board_id", params.id)
        .order("position");

      if (listsError) throw listsError;

      setBoard({
        ...boardData,
        lists: listsData || [],
      });
    } catch (error) {
      console.error("Error fetching board:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [supabase, params.id, router]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchBoard();
      } else {
        router.push("/");
      }
    };

    getUser();
  }, [params.id, fetchBoard, router, supabase.auth]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim() || !board) return;

    try {
      const position = board.lists.length;
      const { data, error } = await supabase
        .from("lists")
        .insert({
          title: newListTitle.trim(),
          board_id: board.id,
          position,
        })
        .select("*, cards(*)")
        .single();

      if (error) throw error;

      setBoard(prev => prev ? {
        ...prev,
        lists: [...prev.lists, { ...data, cards: [] }],
      } : null);

      setNewListTitle("");
      setIsAddingList(false);
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Failed to create list. Please try again.");
    }
  };

  const handleCreateCard = async (listId: string, title: string) => {
    if (!title.trim() || !board) return;

    try {
      const list = board.lists.find(l => l.id === listId);
      if (!list) return;

      const position = list.cards.length;
      const { data, error } = await supabase
        .from("cards")
        .insert({
          title: title.trim(),
          list_id: listId,
          position,
        })
        .select()
        .single();

      if (error) throw error;

      setBoard(prev => prev ? {
        ...prev,
        lists: prev.lists.map(list => 
          list.id === listId 
            ? { ...list, cards: [...list.cards, data] }
            : list
        ),
      } : null);
    } catch (error) {
      console.error("Error creating card:", error);
      alert("Failed to create card. Please try again.");
    }
  };
  if (loading) {
    return (      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <Icons.Loading className="w-10 h-10 text-blue-600 mx-auto mb-4" aria-hidden="true" />
          <div className="text-lg font-medium text-gray-700 animate-pulse">
            Loading board...
          </div>
          <span className="sr-only">Please wait while the board loads</span>
        </div>
      </div>
    );
  }

  if (!board || !user) {
    return (      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Close className="w-8 h-8 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-medium text-gray-900 mb-2">Board not found</h1>
          <p className="text-gray-700 mb-4">The board you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p><button
            onClick={() => router.push("/")}
            className="btn-primary"
            aria-label="Return to boards dashboard"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} relative overflow-hidden`}>
      {/* Skip links for keyboard users */}
      <div className="sr-only focus-within:not-sr-only">
        <a 
          href="#board-header" 
          className="absolute top-4 left-4 bg-white text-blue-600 px-4 py-2 rounded-md z-50 focus:not-sr-only font-medium shadow-lg"
        >
          Skip to board header
        </a>
        <a 
          href="#board-content" 
          className="absolute top-4 left-44 bg-white text-blue-600 px-4 py-2 rounded-md z-50 focus:not-sr-only font-medium shadow-lg"
        >
          Skip to board content
        </a>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md text-white border-b border-white/10" id="board-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors group"
                aria-label="Go back to boards dashboard"
              >
                <div className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Icons.ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                </div>
                <span className="font-medium">Back to Boards</span>
              </button>
              <div className="w-px h-6 bg-white/20"></div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                  {board.title}
                </h1>                {board.description && (
                  <p className="text-white/95 text-sm mt-1 drop-shadow-sm">
                    {board.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icons.User className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-white/90">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="relative z-10 p-6 overflow-x-auto" id="board-content">
        <div className="flex gap-6 min-h-full pb-6">          {/* Lists */}
          {board.lists.map((list, index) => (
            <div
              key={list.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BoardList 
                list={list} 
                onCreateCard={(title: string) => handleCreateCard(list.id, title)}
              />
            </div>
          ))}

          {/* Add List */}
          <div className="w-80 flex-shrink-0">
            {isAddingList ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-white/20">
                <form onSubmit={handleCreateList}>                  <label htmlFor="new-list-title" className="sr-only">
                    List title
                  </label>
                  <input
                    id="new-list-title"
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="input-field mb-4 text-lg font-semibold"
                    maxLength={50}
                    autoFocus
                    aria-describedby="new-list-help"
                  />
                  <div id="new-list-help" className="sr-only">
                    Enter a descriptive title for your new list
                  </div>
                  <div className="flex gap-3">                    <button
                      type="submit"
                      className="btn-primary flex-1"
                      disabled={!newListTitle.trim()}
                      aria-label="Create new list"
                    >
                      Add List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingList(false);
                        setNewListTitle("");
                      }}
                      className="btn-secondary"
                      aria-label="Cancel creating list"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (              <button
                onClick={() => setIsAddingList(true)}
                className="w-full p-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30 group"
                aria-label="Add a new list to this board"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icons.Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" aria-hidden="true" />
                  <span className="font-medium">Add another list</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function AddCardForm({ onSubmit }: { onSubmit: (title: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title);
      setTitle("");
      setIsAdding(false);
    }
  };
  if (isAdding) {
    return (
      <div className="mt-3">
        <form onSubmit={handleSubmit}>
          <label htmlFor={`card-title-${Math.random()}`} className="sr-only">
            Card title
          </label>
          <textarea
            id={`card-title-${Math.random()}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for this card..."
            className="input-field resize-none text-sm"
            rows={3}
            maxLength={200}
            autoFocus
            aria-describedby={`card-title-help-${Math.random()}`}
          />
          <div id={`card-title-help-${Math.random()}`} className="sr-only">
            Enter a descriptive title for your new card, up to 200 characters
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="btn-primary text-sm py-2 px-4"
              disabled={!title.trim()}
              aria-label="Add new card to list"
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setTitle("");
              }}
              className="btn-secondary text-sm py-2 px-4"
              aria-label="Cancel adding card"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
  return (    <button
      onClick={() => setIsAdding(true)}
      className="w-full p-3 text-gray-700 text-sm hover:bg-gray-50 rounded-xl transition-all duration-200 border-2 border-dashed border-gray-200 hover:border-gray-300 mt-3 group"
      aria-label="Add a new card to this list"
    >
      <div className="flex items-center justify-center space-x-2">
        <Icons.Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" aria-hidden="true" />
        <span>Add a card</span>
      </div>
    </button>
  );
}

function BoardList({ list, onCreateCard }: { 
  list: List & { cards: Card[] }; 
  onCreateCard: (title: string) => void; 
}) {
  return (
    <section className="w-80 flex-shrink-0" aria-label={`List: ${list.title}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 max-h-[calc(100vh-200px)] flex flex-col">
        {/* List Header */}
        <header className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900 truncate">
              {list.title}
            </h2>            <div className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full" aria-label={`${list.cards.length} cards in this list`}>
              {list.cards.length}
            </div>
          </div>
        </header>
        
        {/* Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {list.cards.map((card, index) => (
            <div
              key={card.id}
              className="animate-slide-up hover-lift"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BoardCard card={card} />
            </div>
          ))}
            {list.cards.length === 0 && (
            <div className="text-center py-8" role="status" aria-label="Empty list">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icons.Plus className="w-6 h-6 text-gray-400" aria-hidden="true" />
              </div>              <p className="text-gray-700 text-sm">No cards yet</p>
              <p className="text-gray-600 text-xs">Add your first card to get started</p>
            </div>
          )}
        </div>        {/* Add Card Form */}
        <div className="p-4 pt-0">
          <AddCardForm onSubmit={onCreateCard} />
        </div>
      </div>
    </section>
  );
}

function BoardCard({ card }: { card: Card }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  return (
    <div 
      className="card p-4 cursor-pointer group hover:-translate-y-0.5" 
      role="button"
      tabIndex={0}
      aria-label={`Card: ${card.title}${card.description ? `. ${card.description}` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Handle card click/open functionality here
        }
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
          {card.title}
        </h4>        <div className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icons.ChevronRight className="w-3 h-3 text-gray-700" />
          </div>
        </div>
      </div>
        {card.description && (
        <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
          {card.description}
        </p>
      )}
        <div className="flex items-center justify-between text-xs text-gray-700">
        <div className="flex items-center space-x-1">
          <Icons.Calendar className="w-3 h-3" aria-hidden="true" />
          <span>{formatDate(card.created_at)}</span>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full" aria-label="Card status: active"></div>
      </div>
    </div>
  );
}
