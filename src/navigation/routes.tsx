import { lazy } from 'react';
import type { ComponentType, JSX } from 'react';
// Helper: Accepts an importer returning a record of components and a key.
// Returns a lazy-loaded component that wraps the chosen component.
function lazyGroup<T extends Record<string, ComponentType<any>>>(
  importer: () => Promise<T>,
  key: keyof T
): ComponentType<any> {
  return lazy(() =>
    importer().then(module => ({
      default: module[key],
    }))
  );
}

// Grouping profile-related pages into one bundle.
const importProfileGroup = () =>
  Promise.all([
    import('@/pages/editprofile/page'),
    import('@/pages/userPage/index'),
    import('@/pages/profileView'),
    import('@/pages/addFirends/page'),
    import('@/pages/favoritePage'),
    import('@/pages/verifyAccont'),
    import('@/pages/editProfileFild'),
  ]).then(
    ([
      EditProfile,
      UserProfile,
      ProfileView,
      AddFriends,
      FavoriteView,
      VerifyAccount,
      EditProfileField,
    ]) => ({
      EditProfile: EditProfile.default,
      UserProfile: UserProfile.default,
      ProfileView: ProfileView.default,
      AddFriends: AddFriends.default,
      FavoriteView: FavoriteView.default,
      VerifyAccount: VerifyAccount.default,
      EditProfileField: EditProfileField.default,
    })
  );

// Grouping premium-related pages into one bundle.
const importPremiumGroup = () =>
  Promise.all([
    import('@/pages/premium'),
    import('@/pages/energy'),
  ]).then(([PremiumPage, EnergyPage]) => ({
    PremiumPage: PremiumPage.default,
    EnergyPage: EnergyPage.default,
  }));

// Lazy load components that are not grouped
const MainPage = lazy(() => import('@/pages/main/index'));
const SignupPage = lazy(() => import('@/pages/signup/page'));
const Setting = lazy(() => import('@/pages/setting/page'));
const ChatPage = lazy(() => import('@/pages/chat/page'));
import  EditProfileStepper from '@/pages/editProfileStepper/index';

// Lazy load grouped components by extracting a specific key.
const ProfileEdit = lazyGroup(importProfileGroup, 'EditProfile');
const UserProfile = lazyGroup(importProfileGroup, 'UserProfile');
const ProfileView = lazyGroup(importProfileGroup, 'ProfileView');
const AddFriends = lazyGroup(importProfileGroup, 'AddFriends');
const FavoriteView = lazyGroup(importProfileGroup, 'FavoriteView');
const VerifyAccount = lazyGroup(importProfileGroup, 'VerifyAccount');
const EditProfileField = lazyGroup(importProfileGroup, 'EditProfileField');

const PremiumPageComponent = lazyGroup(importPremiumGroup, 'PremiumPage');
const EnergyPageComponent = lazyGroup(importPremiumGroup, 'EnergyPage');

interface Route {
  path: string;
  Component: ComponentType<any>;
  title?: string;
  icon?: JSX.Element;
  auth: boolean;
}

export const routes: Route[] = [
  { path: '/main', Component: MainPage, title: 'Main Page', auth: true },
  { path: '/profile-edit', Component: ProfileEdit, title: 'Edit Profile', auth: true },
  { path: '/premium-page', Component: PremiumPageComponent, title: 'Premium Page', auth: true },
  { path: '/user', Component: UserProfile, title: 'User Page', auth: true },
  { path: '/setting', Component: Setting, title: 'Setting Page', auth: true },
  { path: '/chat-detail', Component: ChatPage, title: 'Chat Page', auth: true },
  { path: '/sign-up', Component: SignupPage, title: 'Signup', auth: false },
  { path: '/add-friends', Component: AddFriends, title: 'Add Friends', auth: true },
  { path: '/profile-view', Component: ProfileView, title: 'Profile View', auth: true },
  { path: '/gift-view', Component: FavoriteView, title: 'Gift View', auth: true },
  { path: '/favorite-view', Component: FavoriteView, title: 'Favorite View', auth: true },
  { path: '/verify-account', Component: VerifyAccount, title: 'Verify Account', auth: true },
  { path: '/energy', Component: EnergyPageComponent, title: 'Energy', auth: true },
  { path: '/edit-profile-field', Component: EditProfileField, title: 'Edit Profile Field', auth: true },
  { path: '/edit-profile-stepper', Component: EditProfileStepper, title: 'Edit Profile stepper', auth: true },

];
