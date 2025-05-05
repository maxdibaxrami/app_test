import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

import BlurFade from '../animate/BlurFade';
import ThemeSwitch from './switchTheme';
import { EnergyButton } from './energyButton';
import NavBar from '../NavBar';
import { RootState } from '@/store';
import {
  FireIcon,
  ChatIcon,
  ProfileIcon,
  LikeIcon,
  LocationIcon,
  SettingIcon,
  EditProfileIcon,
  VerifyIconFill,
  AddFirendsIcon,
  ViewIcon,
  FavoriteColor,
  GiftIcon,
  FlashIcon,
  PerimumIcon,
  RandomChatIcon
} from '@/Icons';

interface NavConfig {
  path?: string;
  page?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  labelKey: string;
}

// Define both path-based and nested-page-based nav items
const navItems: NavConfig[] = [
  { path: '/setting', icon: SettingIcon, labelKey: 'Setting' },
  { path: '/profile-edit', icon: EditProfileIcon, labelKey: 'EditProfile' },
  { path: '/edit-profile-field', icon: EditProfileIcon, labelKey: 'EditProfile' },
  { path: '/favorite-view', icon: FavoriteColor, labelKey: 'favorite' },
  { path: '/profile-view', icon: ViewIcon, labelKey: 'who_viewed_profile' },
  { path: '/add-friends', icon: AddFirendsIcon, labelKey: 'invite_your_friend' },
  { path: '/gift-view', icon: GiftIcon, labelKey: 'gift_List' },
  { path: '/verify-account', icon: VerifyIconFill, labelKey: 'Verification' },
  { path: '/energy', icon: FlashIcon, labelKey: 'energy' },

  { page: 'profile', icon: ProfileIcon, labelKey: 'Profile' },
  { page: 'nearby', icon: FireIcon, labelKey: 'Nearby' },
  { page: 'explore', icon: LocationIcon, labelKey: 'Explore' },
  { page: 'random-chat', icon: RandomChatIcon, labelKey: 'anonymous_chat' },
  { page: 'likes', icon: LikeIcon, labelKey: 'Likes' },
  { page: 'chat', icon: ChatIcon, labelKey: 'Chat' },
];

const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { userPageData: user, userPageLoading } = useSelector(
    (state: RootState) => state.user
  );

  // extract nested "page" segment from "/main/<page>"
  const nestedPage = useMemo(() => {
    const parts = pathname.split('/');
    return parts[1] === 'main' && parts[2] ? parts[2] : undefined;
  }, [pathname]);

  // pick matching nav item
  const current = useMemo<NavConfig | undefined>(() => {
    // first by full path
    const byPath = navItems.find(item => item.path === pathname);
    if (byPath) return byPath;
    // then by nested page
    if (nestedPage) {
      // map old casing for random-chat -> RandomChatIcon, labelKey stays
      return navItems.find(item => item.page === nestedPage);
    }
    return undefined;
  }, [pathname, nestedPage]);

  const showFilterAndTheme = nestedPage !== undefined || pathname !== '/main';

  return (
    <div style={{ zIndex: 999999 }} className="fixed flex flex-col top-0 w-full">
      <Navbar className="flex items-end text-default-600 main-content-safe">
        <NavbarContent justify="start" />
        <NavbarContent className="flex items-end" justify="center">
          <NavbarItem className="flex gap-1 pb-2">
            {current && (
              <BlurFade className="flex items-center">
                {current.icon && <current.icon className="size-6 text-primary" />}
                <p className="font-bold px-1 text-center tracking-tighter">
                  {pathname === '/user' && !userPageLoading && user
                    ? `${user.firstName}, ${user.age}`
                    : t(current.labelKey)}
                  {pathname === '/user' && user && user.verifiedAccount && (
                    <VerifyIconFill fill="#21b6a8" className="size-5" />
                  )}
                  {pathname === '/user' && user && user.premium && (
                    <PerimumIcon className="size-5" />
                  )}
                </p>
              </BlurFade>
            )}

            {showFilterAndTheme && (
              <div className="flex gap-1">
                <ThemeSwitch />
                <EnergyButton />
              </div>
            )}
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" />
      </Navbar>

      <AnimatePresence>
        {pathname.split('/')['1'] === 'main' && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
            
          >
            <Navbar style={{height:"50px"}} className="px-1 w-full h-auto flex items-center justify-center">
              <NavbarContent className="w-full" justify="center">
                <NavbarItem className="w-full">
                  <NavBar />
                </NavbarItem>
              </NavbarContent>
            </Navbar>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(TopBar);
