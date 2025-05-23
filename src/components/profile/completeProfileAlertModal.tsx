import {
    Modal,
    ModalContent,
    ModalBody,
  } from "@heroui/react";
import Lottie from "lottie-react";
import animationData from "@/components/animate/completeProfileModal.json";
import { useTranslation } from "react-i18next";
import MainButton from "../miniAppButtons/MainButton";
import SecondaryButton from "../miniAppButtons/secondaryButton";
import { useNavigate } from 'react-router-dom';

  export default function CompleteProfileAlertModal({isOpen}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

    return (
      <>
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          hideCloseButton
          classNames={{
            "base":"bg-content1/70"
          }}
          size="sm"

          motionProps={{
            variants: {
              enter: {
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
              exit: {
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: "easeIn",
                },
              },
            },
          }}

        >
          <ModalContent>
            {() => (
              <>
                <ModalBody>
                    <div className="mt-1 px-6 pt-2 flex flex-col gap-2">
                        <p className="text-base text-center font-semibold">{t("title_profile_complete")} 📝</p>
                        <p className="text-xs text-center">{t("description_profile_complete")}</p>
                    </div>
                    <Lottie animationData={animationData} loop={true} autoplay={true} />

                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
        {isOpen && 
        <>
        
        <MainButton
                text={`${t("title_profile_complete")}📝`} 
                backgroundColor="#1FB6A8"
                textColor="#FFFFFF"
                hasShineEffect={true}
                isEnabled={true} 
                isLoaderVisible={false}
                isVisible={true}
                onClick={()=>{
                  navigate('/edit-profile-stepper')
                }}
              />
              
        <SecondaryButton
            text={t('previous')}
            backgroundColor="#000000"
            textColor="#FFFFFF"
            hasShineEffect={false}
            isEnabled={true} 
            isLoaderVisible={false}
            isVisible={true}
            position="bottom"
            onClick={()=>{
                navigate(-1);
            }}
          />
        </>
            
        
        }


      </>
    );
  }
  