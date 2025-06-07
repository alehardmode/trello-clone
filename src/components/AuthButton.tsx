"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { Icons } from "./Icons";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setShowDropdown(false);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        disabled={isLoading}
        className="btn-primary flex items-center space-x-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={isLoading ? "Signing in with Google..." : "Sign in with Google"}
      >
        {isLoading ? (
          <>
            <Icons.Loading className="w-5 h-5" aria-hidden="true" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Icons.Google className="w-5 h-5" aria-hidden="true" />
            <span>Continue with Google</span>
          </>
        )}
      </button>
    );
  }
  return (
    <div className="relative">      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label={`User menu for ${user.user_metadata?.full_name || user.email?.split('@')[0]}`}
        aria-expanded={showDropdown}
        aria-haspopup="true"
        id="user-menu-button"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Icons.User className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <Icons.ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>{showDropdown && (
        <div 
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-strong border border-gray-100 py-2 z-50 animate-scale-in"
          role="menu"
          aria-labelledby="user-menu-button"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Icons.User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-sm text-gray-700 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            <button
              onClick={signOut}
              disabled={isLoading}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 text-gray-800"
              role="menuitem"
              aria-label="Sign out of your account"
            >
              {isLoading ? (
                <Icons.Loading className="w-5 h-5" />
              ) : (
                <Icons.LogOut className="w-5 h-5" />
              )}
              <span>{isLoading ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      )}      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
