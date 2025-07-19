import { addToast, Button, cn, Image } from "@heroui/react";
import { Listbox, ListboxItem, ListboxSection, Chip } from "@heroui/react";
import {
  HashtagIcon,
  ArrowRight,
  PlusIconRound,
} from "@/Icons/index";

import TopBarPages from "@/components/tobBar/index";
import EditProfile from "@/components/profile/editProfile";
import EditIntersting from "@/components/profile/editIntersting";
import { Page } from '@/components/Page.tsx';
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  BASEURL,
  getDrinkStatus,
  gethobbies,
  getKidStatus,
  getlanguages,
  getlookingfor,
  getPetStatus,
  getRealationStatus,
  getSexualityStatus,
  getSmokingStatus,
} from "@/constant";
import { useEffect, useRef, useState } from "react";
import EditMoreAboutMeModal from "@/components/profile/editMoreAboutMe";
import { updateUserPhoto, uploadProfileImage } from "@/features/userSlice";
import { motion } from "framer-motion";
import { ProfileBackgroundSvg } from "@/Icons/profileBackgroundSVG";
import ImageCropModal from "@/components/image/imageCropperModal";

export default function EditProfilePage() {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const lp = useLaunchParams();

  const [selectedItem, setSelectedItem] = useState("");
  const [selectedProfileData, setSelectedProfileData] = useState("");
  // State for image cropping
  const [imageToCrop, setImageToCrop] = useState(null);
  // Holds extra data to know which upload action to perform after cropping
  const [selectedUploadData, setSelectedUploadData] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input
  const childRef = useRef();
  const profileDataModal = useRef();

  const lookingfor = getlookingfor(t);
  const RealationStatus = getRealationStatus(t);
  const languages = getlanguages(t);
  const SexualityStatus = getSexualityStatus(t);
  const hobbies = gethobbies(t);
  const PetStatus = getPetStatus(t);
  const DrinkStatus = getDrinkStatus(t);
  const SmokingStatus = getSmokingStatus(t);
  const KidStatus = getKidStatus(t);

  const { data: user, updateUserData, uploadProfileLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(()=>{
    console.log(error)
    if(error !== null){
      if(error == 'Failed to update photo' || error == 'Failed to upload profile image'){
        addToast({
          title: t("upload_Photo"),
          description: t("face_detect_error"),
          color: "danger",
        })
      }
    }
  },[error])

  const getPaddingForPlatform = () => {
    if (["ios"].includes(lp.platform)) {
      // iOS/macOS specific padding (e.g., accounting for notches)
      return "50px"; // Adjust as needed for iOS notch
    } else {
      // Android/base padding
      return "25px"; // Default padding
    }
  };

  // File input helper that accepts a callback when a file is chosen.
  const handleFileSelect = (callback: (file: File) => void) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          callback(file);
        }
      };
      fileInputRef.current.click();
    }
  };

  // Resize image using a canvas before cropping.
  const resizeImage = (file: File, maxDimension = 1080): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxDimension) {
            height = height * (maxDimension / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = width * (maxDimension / height);
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Use JPEG format with quality reduction
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        } else {
          reject("Canvas context not available");
        }
      };

      img.onerror = (err) => reject(err);
    });
  };

  // When a file is selected for an existing photo update.
  const handleUpdatePhoto = (photoId: any) => {
    handleFileSelect((photoFile) => {
      resizeImage(photoFile)
        .then((resizedImage) => {
          // Open crop modal with resized image; store type and photo id.
          setImageToCrop(resizedImage);
          setSelectedUploadData({ type: "update", photoId });
        })
        .catch((err) => {
          console.error(err);
          alert("Error processing image. Please try again.");
        });
    });
  };

  // When a file is selected for adding a new photo.
  const handleUploadPhoto = (order: number) => {
    handleFileSelect((photoFile) => {
      resizeImage(photoFile)
        .then((resizedImage) => {
          // Open crop modal with resized image; store type and order.
          setImageToCrop(resizedImage);
          setSelectedUploadData({ type: "upload", order });
        })
        .catch((err) => {
          console.error(err);
          alert("Error processing image. Please try again.");
        });
    });
  };

  // Once cropping is done, convert the cropped image data URL to a blob
  // and dispatch the proper Redux action.
  const handleCroppedImage = async (croppedImage: string) => {
    if (!selectedUploadData) return;
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      if (selectedUploadData.type === "update") {
        dispatch(
          updateUserPhoto({ userId: selectedUploadData.photoId, photoFile: blob })
        );
      } else if (selectedUploadData.type === "upload") {
        dispatch(
          uploadProfileImage({
            userId: user.id.toString(),
            imageFile: blob,
            order: selectedUploadData.order,
          })
        );
      }
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      alert("Upload failed. Please try again.");
    } finally {
      // Clear cropping state
      setImageToCrop(null);
      setSelectedUploadData(null);
    }
  };

  const handleClick = (item) => {
    setSelectedItem(item);
    if (childRef.current) {
      /* @ts-ignore */
      childRef.current.openModal(); // Call the function in the child
    }
  };

  const handleClickProfileData = (item) => {
    setSelectedProfileData(item);
    if (profileDataModal.current) {
      /* @ts-ignore */
      profileDataModal.current.openModal(); // Call the function in the child
    }
  };

  return (
    <Page>
      <div className="container mx-auto max-w-7xl flex-grow">
        <TopBarPages />
        <section
          className="flex flex-col items-center justify-center gap-1"
          style={{ paddingTop: `calc(5rem + ${getPaddingForPlatform()})` }}
        >
          <motion.div
            transition={{ delay: 2, duration: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute h-full dark:opacity-70 top-[10px] inset-0 flex items-center z-[-10]"
          >
            <ProfileBackgroundSvg height={800} width={1200} />
          </motion.div>
          <div
            style={{ paddingLeft: "18px", paddingRight: "18px" }}
            className="flex mb-4 w-full justify-between items-center"
          >
            {/* Hidden file input */}
            <input
              accept="image/*, .heic"
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            <div className="grid w-full grid-cols-3 grid-rows-3 gap-4">
              {user.photos
                .slice()
                .sort((ph1, ph2) => ph1.order - ph2.order)
                .map((photo, index) => {
                  if(index >= 6 ) {return}
                  return (
                    <div
                      key={photo.id}
                      className={imageClasses[index]}
                      onClick={() => handleUpdatePhoto(photo.id)} // Open crop modal for updating
                    >
                      <Image
                        src={`${BASEURL}${photo.largeUrl}`}
                        alt={`Image ${index}`}
                        classNames={{
                          img: "aspect-square",
                          wrapper: "aspect-square",
                        }}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  );
                })}
              {[...Array(user.photos.length < 6 ? 6 - user.photos.length : 0 )].map((_, index) => {
                return (
                  <div
                    key={user.photos.length + index}
                    className={imageClasses[user.photos.length + index]}
                  >
                    <Button
                      isLoading={uploadProfileLoading}
                      onPress={() =>
                        handleUploadPhoto(user.photos.length + index)
                      }
                      className="aspect-square bg-neutral/10 rounded-lg object-cover w-full h-full"
                      isIconOnly
                      aria-label="Add photo"
                      color="default"
                    >
                      <PlusIconRound className="size-8" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full mb-4">
            <div className="text-default-600 w-full bg-neutral/10 border-small px-3 py-2 rounded-small border-default-200 dark:border-default-100">
              <Listbox aria-label="Listbox menu with sections" variant="solid">
                <ListboxSection
                  classNames={{ heading: "font-bold" }}
                  showDivider
                  className="relative"
                  title={t("profile")}
                >
                  <ListboxItem
                    key="1"
                    href={'/#/edit-profile-field?page=input'}
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">📝</p>
                      </IconWrapper>
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <p className="font-semibold">{t("EditProfile")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="3213123"
                    href={'/#/edit-profile-field?page=work'}
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">💼</p>
                      </IconWrapper>
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <p className="font-semibold">{t("work_text")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="143243"
                    href={'/#/edit-profile-field?page=instagram'}
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">🔗</p>
                      </IconWrapper>
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <p className="font-semibold">{t("instagram_text")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="1543"
                    href={'/#/edit-profile-field?page=quastion'}
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">❓</p>
                      </IconWrapper>
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <p className="font-semibold">{t("questions_text")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="15ddd3"
                    href={'/#/edit-profile-field?page=location'}
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">📍</p>
                      </IconWrapper>
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <p className="font-semibold">{t("location")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="15ddd3"
                    href={'/#/edit-profile-field?page=education'}
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">👨‍🎓</p>
                      </IconWrapper>
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <p className="font-semibold">{t("Education")}</p>
                  </ListboxItem>


                  <ListboxItem
                    key="3"
                    onPress={() => handleClickProfileData("WhyIamhere")}
                    description={
                      lookingfor.find(
                        (lookingfor) => lookingfor.id == user.profileData.lookingFor
                      ).title
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">🤔</p>
                      </IconWrapper>
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <p className="font-semibold">{t("WhyIamhere")}</p>
                  </ListboxItem>
                </ListboxSection>
                <ListboxSection
                  classNames={{ heading: "font-bold" }}
                  className="relative"
                  title={t("more_about_me")}
                >
                  <ListboxItem
                    key="7"
                    onPress={() => handleClick("RealationStatus")}
                    description={
                      RealationStatus.find(
                        (RealationStatus) =>
                          RealationStatus.key === user.moreAboutMe.relationStatus
                      ).label
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">👩‍❤️‍👨</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("RealationStatus")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="8"
                    onPress={() => handleClick("height")}
                    description={`${user.moreAboutMe.height} cm`}
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">📏</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("Height")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="10"
                    onPress={() => handleClick("languages")}
                    description={`${user.moreAboutMe.languages
                      .map((value) =>
                        languages.find((languages) => languages.key === value).label
                      )
                      .join(", ")}`}
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">🈶</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("Language")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="11"
                    onPress={() => handleClick("SexualityStatus")}
                    description={
                      SexualityStatus.find(
                        (SexualityStatus) =>
                          SexualityStatus.key === user.moreAboutMe.sexuality
                      ).label
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">🌈</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("SexualityStatus")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="12"
                    onPress={() => handleClick("kids")}
                    description={
                      KidStatus.find((KidStatus) => KidStatus.key === user.moreAboutMe.kids)
                        .label
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">👦</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("kids")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="13"
                    onPress={() => handleClick("smoking")}
                    description={
                      SmokingStatus.find(
                        (SmokingStatus) => SmokingStatus.key === user.moreAboutMe.smoking
                      ).label
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">🚬</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("SmokingStatus")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="14"
                    onPress={() => handleClick("drink")}
                    description={
                      DrinkStatus.find((DrinkStatus) => DrinkStatus.key === user.moreAboutMe.drink)
                        .label
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">🥃</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("DrinkStatus")}</p>
                  </ListboxItem>

                  <ListboxItem
                    key="15"
                    onPress={() => handleClick("pets")}
                    description={
                      PetStatus.find((PetStatus) => PetStatus.key === user.moreAboutMe.pets)
                        .label
                    }
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                    startContent={
                      <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary">
                        <p className="text-md">🐶</p>
                      </IconWrapper>
                    }
                  >
                    <p className="font-semibold">{t("PetStatus")}</p>
                  </ListboxItem>
                </ListboxSection>
                <ListboxSection
                  classNames={{ heading: "font-bold" }}
                  className="relative"
                  title={t("interested")}
                >
                  <ListboxItem
                    key={111}
                    endContent={
                      <ArrowRight
                        style={{
                          transform: `${
                            i18n.language === "ar" || i18n.language === "fa"
                              ? "rotate(180deg)"
                              : "rotate(0deg)"
                          }`,
                        }}
                      />
                    }
                  >
                    <EditIntersting user={user} loading={updateUserData}>
                      {user.interests.map((value, index) => {
                        const interestsList = hobbies.find((hobbie) => hobbie.id == value);
                        return (
                          <Chip
                            key={index}
                            className="m-1"
                            variant="solid"
                            color="default"
                          >
                            {interestsList.emoji} {interestsList.name}
                          </Chip>
                        );
                      })}
                      {user.interests.length === 0 && (
                        <p className="text-xs">{t("data_not_found")}</p>
                      )}
                    </EditIntersting>
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
            </div>
          </div>
        </section>
      </div>
      <EditProfile loading={updateUserData} selectedItem={selectedProfileData} user={user} ref={profileDataModal} />
      <EditMoreAboutMeModal loading={updateUserData} selectedItem={selectedItem} user={user} ref={childRef} />

      {/* Render the cropping modal when an image is selected */}
      {imageToCrop && (
        <ImageCropModal
          imageToCrop={imageToCrop}
          onImageCropped={handleCroppedImage}
          onClose={() => {
            setImageToCrop(null);
            setSelectedUploadData(null);
          }}
        />
      )}
    </Page>
  );
}

const imageClasses = [
  "col-span-2 aspect-square row-span-2", // Index 0
  "col-start-3 aspect-square", // Index 1
  "col-start-3 row-start-2 aspect-square", // Index 2
  "row-start-3 aspect-square", // Index 3
  "row-start-3 aspect-square", // Index 4
  "row-start-3 aspect-square", // Index 5
];

export const IconWrapper = ({ children, className }) => (
  <div className={cn(className, "flex items-center bg-default/20 rounded-small justify-center")}>
    {children}
  </div>
);
