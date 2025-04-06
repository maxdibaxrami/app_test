import { Navbar, NavbarContent, NavbarItem, Skeleton, Avatar } from "@heroui/react";
import { useRef } from 'react';
import { useTranslation } from "react-i18next";
import { BASEURL } from "@/constant";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/store";

const ChatProfileSection = ({ loading, profileDataState, userId2 }) => {
  const childRef = useRef();
  const { t } = useTranslation();
  const lp = useLaunchParams();

  // Accessing online status from Redux state based on userId2
  const isUserOnline = useSelector((state : RootState) => state.status.onlineUsers.some(user => user.userId === userId2));

  const handleClick = () => {
    if (childRef.current) {
      /* @ts-ignore */
      childRef.current.callChildFunction(); // Call the function in the child
    }
  };

  const getPaddingForPlatform = () => {
    return ['ios'].includes(lp.platform) ? '50px' : '25px';
  };
  

  if (loading) {
    return (
      <Navbar className="fixed flex items-end top-0 main-content-safe" style={{ paddingTop: getPaddingForPlatform() }}>
        <NavbarContent justify="start">
          <NavbarItem className="lg:flex"></NavbarItem>
        </NavbarContent>
        <NavbarContent justify="center">
          <div className="max-w-[300px] w-full flex items-center gap-3">
            <Skeleton className="flex rounded-full w-12 h-12" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24 rounded-lg" />
              <Skeleton className="h-3 w-14 rounded-lg" />
            </div>
          </div>
        </NavbarContent>
        <NavbarContent justify="end"></NavbarContent>
      </Navbar>
    );
  }

  return (
    <>
      <Navbar
        disableAnimation
        className="fixed flex items-end top-0 main-content-safe"
        classNames={{ wrapper: "px-4" }}
      >
        <NavbarContent justify="start">
          <NavbarItem className="lg:flex"></NavbarItem>
        </NavbarContent>
        <NavbarContent className="flex items-end" justify="center">
          <Link to={`/user?userId=${userId2}`} className="lg:flex flex items-center" onClick={handleClick}>
            <div className="relative pb-2">
              <Avatar
                className="mx-1"
                color={isUserOnline ? "success" : "primary"}
                radius="lg"
                size="md"
                src={`${BASEURL}${profileDataState.photos && profileDataState.photos[0].small}`}
              />

            </div>
            <div className="flex flex-col mx-1 text-start">
              <span className="text-l text-foreground font-bold">{profileDataState.firstName}</span>
              {isUserOnline ? (
                <span className="text-small bold" style={{ color: "#22c55e" }}>
                  {t("Online")}
                </span>
              ) : (
                <span className="text-small bold text-foreground">
                  {t("Offline")}
                </span>
              )}
            </div>
          </Link>
        </NavbarContent>
        <NavbarContent justify="end"></NavbarContent>
      </Navbar>
    </>
  );
};

export default ChatProfileSection;
