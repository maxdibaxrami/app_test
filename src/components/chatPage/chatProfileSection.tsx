import { Navbar, NavbarContent, NavbarItem, Skeleton, Avatar } from "@heroui/react";
import { useRef } from 'react';
import { BASEURL } from "@/constant";
import { useSearchParams } from "react-router-dom";

const ChatProfileSection = ({ loading, profileDataState, userId2, position=true }) => {
  const childRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();

    const handleClickProfile = () => {
      const newParams = new URLSearchParams(searchParams); // clone existing
      newParams.set('user', userId2); // add or update param
      setSearchParams(newParams); // update the URL
    };
  // Accessing online status from Redux state based on userId2

  const handleClick = () => {
    handleClickProfile()
    if (childRef.current) {
      /* @ts-ignore */
      childRef.current.callChildFunction(); // Call the function in the child
    }
  };

  

  if (loading) {
    return (
      <Navbar 
       style={position? {width:"100%"} : {width:"fit-content"}}

        className={position ? "fixed flex items-end top-0 main-content-safe" : "flex absolute top-[120px] left-1/2 h-[3rem] -translate-x-1/2 items-end main-content-safe"}
        >
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
        style={position? { width:"100%" } : { width:"fit-content" }}
        className={position ? "fixed flex items-end top-0 main-content-safe" : "flex top-[120px] h-[3rem] left-1/2 -translate-x-1/2 absolute rounded-2xl items-center"}
        classNames={{ wrapper: "px-4" }}
      >
        <NavbarContent justify="start">
          <NavbarItem className="lg:flex"></NavbarItem>
        </NavbarContent>
        <NavbarContent className="flex items-end" justify="center">
          <div className="lg:flex mb-1 flex items-center" onClick={handleClick}>
            <div className="relative">
              <Avatar
                className="mx-1"
                color={"primary"}
                radius="lg"
                size="md"
                src={`${BASEURL}${profileDataState.photos && profileDataState.photos[0].small}`}
              />

            </div>
            <div className="flex items-center flex-col mx-1 text-start">
              <span className="text-l text-foreground font-bold">{profileDataState.firstName}</span>
            </div>
          </div>
        </NavbarContent>
        <NavbarContent justify="end"></NavbarContent>
      </Navbar>
    </>
  );
};

export default ChatProfileSection;
