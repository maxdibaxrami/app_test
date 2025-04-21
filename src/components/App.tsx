import { useEffect, useState, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLaunchParams, miniApp, useSignal, initData, postEvent } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import { fetchUserData } from '../features/userSlice';
import { RootState, AppDispatch } from '../store';
import { routes } from '@/navigation/routes.tsx';
import FontHandller from './FontHandller';
import Loading from '@/components/spinner/loading';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import ar from '../locales/ar.json';
import fa from '../locales/fa.json';
import { fetchLikes } from '@/features/likeSlice';
import { fetchMatches } from '@/features/matchSlice';
import { fetchFilteredExplore } from '@/features/exploreSlice';
import { fetchConversations } from '@/features/conversationsSlice';
import { fetchNearBySliceUsers, setFilters } from '@/features/nearBySlice';
import { fetchReferralData } from '@/features/refralSlice';
import MobileApp from './wapper';
import ActivityListener from './activityProvider';
import { useTheme } from 'next-themes';

// Blocked user page/component
import BlockedUserPage from '@/pages/blockedUser';

const GetStoredLanguage = async () => {
  try {
    const cloudStorage = (await import('@telegram-apps/sdk')).cloudStorage;
    if (cloudStorage.isSupported()) {
      const storedLang = await cloudStorage.getItem('lang');
      return storedLang || 'en';
    }
  } catch (error) {
    console.warn('Cloud storage not supported:', error);
  }
  return localStorage.getItem('lang') || 'en';
};

const initializeI18n = async () => {
  const storedLanguage = await GetStoredLanguage();
  await i18next
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ru: { translation: ru },
        ar: { translation: ar },
        fa: { translation: fa },
      },
      lng: storedLanguage,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
};

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  const initDataState = useSignal(initData.state);
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchedDetails, setHasFetchedDetails] = useState(false);
  const { theme } = useTheme();

  // Set WebApp colors
  useEffect(() => {
    const bg = theme === 'light' ? '#FFFFFF' : '#000000';
    postEvent('web_app_set_bottom_bar_color', { color: bg });
    postEvent('web_app_set_background_color', { color: bg });
  }, [theme]);

  // Initial user fetch
  useEffect(() => {
    dispatch(fetchUserData(initDataState.user.id.toString()));
  }, [dispatch, initDataState.hash]);

  // Secondary data fetches
  useEffect(() => {
    if (data && data.profileStage !== 'draft' && !hasFetchedDetails) {
      setHasFetchedDetails(true);
      const genderOpposite = data.gender === 'male' ? 'female' : 'male';
      const updatedFilters = { ageRange: null, city: null, country: null, languages: null, genderFilter: genderOpposite };
      dispatch(setFilters(updatedFilters));
      dispatch(fetchReferralData());
      dispatch(fetchLikes());
      dispatch(fetchMatches());
      dispatch(fetchConversations());
      dispatch(fetchFilteredExplore({  page: 1, limit: 10 }));
      dispatch(fetchNearBySliceUsers({ page: 1, limit: 50, genderFilter: genderOpposite, ...updatedFilters }));
    }
  }, [data, dispatch, hasFetchedDetails]);

  // Clear on bad auth
  useEffect(() => {
    if (error === 'ERR_BAD_REQUEST') localStorage.clear();
  }, [error]);

  // I18n init
  useEffect(() => {
    (async () => {
      await initializeI18n();
      const currentLang = i18next.language;
      document.documentElement.lang = currentLang;
      document.documentElement.dir = ['ar', 'fa'].includes(currentLang) ? 'rtl' : 'ltr';
      FontHandller();
      setIsLoading(false);
    })();
  }, []);

  // show loading spinner while auth & i18n initializing
  if (isLoading || loading) return <Loading />;

  // early return for blocked users
  if (data?.isBlocked) {
    return (
      <I18nextProvider i18n={i18next}>
        <AppRoot appearance={isDark ? 'dark' : 'light'} platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}>
          <HashRouter>
            <Routes>
              <Route path="/blocked-user" element={<BlockedUserPage />} />
              <Route path="*" element={<Navigate to="/blocked-user" replace />} />
            </Routes>
          </HashRouter>
        </AppRoot>
      </I18nextProvider>
    );
  }

  // normal app routes
  return (
    <I18nextProvider i18n={i18next}>
      <Suspense fallback={<Loading />}>
        <ActivityListener />
        <AppRoot appearance={isDark ? 'dark' : 'light'} platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}>
          <HashRouter>
            <Routes>
              {/* app routes */}
              {routes
                .filter(route => route.auth === (data.profileStage !== 'draft'))
                .map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<MobileApp><route.Component /></MobileApp>}
                  />
                ))}
              <Route
                path="*"
                element={
                  data.profileStage !== 'draft'
                    ? <Navigate to="/main?page=profile" replace />
                    : <Navigate to="/sign-up" replace />
                }
              />
            </Routes>
          </HashRouter>
        </AppRoot>
      </Suspense>
    </I18nextProvider>
  );
}
