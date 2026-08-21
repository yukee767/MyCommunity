import "./globals.css";
import Topbar from "../components/Topbar";
import LanguageProvider from "../components/LanguageProvider";

export const metadata = { title: "MyCommunity", description: "Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#fcfcf9] text-black antialiased">
        <LanguageProvider>
          <Topbar />
          <main className="max-w-[1160px] mx-auto px-6 py-10">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
