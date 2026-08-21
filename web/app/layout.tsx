import "./globals.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LanguageProvider from "../components/LanguageProvider";

export const metadata = {
  title: "MyCommunity — Dashboard",
  description: "Painel híbrido MyCommunity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0e1217] text-[#e6edf5] antialiased overflow-x-hidden">
        <LanguageProvider>
          <Topbar />
          <div className="flex min-h-[calc(100vh-56px)]">
            <Sidebar />
            <main className="flex-1 relative overflow-hidden bg-[#0e1217] min-h-[calc(100vh-56px)]">
              <div className="pointer-events-none absolute -right-32 -top-16 w-[560px] h-[560px] rounded-full opacity-60 blur-[26px]"
                style={{background: "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.85) 0%, rgba(14,165,233,0.35) 28%, transparent 70%)"}} />
              <div className="relative z-10 p-7 max-w-[1280px]">{children}</div>
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
