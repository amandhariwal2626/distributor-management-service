"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchUsers, createUser, User } from "@/lib/api";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<"connecting" | "connected" | "error">("connecting");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      setDbStatus("connected");
      setError(null);
    } catch {
      setDbStatus("error");
      setError("Could not connect to NestJS backend or PostgreSQL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchInitialData = async () => {
      // Defer state update to escape synchronous execution in effect body
      await Promise.resolve();
      if (!active) return;
      setLoading(true);
      try {
        const data = await fetchUsers();
        if (!active) return;
        setUsers(data);
        setDbStatus("connected");
        setError(null);
      } catch {
        if (!active) return;
        setDbStatus("error");
        setError("Could not connect to NestJS backend or PostgreSQL.");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };
    fetchInitialData();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await createUser(email, name || undefined);
      setEmail("");
      setName("");
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create user";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col items-center justify-between p-6 sm:p-24 selection:bg-primary selection:text-primary-foreground">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex">
        <p className="flex w-full justify-center border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md pb-6 pt-8 md:static md:w-auto md:rounded-xl md:border md:p-4">
          Status:&nbsp;
          <code className={`font-mono font-bold ${
            dbStatus === "connected" ? "text-emerald-400" :
            dbStatus === "connecting" ? "text-amber-400" : "text-rose-400"
          }`}>
            {dbStatus.toUpperCase()}
          </code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-black via-black/80 to-transparent md:static md:h-auto md:w-auto md:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 md:pointer-events-auto md:p-0"
            href="https://turbo.build"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400">
              Turborepo
            </span>
          </a>
        </div>
      </div>

      <div className="my-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500">
          DMS Monorepo Setup
        </h1>
        <p className="max-w-2xl text-slate-400 text-base md:text-lg">
          A production-ready stack utilizing Next.js, NestJS, Prisma ORM, and PostgreSQL. Everything is dockerized with hot reloading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-start">
        {/* User creation card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            Create Database User
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Name (optional)
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-100 placeholder:text-slate-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-100 placeholder:text-slate-600 transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/50 rounded-lg p-2.5">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Creating..." : "Save User to Postgres"}
            </Button>
          </form>
        </div>

        {/* Users list card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Database Records
            </h2>
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
              Refresh
            </Button>
          </div>

          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-slate-500 text-sm">
              Connecting to DB...
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
              <span className="font-semibold text-slate-400 mb-1">No users found</span>
              Create one on the left to see it write to Postgres.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-slate-950/80 border border-slate-800/60 rounded-xl p-4 flex justify-between items-center hover:border-slate-700/60 transition-all group/item"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user.name || "Anonymous User"}
                    </p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-900 px-2.5 py-1 rounded-full group-hover/item:text-slate-300 transition-colors">
                    ID: {user.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="w-full text-center py-8 text-xs text-slate-600 mt-12 border-t border-slate-900/60">
        DMS Turborepo Stack • Next.js 15 App Router & NestJS 11
      </footer>
    </main>
  );
}
