import {
    Modal,
    ModalContent,
    ModalBody,
  } from "@heroui/react";
import Lottie from "lottie-react";
import animationData from "@/components/animate/completeProfileModal.json";
import { useTranslation } from "react-i18next";
import MainButton from "../miniAppButtons/MainButton";

  export default function CompleteProfileAlertModal({isOpen}) {
  const { t } = useTranslation();

    return (
      <>
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          hideCloseButton
        >
          <ModalContent>
            {() => (
              <>
                <ModalBody>
                    <div className="mb-1 mt-1 px-6 pt-2 pb-2 flex flex-col gap-2">
                        <p className="text-base text-center font-semibold">{t("title_profile_complete")} 📝</p>
                        <p className="text-xs text-center">{t("description_profile_complete")}</p>
                    </div>
                    <Lottie animationData={animationData} loop={true} autoplay={true} />

                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        <MainButton
            text={`${t("title_profile_complete")}📝`} 
            backgroundColor="#1FB6A8"
            textColor="#FFFFFF"
            hasShineEffect={true}
            isEnabled={true} 
            isLoaderVisible={false}
            isVisible={true}
            onClick={()=>{
              
            }}
          />

      </>
    );
  }
  