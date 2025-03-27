import { useTranslation } from "react-i18next";
import ImageUploader from "../image/imageUploader";
import SelectTelegramImageComponent from "../image/TelegramPhotoComponent";
import { Image } from "@heroui/react";

const ImageDataAuth = ({
  user,
  showError,
  setSlideAvailable,
  isSelectTelegramImage,
  setIsSelectTelegramImage,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between flex-col px-6 pb-4">


      <SelectTelegramImageComponent
        enable={!!user.telegramImage}
        isTelegramImageSelected={isSelectTelegramImage}
        setIsTelegramImageSelected={setIsSelectTelegramImage}
      />
      <form className="flex mt-2 justify-center w-full h-m-[250px] mb-2 gap-4">
        {isSelectTelegramImage ? (
          <div style={{ maxWidth: "60%" }} className="w-full h-full">
            <Image
              src={user.telegramImage}
              style={{ aspectRatio: "3/4", objectFit: "cover" }}
              shadow="sm"
              className="w-full h-full flex flex-col items-center bg-content1"
              
            />
          </div>
        ) : (
          <ImageUploader
            user={user}
            showError={showError}
            setSlideAvailable={setSlideAvailable}
            id="1"
            text={t("firstPhotoTitle")}
          />
        )}
      </form>


    </div>
  );
};

export default ImageDataAuth;
