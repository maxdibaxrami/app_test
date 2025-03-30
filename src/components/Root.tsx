import { Button, HeroUIProvider } from "@heroui/react";
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { App } from '@/components/App.tsx';
import { ToastProvider } from "@heroui/toast";
import { PoorInternetConnection } from "@/Icons/poorInternetConection";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function ErrorBoundaryError() {
  return (
    <div className="h-[100vh] bg-background flex items-center flex-col justify-center">
      <PoorInternetConnection/>
      <Button color="primary" fullWidth onPress={()=> window.location.reload()}>
        Reload
      </Button>
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
