import { Button, HeroUIProvider } from "@heroui/react";
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { App } from '@/components/App.tsx';
import { ToastProvider } from "@heroui/toast";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
//import animationData from "@/components/animate/error.json";
//import Lottie from "lottie-react";

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {

  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
              <HeroUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="dark">
                      <App /> {/* I18nextProvider is now moved to the App component */}
                    </NextThemesProvider>
                <ToastProvider placement="top-center" toastOffset={100}/>
              </HeroUIProvider>
         <SpeedInsights/>
         <Analytics/>
    </ErrorBoundary>
  );
}
