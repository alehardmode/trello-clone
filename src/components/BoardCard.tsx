import { Board } from "../types/database";
import Link from "next/link";

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Link
      href={`/board/${board.id}`}
      className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <h3 className="font-semibold text-lg text-gray-900 mb-2">
        {board.title}
      </h3>
      {board.description && (
        <p className="text-gray-600 text-sm line-clamp-2">
          {board.description}
        </p>
      )}
      <div className="mt-3 text-xs text-gray-500">
        Created {new Date(board.created_at).toLocaleDateString()}
      </div>
    </Link>
  );
}
