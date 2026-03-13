import type { AppProps } from "next/app";
import "./styles/globals.css";
import AppProvider from "./Provider";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./store";
import { useRouter } from "next/router";
import Navbar from "@/Component/navbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Routes where navbar should be hidden
  const hideNavbar = ["/Login", "/login", "/signup", "/auth"].includes(
    router.pathname
  );

  return (
    <Provider store={store}>
      <AppProvider>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          {!hideNavbar && (
            <aside className="w-[250px] h-screen sticky top-0 flex-shrink-0">
              <Navbar />
            </aside>
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <Component {...pageProps} />
          </main>
        </div>

        <Toaster position="top-right" richColors />
      </AppProvider>
    </Provider>
  );
}