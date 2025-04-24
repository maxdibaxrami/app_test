import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  ModalBody,
  forwardRef,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";

import { useTranslation } from "react-i18next";
import { useImperativeHandle, useState } from "react";
import LookingforList from "@/components/core/WhyIamHereAuthList";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { updateUserData } from "@/features/userSlice";


const EditProfile = forwardRef((props:any, ref)=> {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  // States to track editable fields
  const [whyIamHere, setWhyIamHere] = useState(props.user.profileData.lookingFor || ""); 



  const HandlelookingForList = (_,b) => {
    setWhyIamHere(b)
  }



  // Update ref handlers for opening and closing modal
  useImperativeHandle(ref, () => ({
    openModal: onOpen,
    closeModal: onClose
  }));


  // Dynamically create the payload with only modified fields
  const handleSaveData = async () => {
    const updatedData: any = {};

    if (whyIamHere !== props.user.lookingFor) {
      updatedData.lookingFor = whyIamHere;
    }

    if (Object.keys(updatedData).length > 0) {
      // Dispatch the update action only if there are changes
      await dispatch(updateUserData({ updatedData }));
    }

    onClose(); // Close the modal after saving
  };


  return (
    <>
      <Modal hideCloseButton placement={"bottom"} classNames={{"base":"px-0 backdrop-saturate-150 backdrop-blur bg-background/90"}} backdrop="opaque" isOpen={isOpen} size={"2xl"} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex font-bold flex-col gap-1">

            <div className="flex items-center gap-2">

              {props.selectedItem==="WhyIamhere" && <p className="text-md">🤔</p>}
              
              {props.selectedItem==="WhyIamhere" && t("WhyIamhere")}
              
            </div>

          </ModalHeader>
          <ModalBody className={`${props.selectedItem==="WhyIamhere" || props.selectedItem==="Education"? "px-0":""}`}>
            <ScrollShadow size={100} hideScrollBar className={props.selectedItem === "height" ? "h-[100px]": "h-[350px]"}>
              <form className="flex flex-col">

                {props.selectedItem==="WhyIamhere" && <LookingforList user={props.user.profileData} setSlideAvailable={HandlelookingForList} setSlideUnAvailable={HandlelookingForList}/>}
              </form>
            </ScrollShadow>

          </ModalBody>

          <ModalFooter className="pb-6">
            <Button color="default" variant="solid" onPress={onClose}>
              {t("Close")}
            </Button>
            <Button isLoading={props.loading} color="success" onPress={handleSaveData}>
              {t("Save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

EditProfile.displayName = "EditProfile";

export default EditProfile;
