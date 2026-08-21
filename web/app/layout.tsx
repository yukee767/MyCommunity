import "./globals.css";
import Topbar from "../components/Topbar";
import LanguageProvider from "../components/LanguageProvider";
import ThemeProvider from "../components/ThemeProvider";

export const metadata = { title: "MyCommunity", description: "Dashboard" };

const themeScript = `(function(){try{var t=localStorage.getItem('mc_theme');if(t!=='light'&&t!=='dark')t='light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
