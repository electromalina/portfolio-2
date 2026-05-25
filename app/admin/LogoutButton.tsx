"use client";

import { logout } from "@/app/admin/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Logout
      </button>
    </form>
  );
}

