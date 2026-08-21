import "./globals.css";
import Topbar from "../components/Topbar";
import LanguageProvider from "../components/LanguageProvider";
import ThemeProvider from "../components/ThemeProvider";

export const metadata = { title: "MyCommunity", description: "Dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <Topbar />
            <main className="max-w-[1160px] mx-auto px-6 py-10">{children}</main>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
