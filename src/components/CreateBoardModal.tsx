"use client";

import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { Board } from "../types/database";
import { Icons } from "./Icons";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoardCreated: (board: Board) => void;
}

const backgroundOptions = [
  { name: "Ocean Blue", gradient: "from-blue-500 to-blue-600", id: "blue" },
  { name: "Purple Dreams", gradient: "from-purple-500 to-purple-600", id: "purple" },
  { name: "Forest Green", gradient: "from-green-500 to-green-600", id: "green" },
  { name: "Sunset Orange", gradient: "from-orange-500 to-orange-600", id: "orange" },
  { name: "Rose Pink", gradient: "from-pink-500 to-pink-600", id: "pink" },
  { name: "Deep Indigo", gradient: "from-indigo-500 to-indigo-600", id: "indigo" },
  { name: "Ruby Red", gradient: "from-red-500 to-red-600", id: "red" },
  { name: "Teal Wave", gradient: "from-teal-500 to-teal-600", id: "teal" },
];

export function CreateBoardModal({ isOpen, onClose, onBoardCreated }: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("You must be logged in to create a board");
        return;
      }

      const { data, error } = await supabase
        .from("boards")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      onBoardCreated(data);
      setTitle("");
      setDescription("");
      setSelectedBackground(backgroundOptions[0]);
      onClose();
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setSelectedBackground(backgroundOptions[0]);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-board-title"
      aria-describedby="create-board-description"
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl mx-auto shadow-xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">          <div>
            <h2 id="create-board-title" className="text-2xl font-bold text-gray-900 mb-1">Create New Board</h2>
            <p id="create-board-description" className="text-gray-700">Start organizing your project with a beautiful board</p>
          </div>          <button
            onClick={handleClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close create board modal"
          >
            <Icons.Close className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Board Preview */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Board Preview</label>
            <div className={`h-32 bg-gradient-to-br ${selectedBackground.gradient} rounded-2xl relative overflow-hidden shadow-soft`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-xl drop-shadow-md">
                  {title || "Board Title"}
                </h3>
                {(description || !title) && (                  <p className="text-white text-sm mt-1 drop-shadow-sm">
                    {description || "Your board description will appear here"}
                  </p>
                )}
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
            </div>
          </div>

          {/* Board Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
              Board Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field text-lg font-medium"
              placeholder="e.g., Marketing Campaign, Product Roadmap..."
              maxLength={50}
              required
            />            <div className="mt-2 text-xs text-gray-700 text-right">
              {title.length}/50 characters
            </div>
          </div>
          
          {/* Board Description */}
          <div className="mb-6">            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
              Description <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Describe what this board is for..."
              maxLength={200}
            />            <div className="mt-2 text-xs text-gray-700 text-right">
              {description.length}/200 characters
            </div>
          </div>          {/* Background Selection */}
          <div className="mb-8">
            <fieldset>
              <legend className="block text-sm font-semibold text-gray-700 mb-3">
                Background Color
              </legend>
              <div className="grid grid-cols-4 gap-3" role="radiogroup" aria-label="Select board background color">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedBackground(option)}
                    className={`group relative h-16 bg-gradient-to-br ${option.gradient} rounded-xl transition-all duration-200 ${
                      selectedBackground.id === option.id 
                        ? 'ring-4 ring-blue-500 ring-offset-2 scale-105' 
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                    role="radio"
                    aria-checked={selectedBackground.id === option.id}
                    aria-label={`Select ${option.name} background`}
                  >
                  <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                  {selectedBackground.id === option.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  )}                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs text-white font-medium truncate drop-shadow-sm">
                      {option.name}
                    </div>
                  </div></button>
                ))}
              </div>
            </fieldset>
          </div>
            {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
              aria-label="Cancel creating board"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
              disabled={isLoading || !title.trim()}
              aria-label={isLoading ? "Creating board..." : "Create new board"}
            >
              {isLoading ? (
                <>
                  <Icons.Loading className="w-5 h-5" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Icons.Plus className="w-5 h-5" />
                  <span>Create Board</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
