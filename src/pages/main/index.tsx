import React, { useRef, useMemo, lazy, Suspense } from 'react';
import TopBar from '@/components/tobBar';
import { Page } from '@/components/Page.tsx';
import { useSearchParams } from 'react-router-dom';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import CompleteProfileAlertModal from '@/components/profile/completeProfileAlertModal';
import { Button } from '@heroui/button';
import { FitlerIcon } from '@/Icons';
import useChatSocket from '@/socket/useChatSocket';
import Loading from '@/components/spinner/loading';

// Lazy-load pages with prefetch hints for better perceived performance
const ChatPage = lazy(() => import(/* webpackPrefetch: true */ '@/components/chat'));
const ProfilePage = lazy(() => import(/* webpackPrefetch: true */ '@/components/profile'));
const LikesPage = lazy(() => import(/* webpackPrefetch: true */ '@/pages/like/index'));
const ExplorePage = lazy(() => import(/* webpackPrefetch: true */ '@/components/explore'));
const NearByPage = lazy(() => import(/* webpackPrefetch: true */ '@/pages/nearby/page'));
const RandomChat = lazy(() => import(/* webpackPrefetch: true */ '@/components/randomChat'));
const NearByFilter = lazy(() => import(/* webpackPrefetch: true */ '@/components/naerby/NearByFilter'));

const fallbackUI = <Loading/>;

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const lp = useLaunchParams();
  const FilterRef = useRef(null);
  const { data: user } = useSelector((state: RootState) => state.user);

  // Setup global chat socket
  const currentUserId = useMemo(() => user.id.toString(), [user.id]);
  const socket = useChatSocket(currentUserId);

  // Platform-specific padding
  const paddingTop = useMemo(() => (['ios'].includes(lp.platform) ? '50px' : '25px'), [lp.platform]);

  // Open the filter modal
  const handleFilterClick = () => {
    if (FilterRef.current) {
      // @ts-ignore
      FilterRef.current.openModal();
    }
  };

  const activePage = searchParams.get('page') || 'chat';

  return (
    <Page back={activePage === 'nearby'}>
      <TopBar />
      <section style={{ paddingTop }} className="flex flex-col items-center justify-center gap-4">
        <Suspense fallback={fallbackUI}>
          {activePage === 'nearby' && <ExplorePage />}
          {activePage === 'chat' && <ChatPage />}
          {activePage === 'RandomChat' && <RandomChat socket={socket} />}
          {activePage === 'likes' && <LikesPage />}
          {activePage === 'explore' && <NearByPage />}
          {activePage === 'profile' && <ProfilePage />}
        </Suspense>

        {/* Filter button and filter component only on 'explore' to avoid extra bundle load */}
        {activePage === 'explore' && (
          <>
            <div className="fade-in fixed z-50 left-1/2 transform -translate-x-1/2 bottom-8">
              <Button
                variant="shadow"
                size="md"
                onPress={handleFilterClick}
                radius="lg"
                isIconOnly
                aria-label="Filter"
                className="bg-primary/80 backdrop-blur"
              >
                <FitlerIcon className="size-5" />
              </Button>
            </div>
            <Suspense fallback={null}>
              <NearByFilter ref={FilterRef} />
            </Suspense>
          </>
        )}

        {/* Only show profile alert when relevant */}
        <CompleteProfileAlertModal
          isOpen={
            user.profileStage === 'complete' && !['profile', 'RandomChat'].includes(activePage)
          }
        />
      </section>
    </Page>
  );
};

export default React.memo(MainPage);
