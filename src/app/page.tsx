"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "../../utils/supabase/client";
import { Board } from "../types/database";
import { BoardCard } from "../components/BoardCard";
import { CreateBoardModal } from "../components/CreateBoardModal";
import { AuthButton } from "../components/AuthButton";
import { Icons } from "../components/Icons";
import type { User } from "@supabase/supabase-js";

export default function Page() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBoards = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBoards(data || []);
    } catch (error) {
      console.error("Error fetching boards:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchBoards();
      } else {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchBoards();
        } else {
          setBoards([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, fetchBoards]);

  const handleBoardCreated = (newBoard: Board) => {
    setBoards(prev => [newBoard, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Skip link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <div className="text-center" role="status" aria-live="polite">
          <Icons.Loading className="w-10 h-10 text-blue-600 mx-auto mb-4" aria-hidden="true" />
          <div className="text-lg font-medium text-gray-700 animate-pulse">
            Loading your workspace...
          </div>
          <span className="sr-only">Please wait while your workspace loads</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Skip link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        {/* Background decorations - optimized for CLS with explicit dimensions */}
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none" 
          aria-hidden="true" 
          style={{ 
            contain: 'layout strict',
            width: '100%',
            height: '100%'
          }}
        >
          <div 
            className="absolute -top-40 -right-40 bg-blue-200/30 rounded-full blur-3xl transform-gpu" 
            style={{ 
              willChange: 'transform',
              width: '320px',
              height: '320px',
              contain: 'layout'
            }}
          ></div>
          <div 
            className="absolute -bottom-40 -left-40 bg-purple-200/30 rounded-full blur-3xl transform-gpu" 
            style={{ 
              willChange: 'transform',
              width: '320px',
              height: '320px',
              contain: 'layout'
            }}
          ></div>
          <div 
            className="absolute top-1/3 left-1/3 bg-indigo-200/20 rounded-full blur-3xl transform-gpu" 
            style={{ 
              willChange: 'transform',
              width: '240px',
              height: '240px',
              contain: 'layout'
            }}
          ></div>
        </div>

        {/* Hero Section */}
        <main id="main-content" className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-lg">
                <Icons.Board className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Transform the way you organize projects with beautiful boards, intuitive lists, and powerful collaboration tools
            </p>
          </div>

          <div className="space-y-4">
            <AuthButton />
            <p className="text-sm text-gray-700 max-w-md mx-auto">
              Join thousands of teams already using TaskFlow to streamline their workflow and boost productivity
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                <Icons.Board className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visual Boards</h3>
              <p className="text-gray-700 text-sm">Organize tasks in a visual, intuitive way that makes project management effortless</p>
            </div>
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
                <Icons.User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-700 text-sm">Work together seamlessly with real-time updates and shared workspaces</p>
            </div>
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft">
              <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                <Icons.Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Workflow</h3>
              <p className="text-gray-700 text-sm">Intelligent features that adapt to your team&apos;s workflow and boost productivity</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Skip links for keyboard users */}
      <div className="sr-only focus-within:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:not-sr-only"
        >
          Skip to main content
        </a>
        <a 
          href="#user-navigation" 
          className="absolute top-4 left-40 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:not-sr-only"
        >
          Skip to navigation
        </a>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-md">
                <Icons.Board className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  TaskFlow
                </h1>
                <p className="text-sm text-gray-700">Your Digital Workspace</p>
              </div>
            </div>
            <nav id="user-navigation" className="flex items-center gap-6" aria-label="User navigation">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Icons.User className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-700">{user.email}</p>
                </div>
              </div>
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                My Boards
              </h2>
              <p className="text-gray-700">
                {boards.length === 0
                  ? "Create your first board to get started"
                  : `${boards.length} board${boards.length !== 1 ? 's' : ''} in your workspace`
                }
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center space-x-2 group"
              aria-label="Create a new board"
            >
              <Icons.Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" aria-hidden="true" />
              <span>Create Board</span>
            </button>
          </div>
        </div>

        {/* Boards Grid - Optimized for CLS */}
        {boards.length > 0 ? (
          <section aria-labelledby="boards-heading" className="contain-layout">
            <h2 id="boards-heading" className="sr-only">Your boards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up" style={{ contain: 'layout' }}>
              {boards.map((board, index) => (
                <div
                  key={board.id}
                  className="animate-fade-in transform-gpu"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    contain: 'layout style'
                  }}
                >
                  <BoardCard board={board} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-16 animate-fade-in" role="status" aria-live="polite">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Icons.Board className="w-12 h-12 text-gray-400" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No boards yet
              </h3>
              <p className="text-gray-700 mb-6">
                Create your first board to start organizing your projects and boost your productivity
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary inline-flex items-center space-x-2"
                aria-label="Create your first board to get started"
              >
                <Icons.Plus className="w-5 h-5" aria-hidden="true" />
                <span>Create Your First Board</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBoardCreated={handleBoardCreated}
      />
    </div>
  );
}
