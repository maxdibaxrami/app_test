import { Tabs, Tab, Badge } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FireIcon, ChatIcon, ProfileIcon, LikeIcon, LocationIcon } from '@/Icons/index';
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { hapticFeedback, useLaunchParams } from "@telegram-apps/sdk-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const BottomMenu = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const lp = useLaunchParams();
  
  const { data } = useSelector((state: RootState) => state.like);  // Assuming the like slice is in state.like

  const getPaddingForPlatform = () => {
    if (['ios'].includes(lp.platform)) {
      return '25px';
    } else {
      return '25px';
    }
  };

  return (
    <AnimatePresence>
      {searchParams.get('page') !== "nearby" && (
        <motion.div
          transition={{
            duration: 0.3,
          }}
          initial={{ bottom: "-120px" }}
          animate={{ bottom: "0px" }}
          exit={{ bottom: "-120px" }}
          className="flex w-full px-2 fixed items-center backdrop-blur bg-background/70 backdrop-saturate-150 border-foreground/20 shadow-small"
          style={{
            zIndex: "50",
            width: "100%",
            overflow: "hidden",
            bottom: "-120px",
            justifyContent: "center",
            paddingBottom: `${getPaddingForPlatform()}`
          }}
        >
          <Tabs
            aria-label="Options"
            fullWidth
            onChange={()=>{
              if (hapticFeedback.impactOccurred.isAvailable()) {
                hapticFeedback.impactOccurred('medium');
              }
            }}
            classNames={{
              tab: "h-auto p-1 m-1 color-white w-14 h-14",
              tabList: "bg-transparent gap-2 flex justify-center	",
              tabContent: "group-data-[selected=true]:text-[#FFF]",
              cursor:"aspect-square"
            }}
            color="primary"
            size="sm"
            selectedKey={searchParams.get("page")}
            style={{
              zIndex: "10",
              overflow: "hidden",
              width: "100%"
            }}
            variant="solid"
            radius="lg"
          >

          <Tab
              key="likes"
              href="/#/main?page=likes"
              title={
                
                <div className="flex flex-col gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <Badge size="sm" showOutline={false} color="danger" variant="shadow" content={data.length} isInvisible={data && data.length === 0} shape="circle">
                      <LikeIcon className="size-6" />
                    </Badge>
                  </div>
                  <p style={{ fontSize: "11px" }}>{t('Likes')}</p>
                </div>
              }
            />

            <Tab
              key="explore"
              href="/#/main?page=explore"
              title={
                <div className="flex flex-col gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <LocationIcon className="size-6" />
                  </div>
                  <p style={{ fontSize: "11px" }}>{t('Explore')}</p>

                </div>
              }
            />

            

            <Tab
              key="nearby"
              href="/#/main?page=nearby"
              title={
                <div className="flex flex-col gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <FireIcon className="size-6 fire-icon" />
                  </div>
                  <p style={{ fontSize: "11px" }}>{t('Nearby')}</p>
                </div>
              }
            />

            <Tab
              key="chat"
              href="/#/main?page=chat"
              title={
                <div className="flex flex-col gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <ChatIcon className="size-6" />
                  </div>
                  <p style={{ fontSize: "11px" }}>{t('Chat')}</p>
                </div>
              }
            />

           

            <Tab
              key="profile"
              href="/#/main?page=profile"
              title={
                <div className="flex flex-col gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <ProfileIcon className="size-6" />
                  </div>
                  <p style={{ fontSize: "11px" }}>{t('Profile')}</p>
                </div>
              }
            />
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomMenu;
