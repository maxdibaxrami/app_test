import {
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";

import { useLocation, useSearchParams } from "react-router-dom";

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
  PerimumIcon
} from '@/Icons/index'

import { useTranslation } from 'react-i18next';
import BlurFade from "../animate/BlurFade";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ThemeSwitch from "./switchTheme";
import { EnergyButton } from "./energyButton";


const TopBar = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { userPageData : user , userPageLoading : LoadingUser } = useSelector((state: RootState) => state.user);


  return (
    <>
      <Navbar
        className="top-0 fixed flex items-end text-default-600 main-content-safe z-50"
      >
        <NavbarContent justify="start">
        </NavbarContent>

        <NavbarContent className="flex items-end" justify="center">
          <NavbarItem className="flex gap-1 pb-2">
            {searchParams.get("page") === "profile" && 
              <BlurFade className="flex items-center">
                <ProfileIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('Profile')}
                </p>
              </BlurFade>
            }

            {searchParams.get("page") === "nearby" && 
              <BlurFade className="flex items-center">
                <FireIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('Nearby')}

                </p>
              </BlurFade>
            }

            {searchParams.get("page") === "explore" && 
              <BlurFade className="flex items-center">
                <LocationIcon className="size-6 text-primary"/>
                  <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                    {t('Explore')}
                  </p>
              </BlurFade>
            }

            {searchParams.get("page") === "likes" && 
              <BlurFade className="flex items-center">
                <LikeIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('Likes')}
                </p>
              </BlurFade>
            }

            {searchParams.get("page") === "chat" && 
              <BlurFade className="flex items-center">
                <ChatIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('Chat')}
                </p>
              </BlurFade>
            }

            {location.pathname === "/setting" && 
              <BlurFade className="flex items-center">
                <SettingIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('Setting')}
                </p>
              </BlurFade>
            }

            {location.pathname === "/profile-edit" && 
              <BlurFade className="flex items-center">
                <EditProfileIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('EditProfile')}
                </p>
              </BlurFade>
            }

          {location.pathname === "/edit-profile-feild" && 
              <BlurFade className="flex items-center">
                <EditProfileIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('EditProfile')}
                </p>
              </BlurFade>
            }

          {location.pathname === "/favorite-view" && 
              <BlurFade className="flex items-center">
                <FavoriteColor className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('favorite')}
                </p>
              </BlurFade>
            }

            {location.pathname === "/profile-view" && 
              <BlurFade className="flex items-center">
                <ViewIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('who_viewed_profile')}
                </p>
              </BlurFade>
            }

            {location.pathname === "/add-firends" && 
              <BlurFade className="flex items-center">
                <AddFirendsIcon className="size-6 text-primary"/>
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {t('invite_your_friend')}
                </p>
              </BlurFade>
            }

          {location.pathname === "/user" && LoadingUser === false &&
              <BlurFade className="flex items-center">
                <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                  {user.firstName},
                  {user.age}
                  {user.verifiedAccount &&  <VerifyIconFill fill={"#21b6a8"} className="size-5"/>  }        
                  {user.premium && <PerimumIcon className="size-5"/>}
                </p>
              </BlurFade>
            }

            {location.pathname === "/gift-view" &&
              <BlurFade className="flex items-center">
                 <GiftIcon className="size-6 text-primary"/>
                  <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                    {t('gift_List')}
                  </p>
              </BlurFade>
            }

            {location.pathname === "/verify-account" &&
              <BlurFade className="flex items-center">
                 <VerifyIconFill className="size-6 text-primary"/>
                  <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                    {t('Verification')}
                  </p>
              </BlurFade>
            }

            {location.pathname === "/energy" &&
              <BlurFade className="flex items-center">
                 <FlashIcon className="size-6 text-primary"/>
                  <p className="font-bold px-1 mx-1 text-inherit text-center font-bold tracking-tighter md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
                    {t('energy')}
                  </p>
              </BlurFade>
            }

            <div className="flex gap-1">
              <ThemeSwitch/>
              <EnergyButton/>
            </div>

          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default TopBar;
