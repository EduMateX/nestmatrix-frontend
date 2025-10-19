import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";
import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
    useWebSocket();
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[256px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
                <BreadcrumbProvider>
                    <Header />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 bg-muted/40">
                        <Outlet />
                    </main>
                </BreadcrumbProvider>
            </div>
        </div>
    );
}