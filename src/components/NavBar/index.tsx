import { Tabs, Tab, Badge } from "@heroui/react";
import { FireIcon, ChatIcon, ProfileIcon, LikeIcon, LocationIcon, RandomChatIcon } from '@/Icons/index';
import { useSearchParams } from "react-router-dom";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const BottomMenu = () => {
  const [searchParams] = useSearchParams();
  
  const { data } = useSelector((state: RootState) => state.like);  // Assuming the like slice is in state.like

  return (
        <div
          className="flex w-full"
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
            
            onChange={()=>{
              if (hapticFeedback.impactOccurred.isAvailable()) {
                hapticFeedback.impactOccurred('medium');
              }
            }}
            classNames={{
              tab: "h-auto p-1 m-1 color-white",
              tabList: "bg-transparent gap-2 flex justify-center	",
              tabContent: "group-data-[selected=true]:text-[#FFF]",
              base:"flex items-center justify-center"
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
                
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <Badge size="sm" showOutline={false} color="danger" variant="shadow" content={data.length} isInvisible={data && data.length === 0} shape="circle">
                      <LikeIcon className="size-6" />
                    </Badge>
                  </div>
                </div>
              }
            />

            <Tab
              key="explore"
              href="/#/main?page=explore"
              title={
                <div className="flex  gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <LocationIcon className="size-6" />
                  </div>
                </div>
              }
            />

            

            <Tab
              key="nearby"
              href="/#/main?page=nearby"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <FireIcon className="size-6 fire-icon" />
                  </div>
                </div>
              }
            />

            <Tab
              key="chat"
              href="/#/main?page=chat"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <ChatIcon className="size-6" />
                  </div>
                </div>
              }
            />

            <Tab
              key="RandomChat"
              href="/#/main?page=RandomChat"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <RandomChatIcon className="size-6" />
                  </div>
                </div>
              }
            />

            <Tab
              key="profile"
              href="/#/main?page=profile"
              title={
                <div className="flex gap-1 justify-center items-center">
                  <div className="rounded-full flex items-center justify-center">
                    <ProfileIcon className="size-6" />
                  </div>
                </div>
              }
            />


          </Tabs>
        </div>
  );
};

export default BottomMenu;
