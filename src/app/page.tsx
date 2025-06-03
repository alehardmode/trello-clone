
import { createClient } from '../../utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  const { data: boards } = await supabase.from('boards').select('*')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Trello Clone</h1>
      <ul className="space-y-2">
        {boards?.map((board) => (
          <li key={board.id} className="p-4 border rounded">
            <h2 className="font-semibold">{board.title}</h2>
            {board.description && (
              <p className="text-gray-600">{board.description}</p>
            )}
          </li>
        ))}
      </ul>
      {(!boards || boards.length === 0) && (
        <p className="text-gray-500">No boards found. Create your first board!</p>
      )}
    </div>
  )
}
