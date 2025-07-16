import { useState, useRef, useCallback } from "react";
import { RootState, AppDispatch } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addToast, Card, CardBody, CardFooter, closeAll, Image, Spinner } from "@heroui/react";
import { Page } from "@/components/Page.tsx";
import TopBarPages from "@/components/tobBar/index";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import Webcam from "react-webcam";
import { verifyUserPhoto } from "@/features/userSlice";
import { useNavigate } from "react-router-dom";
import MainButton from "@/components/miniAppButtons/MainButton";

export default function VerifyAccontViewPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, loading } = useSelector((state: RootState) => state.user);
  const lp = useLaunchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const getPaddingForPlatform = () => {
    return ["ios"].includes(lp.platform) ? "50px" : "25px";
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhoto(imageSrc);
        setPhotoTaken(true);
      }
    }
  }, [webcamRef]);

  const uploadPhoto = async () => {
    if (photo && data) {
      try {
        addToast({
              title: t("verifying_profile_title"),
              description:t("verifying_profile_description"),
              timeout: Infinity,
              endContent:<Spinner size="sm" />,
        });
        const response = await fetch(photo);
        const blob = await response.blob();
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        navigate("/main/profile");
        const verified = await dispatch(verifyUserPhoto({ userId: data.id.toString(), photoFile: file }));
        if(verified.payload){
          closeAll()
          //@ts-ignore
          if(verified.payload?.verified === true){
            addToast({
              title: t("profile_verified_success"),
              timeout: 3000,
              color:"success"
        });
          }else{
             addToast({
              description: t("Your_face_should_match_the_one_shown_in_your_profile_image_for_verification_purposes."),
              title:t("Profile_Verification_Requirements"),
              timeout: 6000,
              color:"danger"
        });
          }
        }
       

      } catch (error) {
        console.error("Error uploading photo:", error);

       

      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col p-6 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Page>
      <div className="container mx-auto max-w-7xl flex-grow" style={{ marginBottom: "5rem", padding: "18px " }}>
        <TopBarPages />
        <Card radius="lg" className="flex flex-col items-center justify-center" style={{ marginTop: `calc(4rem + ${getPaddingForPlatform()})` }}>
          <CardBody>
            {!photoTaken ? (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-[300px] rounded-xl"
                  videoConstraints={{ facingMode: "user" }}
                />
              </>
            ) : (
              <>
                <Image src={photo} alt="Captured" className="w-full h-[300px] aspect-video" />
              </>
            )}
          </CardBody>

          <CardFooter className="mt-2 flex-col flex items-start text-green-500">
            <p className="text-tiny uppercase font-bold text-danger">{t("Profile_Verification_Requirements")}</p>
            <ul>
              <li>
                <small className="text-default-500">{t("Make_sure_your_face_is_clearly_visible,_centered,_and_unobstructed.")}</small>
              </li>
              <li>
                <small className="text-default-500">{t("Ensure_that_your_photo_is_taken_in_good_lighting_to_avoid_shadows_or_dark_areas.")}</small>
              </li>
              <li>
                <small className="text-default-500">{t("Avoid_using_filters_or_any_image_enhancements.")}</small>
              </li>
              <li>
                <small className="text-default-500">{t("Your_face_should_match_the_one_shown_in_your_profile_image_for_verification_purposes.")}</small>
              </li>
            </ul>
          </CardFooter>
        </Card>
      </div>

       <MainButton
            text={!photoTaken? t("take_Photo"): t("upload_Photo")}
            backgroundColor={!photoTaken?"#D54C52" : "#33C2BA"}
            textColor="#FFFFFF"
            hasShineEffect={true}
            isEnabled={ true} 
            isLoaderVisible={false}
            isVisible={true}
            onClick={()=>{
                if(!photoTaken){
                  capturePhoto()
                }else{
                  uploadPhoto()
                }
              }
            }
          />
    </Page>
  );
}
