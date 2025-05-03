import ChatPage from '@/components/chat'
import TopBar from '@/components/tobBar'
import { Page } from '@/components/Page.tsx';
import { useSearchParams } from "react-router-dom";
import ProfilePage from '@/components/profile';
import LikesPage from '@/pages/like/index';
import ExplorePage from '@/components/explore';
import NearByPage from '@/pages/nearby/page';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Button } from "@heroui/button";
import { FitlerIcon } from '@/Icons';
import NearByFilter from '@/components/naerby/NearByFilter';
import { useRef } from 'react';
import RandomChat from '@/components/randomChat';


const MainPage = () => {
  
  const [searchParams] = useSearchParams();
  const lp = useLaunchParams();
  const FilterRef = useRef();

  const getPaddingForPlatform = () => {
    if (['ios'].includes(lp.platform)) {
      // iOS/macOS specific padding (e.g., accounting for notches)
      return '50px'; // Adjust as needed for iOS notch
    } else {
      // Android/base padding
      return '25px'; // Default padding
    }
  };

  const handleFilterClick = () => {
    if (FilterRef.current) {
      /* @ts-ignore */
      FilterRef.current.openModal();
    }
  };

  return (
    <Page back={false}>
      {/* TopBar */}
        <TopBar />
      <section style={{ paddingTop: getPaddingForPlatform() }} className="flex flex-col items-center justify-center gap-4">
        {searchParams.get('page') === "nearby" && (
          <div className="fade-in" style={{ width: "100%" }}>
            <ExplorePage />
          </div>
        )}

        {searchParams.get('page') === "chat" && (
          <div className="fade-in" style={{ width: "100%" }}>
            <ChatPage />
          </div>
        )}

        {searchParams.get('page') === "RandomChat" && (
          <div className="fade-in" style={{ width: "100%" }}>
            <RandomChat/>
          </div>
        )}

        {searchParams.get('page') === "likes" && (
          <div className="fade-in" style={{ width: "100%" }}>
            <LikesPage />
          </div>
        )}

        {searchParams.get('page') === "explore" && (
          <div className="fade-in" style={{ width: "100%" }}>
            <NearByPage />
          </div>
        )}

        {searchParams.get('page') === "profile" && (
          <div className="fade-in">
            <ProfilePage />
          </div>
        )}

        {searchParams.get('page') === "explore" && (
          <div
            style={{
              position: "fixed",
              zIndex: 50,
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "30px"
            }}
            className="fade-in"
          >
            <Button
              variant="shadow"
              size="md"
              onPress={handleFilterClick}
              radius="lg"
              isIconOnly
              aria-label="Filter"
              color="primary"
              className="bg-primary/80 backdrop-blur"
            >
              <FitlerIcon className="size-5"/>
            </Button>
          </div>
        )}
    
          
          <NearByFilter ref={FilterRef} />
      </section>
    </Page>
  );
};

export default MainPage;