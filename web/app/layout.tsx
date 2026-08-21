import "./globals.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LanguageProvider from "../components/LanguageProvider";

export const metadata = {
  title: "MyCommunity — Dashboard",
  description: "Minimal dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <LanguageProvider>
          <Topbar />
          <div className="flex min-h-[calc(100vh-48px)]">
            <Sidebar />
            <main className="flex-1 bg-white p-8 max-w-[1100px] mx-auto w-full">
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
