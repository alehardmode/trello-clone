"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { Board, List, Card } from "../../../types/database";
import type { User } from "@supabase/supabase-js";

interface BoardWithLists extends Board {
  lists: (List & { cards: Card[] })[];
}

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const [board, setBoard] = useState<BoardWithLists | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const supabase = createClient();

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading board...</div>
      </div>
    );
  }

  if (!board || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Board not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600">
      {/* Header */}
      <header className="bg-black bg-opacity-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <button
                onClick={() => router.push("/")}
                className="text-white hover:text-gray-200 mr-4"
              >
                ← Back to Boards
              </button>
              <h1 className="inline text-xl font-bold">
                {board.title}
              </h1>
            </div>
            <span className="text-sm opacity-75">
              {user.email}
            </span>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="p-4 overflow-x-auto">
        <div className="flex gap-4 min-h-full">
          {/* Lists */}
          {board.lists.map((list) => (
            <div
              key={list.id}
              className="bg-gray-100 rounded-lg p-3 w-72 flex-shrink-0"
            >
              <h3 className="font-semibold text-gray-800 mb-3">
                {list.title}
              </h3>
              
              {/* Cards */}
              <div className="space-y-2 mb-3">
                {list.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-sm text-gray-800">
                      {card.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Card */}
              <AddCardForm
                onSubmit={(title) => handleCreateCard(list.id, title)}
              />
            </div>
          ))}

          {/* Add List */}
          <div className="w-72 flex-shrink-0">
            {isAddingList ? (
              <form onSubmit={handleCreateList} className="bg-gray-100 rounded-lg p-3">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    disabled={!newListTitle.trim()}
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }}
                    className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="w-full p-3 bg-black bg-opacity-10 text-white rounded-lg hover:bg-opacity-20 transition-colors"
              >
                + Add another list
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
      <form onSubmit={handleSubmit}>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for this card..."
          className="w-full p-2 border border-gray-300 rounded mb-2 text-sm resize-none"
          rows={3}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            disabled={!title.trim()}
          >
            Add Card
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setTitle("");
            }}
            className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full p-2 text-gray-600 text-sm hover:bg-gray-200 rounded transition-colors"
    >
      + Add a card
    </button>
  );
}
