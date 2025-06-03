# Trello Clone

A modern Trello clone built with React, Next.js, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Drag & Drop**: Intuitive drag-and-drop functionality with @dnd-kit
- **Real-time Updates**: Live collaboration with Supabase realtime subscriptions
- **Authentication**: Secure user authentication with Supabase Auth
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Drag & Drop**: @dnd-kit
- **Hosting**: Vercel (Frontend) + Supabase (Backend)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/alehardmode/trello-clone.git
cd trello-clone
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up the database:
Run the SQL scripts in the `database` folder in your Supabase SQL editor to create the necessary tables.

5. Start the development server:
```bash
pnpm dev
```

## 🗄️ Database Schema

The application uses the following main tables:

- **boards**: Store user boards/projects
- **lists**: Store lists within boards
- **cards**: Store individual cards within lists

All tables include Row Level Security (RLS) policies to ensure users can only access their own data.

## 🚧 Development Status

This project is currently in active development. Planned features include:

- [ ] Board creation and management
- [ ] List creation and reordering
- [ ] Card creation, editing, and management
- [ ] Real-time collaboration
- [ ] User avatars and profiles
- [ ] File attachments
- [ ] Due dates and labels
- [ ] Search functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Live Demo

[Coming Soon]

---

Built with ❤️ using Next.js and Supabase