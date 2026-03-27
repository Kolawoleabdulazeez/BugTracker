import type { AppProps } from "next/app";
import "./styles/globals.css";
import AppProvider from "./Provider";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./store";
import { useRouter } from "next/router";
import Navbar from "@/Component/navbar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const hideNavbar = ["/Login", "/Signup"].includes(router.pathname);

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppProvider>
          <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
            {!hideNavbar && (
              <>
                <aside className="sticky top-0 hidden h-screen w-[250px] flex-shrink-0 md:block">
                  <Navbar />
                </aside>

                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 text-gray-900 shadow-sm md:hidden dark:border-gray-700 dark:bg-[#101222] dark:text-white"
                >
                  <Menu size={22} />
                </button>

                {mobileNavOpen && (
                  <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="h-full w-[260px] bg-white shadow-xl dark:bg-[#101222]">
                      <div className="flex justify-end p-4">
                        <button
                          onClick={() => setMobileNavOpen(false)}
                          className="text-gray-900 dark:text-white"
                        >
                          <X size={22} />
                        </button>
                      </div>

                      <Navbar onClose={() => setMobileNavOpen(false)} />
                    </div>

                    <div
                      className="flex-1 bg-black/50"
                      onClick={() => setMobileNavOpen(false)}
                    />
                  </div>
                )}
              </>
            )}

            <main className={`flex-1 overflow-auto ${spaceGrotesk.className}`}>
              <Component {...pageProps} />
            </main>
          </div>

          <Toaster position="top-right" richColors />
        </AppProvider>
      </ThemeProvider>
    </Provider>
  );
}