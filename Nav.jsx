import { supabase } from "../supabaseClient";

export default function Nav({ session, activeTab, setActiveTab }) {
  const username = session.user.user_metadata?.username || session.user.email?.split("@")[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight hidden sm:block" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Canvas &amp; Quill
          </span>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-800/60 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "articles"
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Articles
          </button>
          <button
            onClick={() => setActiveTab("draw")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "draw"
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Draw
          </button>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-zinc-400 hidden sm:block">{username}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
