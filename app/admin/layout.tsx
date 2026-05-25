import AdminNav from "@/app/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles authentication for all /admin routes except /admin/login
  // AdminNav component handles conditional rendering based on pathname
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminNav />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}