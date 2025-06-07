import { Board } from "../types/database";
import { Icons } from "./Icons";
import Link from "next/link";

interface BoardCardProps {
  board: Board;
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

export function BoardCard({ board }: BoardCardProps) {
  // Generate a consistent gradient based on board id
  const gradientIndex = parseInt(board.id.slice(-1), 16) % gradients.length;
  const gradient = gradients[gradientIndex];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) return "Just now";
      return `${diffInHours}h ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };  return (
    <Link
      href={`/board/${board.id}`}
      className="group block relative overflow-hidden bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-gray-100 transform-gpu"
      aria-label={`Open board: ${board.title}${board.description ? `. ${board.description}` : ''}`}
      role="button"
      style={{ 
        contain: 'layout style',
        willChange: 'transform, box-shadow'
      }}
    >
      {/* Gradient Header */}
      <div className={`h-20 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Icons.ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
            {board.title}
          </h3>
        </div>
          {board.description && (
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-4">
            {board.description}
          </p>
        )}          <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-gray-700">
            <Icons.Calendar className="w-4 h-4" />
            <span>Created {formatDate(board.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
            <span className="text-gray-700">Active</span>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Link>
  );
}
