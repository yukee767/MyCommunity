import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "MyCommunity — Dashboard",
  description: "Painel local MyCommunity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0e1217] text-[#e6edf5] antialiased overflow-x-hidden">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 relative overflow-hidden bg-[#0e1217] min-h-screen">
            <div className="pointer-events-none absolute -right-32 -top-16 w-[560px] h-[560px] rounded-full opacity-90 blur-[22px]"
              style={{background: "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.9) 0%, rgba(14,165,233,0.45) 28%, transparent 70%)"}} />
            <div className="relative z-10 p-9 max-w-[1280px]">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
