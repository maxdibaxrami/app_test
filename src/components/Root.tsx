import { Button, HeroUIProvider } from "@heroui/react";
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { App } from '@/components/App.tsx';
import { ToastProvider } from "@heroui/toast";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Lottie from "lottie-react";
//import Lottie from "lottie-react";
import animationData from "@/components/animate/error.json";

function ErrorBoundaryError() {
  return (
    <div className="h-screen gap-4 flex items-center justify-center flex-col">
    <Lottie animationData={animationData} loop={true} autoplay={true} />
    <p className="text-md text-black"> No internet connection :( </p>
    <Button onPress={()=> location.reload()} color="primary" variant="shadow">
      Refresh the app
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
