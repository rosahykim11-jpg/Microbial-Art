import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import DrawingTool from "./components/DrawingTool";
import Articles from "./components/Articles";
import Nav from "./components/Nav";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("articles");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      <Nav session={session} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "articles" && <Articles session={session} />}
        {activeTab === "draw" && <DrawingTool />}
      </main>
    </div>
  );
}
