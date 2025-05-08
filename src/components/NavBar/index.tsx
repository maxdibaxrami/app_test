import { Tabs, Tab, Badge } from "@heroui/react";
import { FireIcon, ChatIcon, ProfileIcon, LikeIcon, LocationIcon } from '@/Icons/index';
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const BottomMenu = () => {
    const { pathname } = useLocation();
    const { t } = useTranslation();
  
    useEffect(()=>{console.log(pathname.split('/')[2])},[pathname])
  const { data } = useSelector((state: RootState) => state.like);  // Assuming the like slice is in state.like

  return (
        <div
          className="flex w-full pb-1"
          style={{
            zIndex: "50",
            width: "100%",
            overflow: "hidden",
            justifyContent: "center",
            alignItems:"center"
          }}
        >
          <Tabs
            aria-label="Options"
            classNames={{
              tab: "h-auto p-1 m-1 color-white",
              tabList: "bg-transparent gap-2 flex justify-center	",
              tabContent: "group-data-[selected=true]:text-[#FFF]",
              base:"flex items-center justify-center",
              cursor:"aspect-square"
            }}
            color="primary"
            size="lg"
            selectedKey={pathname.split('/')[2]}
            style={{
              zIndex: "10",
              overflow: "hidden",
              width: "100%"
            }}
            variant="solid"
            radius="lg"
            fullWidth
          >

          <Tab
              key="likes"
              href="/#/main/likes"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex-col flex items-center justify-center">
                    <Badge className="flex flex-col" size="sm" showOutline={false} color="danger" variant="shadow" content={data && data.length} isInvisible={data && data.length === 0} shape="circle">
                      <div className="flex flex-col justify-center items-center">
                        <LikeIcon className="size-6" />
                        <p className="text-xs">{t('Likes')}</p>
                        </div>
                    </Badge>
                  </div>
                </div>
              }
            />

            <Tab
              key="explore"
              href="/#/main/explore"
              title={
                <div className="flex  gap-1 justify-center items-center">
                  <div className="rounded-full flex-col flex items-center justify-center">
                    <LocationIcon className="size-6" />
                    <p className="text-xs">{t('Explore')}</p>

                  </div>
                </div>
              }
            />

            

            <Tab
              key="nearby"
              href="/#/main/nearby"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex-col flex items-center justify-center">
                  <FireIcon className="size-6" />
                    <p className="text-xs">{t('Nearby')}</p>

                  </div>
                </div>
              }
            />

            <Tab
              key="chat"
              href="/#/main/chat"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex-col flex items-center justify-center">
                    <ChatIcon className="size-6" />
                    <p className="text-xs">{t('Chat')}</p>

                  </div>
                </div>
              }
            />

            <Tab
              key="profile"
              href="/#/main/profile"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex-col flex items-center justify-center">
                    <ProfileIcon className="size-6" />
                    <p className="text-xs">{t('Profile')}</p>

                  </div>
                </div>
              }
            />


          </Tabs>
        </div>
  );
};

export default BottomMenu;
