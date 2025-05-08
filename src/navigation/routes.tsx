import { lazy, ComponentType, JSX } from 'react';

/**
 * Helper to lazy-load a specific export from a grouped module.
 */
function lazyGroup<T extends Record<string, ComponentType<any>>>(
  importer: () => Promise<T>,
  key: keyof T
): ComponentType<any> {
  return lazy(() =>
    importer().then((mod) => ({ default: mod[key] }))
  );
}

// Profile-related pages bundled together
const importProfileGroup = () =>
  Promise.all([
    import('@/pages/editprofile/page'),
    import('@/pages/userPage/index'),
    import('@/pages/profileView'),
    import('@/pages/favoritePage/index'),
    import('@/pages/favoritePage'),
    import('@/pages/verifyAccont/index'),
    import('@/pages/editProfileFild/index'),
  ]).then(([
    EditProfile,
    UserPage,
    ProfileView,
    AddFriends,
    FavoritePage,
    VerifyAccount,
    EditProfileField,
  ]) => ({
    EditProfile: EditProfile.default,
    UserPage: UserPage.default,
    ProfileView: ProfileView.default,
    AddFriends: AddFriends.default,
    FavoritePage: FavoritePage.default,
    VerifyAccount: VerifyAccount.default,
    EditProfileField: EditProfileField.default,
  }));

// Premium-related pages bundled together
const importPremiumGroup = () =>
  Promise.all([
    import('@/pages/premium'),
    import('@/pages/energy'),
  ]).then(([Premium, Energy]) => ({
    Premium: Premium.default,
    Energy: Energy.default,
  }));

// Individual lazy-loaded pages
const MainPage = lazy(() => import('@/pages/main/index'));
const SettingPage = lazy(() => import('@/pages/setting/page'));
const ChatPage = lazy(() => import('@/pages/chat/page'));
import EditProfileStepper from '@/pages/editProfileStepper/index';

// Extract individual components from the grouped bundles
const ProfileEdit = lazyGroup(importProfileGroup, 'EditProfile');
const UserPage = lazyGroup(importProfileGroup, 'UserPage');
const ProfileView = lazyGroup(importProfileGroup, 'ProfileView');
const AddFriends = lazyGroup(importProfileGroup, 'AddFriends');
const FavoritePage = lazyGroup(importProfileGroup, 'FavoritePage');
const VerifyAccount = lazyGroup(importProfileGroup, 'VerifyAccount');
const EditProfileField = lazyGroup(importProfileGroup, 'EditProfileField');

const PremiumPage = lazyGroup(importPremiumGroup, 'Premium');
const EnergyPage = lazyGroup(importPremiumGroup, 'Energy');

/**
 * Route configuration.
 * - auth: true routes require authenticated users (profileStage !== 'draft')
 * - auth: false routes are publicly accessible
 */
export interface RouteConfig {
  path: string;
  Component: ComponentType<any>;
  title?: string;
  icon?: JSX.Element;
  auth: boolean;
}

export const routes: RouteConfig[] = [
  { path: '/main',                Component: MainPage,             title: 'Main',           auth: true },
  { path: '/profile-edit',        Component: ProfileEdit,          title: 'Edit Profile',    auth: true },
  { path: '/profile-view',        Component: ProfileView,          title: 'Profile View',    auth: true },
  { path: '/profile/user',        Component: UserPage,             title: 'User',            auth: true },
  { path: '/profile/add-friends', Component: AddFriends,           title: 'Add Friends',     auth: true },
  { path: '/profile/favorites',   Component: FavoritePage,         title: 'Favorites',       auth: true },
  { path: '/profile/verify',      Component: VerifyAccount,        title: 'Verify Account',  auth: true },
  { path: '/profile/field',       Component: EditProfileField,     title: 'Edit Field',      auth: true },
  { path: '/premium',             Component: PremiumPage,          title: 'Premium',         auth: true },
  { path: '/energy',              Component: EnergyPage,           title: 'Energy',          auth: true },
  { path: '/setting',             Component: SettingPage,          title: 'Settings',        auth: true },
  { path: '/chat',                Component: ChatPage,             title: 'Chat',            auth: true },
  { path: '/edit-stepper',        Component: EditProfileStepper,   title: 'Edit Stepper',    auth: true },
];
