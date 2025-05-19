import { PerimumIcon } from "@/Icons";
import {Popover, PopoverTrigger, PopoverContent, Button, Link} from "@heroui/react";
import { useTranslation } from "react-i18next";

export const PopOverPerimum = (props) => {
    const { t } = useTranslation();  // Initialize translation hook
    
  return (
    <Popover className="before:bg-background/90" {...props} showArrow placement="top">
      <PopoverTrigger>
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="w-[240px] rounded-lg backdrop-blur bg-background/90 backdrop-saturate-150 ring-1 ring-black ring-opacity-5">
        <div
          style={{zIndex:"999"}}
          className={` w-full rounded-lg pointer-events-auto flex`}
        >
          <div className="flex-1 w-0 py-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-4 px-0.5">
                    
                  <Button size="lg" radius="full" isIconOnly aria-label="Like" color="default">
                    <PerimumIcon className="size-7"/>
                  </Button>
              </div>
              <div className="px-1 flex-1  mt-2">
                <p className="text-sm text-center font-bold text-foreground-900">
                    {t("Reachedlimit")}
                    {t("Youhavereachedyourdailylikelimitof50")}
                </p>
                <p className="text-center mt-2 text-sm font-tiny text-foreground/70">
                  <Link className="text-center" size="sm" color="warning" href={"/#/premium"} underline="none">
                    {t("Tounlockallfeatures,youneedapremiumaccount.")}
                  </Link>
                </p>

                <p className="text-center mt-2">
                  <Link className="text-center" size="sm" color="success" href={"/#/add-friends"} underline="none">
                    {t("Inviteyourfriendsandgetapremiumaccount")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
  
        </div>
      </PopoverContent>
    </Popover>
  );
}

