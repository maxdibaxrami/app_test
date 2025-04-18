import { publicUrl } from "@/helpers/publicUrl";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useLocation, useSearchParams } from "react-router-dom";

const MobileApp = ({ children }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  
  return (
    <div
      className="fixed w-screen  left-0 top-0 right-0 bottom-0 h-screen "
      id="wrap"
      style={{
        overflowY: searchParams.get('page') === "explore" || searchParams.get('page') === "RandomChat" || location.pathname.includes('chat-detail') ? "hidden" :"scroll",
        overflowX:"hidden"
      }}
    >
      <TonConnectUIProvider manifestUrl={publicUrl('tonconnect-manifest.json')}>
        <div className="relative h-screen" id="content">
          {children}
        </div>
      </TonConnectUIProvider>

    </div>
  );
};

export default MobileApp;
