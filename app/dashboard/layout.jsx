import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full max-w-[100vw] overflow-x-clip">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-gray-50 px-4 pb-8 pt-20 sm:px-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
