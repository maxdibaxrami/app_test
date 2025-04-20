import { Page } from "@/components/Page"
import animationData from "@/components/animate/blockUser.json";
import Lottie from "lottie-react";
import { useTranslation } from "react-i18next";

const BlockedUser = () => {
    const { t } = useTranslation();  // Initialize translation hook
    
    return <Page>
    <div className="h-screen w-screen flex flex-col p-6 items-center justify-center"> 
      <Lottie animationData={animationData} loop={false} autoplay={true} />
      <div className="flex gap-4 flex-col px-6 text-center items-center">
        <p className="text-base text-center font-semibold">{t("block_user_title")} 🚫</p>
        <p className="text-xs text-center">{t("block_user_text")}</p>
      </div>
  </div>
</Page>
}

export default BlockedUser