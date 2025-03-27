import {Switch, cn} from "@heroui/react";
import { useTranslation } from "react-i18next";

export default function SelectTelegramImageComponent({isTelegramImageSelected, setIsTelegramImageSelected, enable}) {
      const { t } = useTranslation();
    
      return (
    <Switch
      classNames={{
        base: cn(
          "inline-flex flex-row-reverse w-full mb-2 max-w-md bg-content1 hover:bg-content2 items-center",
          "justify-between cursor-pointer rounded-lg py-4 gap-2 p-2 border-1 border-transparent",
          "data-[selected=true]:border-primary",
        ),
        wrapper: "p-0 h-4 py-3 overflow-visible",
        thumb: cn(
          "w-6 h-6 border-1 shadow-lg",
          "group-data-[hover=true]:border-primary",
          //selected
          "group-data-[selected=true]:ms-6",
          // pressed
          "group-data-[pressed=true]:w-7",
          "group-data-[selected]:group-data-[pressed]:ms-4",
        ),
      }}
      isDisabled={!enable}
      isSelected={isTelegramImageSelected} 
      onValueChange={setIsTelegramImageSelected}
      
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{t("use_telegram_profile")}</p>
      </div>
    </Switch>
  );
}
