
import {
  Switch,
  cn,
} from "@heroui/react";

import TopBarPages from "@/components/tobBar/index";
import { Page } from "@/components/Page";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";  // Importing useTranslation hook
import LanguageSection from "@/components/setting/LanguageSection";
import FaqModal from "@/components/setting/faqModal";

export default function Setting() {
  const { t } = useTranslation();  // Initialize translation hook
  const { theme, setTheme } = useTheme();
  const lp = useLaunchParams();

  const onChange = () => {
    if(theme === "light"){
      setTheme("dark")
    }else{
      setTheme("light")
    }
  };

  const getPaddingForPlatform = () => {
    if (['ios'].includes(lp.platform)) {
      return '50px'; // iOS/macOS specific padding
    } else {
      return '25px'; // Android/base padding
    }
  };

  return (
    <Page>
      <div className="container mx-auto max-w-7xl flex-grow light-background--color">
        <section className="flex flex-col items-center justify-center gap-4 text-default-600">
          <TopBarPages />
          <div style={{paddingTop:`calc(5rem + ${getPaddingForPlatform()})`,paddingLeft:"18px",paddingRight:"18px"}} className="w-full h-full pb-4">            
            <Switch
              onChange={onChange}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-md items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 py-4 border-0.5 border-transparent",
                  "data-[selected=true]:border-primary",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn(
                  "w-6 h-6 border-0.5 shadow-lg",
                  "group-data-[hover=true]:border-primary",
                  "group-data-[selected=true]:ml-6",
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ml-4",
                ),
              }}
              isSelected={theme === "light" ? true : false}
            >
              <div className="flex flex-col gap-1">
                <p className="text-medium capitalize font-bold">{t('mode')}</p>
                <p className="text-tiny text-default-400">{t('mode_desc')}</p>
              </div>
            </Switch>
           

            <div className="w-full h-full px-2 pb-4">
              <FaqModal/>
            </div>        
           <LanguageSection/>
            </div>

        </section>
      </div>
    </Page>
  );
}
