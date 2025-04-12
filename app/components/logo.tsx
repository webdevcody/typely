import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="size-12 rounded-full bg-gradient-to-br from-primary-blue via-[#262932] to-[#1d2329] flex items-center justify-center text-white font-bold text-xl">
        <img src="/icon.png" alt="Logo" className="size-10" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-white">SITE SENSEI</h1>
        <p className="text-xs text-gray-400">The AI-Powered Site Assistant</p>
      </div>
    </Link>
  );
}
