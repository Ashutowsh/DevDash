import { AppSideBar } from '@/components/AppSideBar';
import { ModeToggle } from '@/components/Functionalities/ModeButton';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSideBar />

      <main className="flex-1 w-full p-4 sm:p-6 md:p-8">
        {/* Top Bar */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 shadow-sm px-4 py-2">
          {/* Optional: Search bar slot */}
          <div className="ml-auto flex items-center gap-2">
            <UserButton />
            <ModeToggle />
          </div>
        </div>

        {/* Spacer */}
        <div className="h-4" />

        {/* Main content */}
        <div className="rounded-xl border border-border bg-muted/40 shadow-sm h-[calc(100vh-10rem)] overflow-y-auto p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
