import React, { useEffect, useState } from "react";
import {  addToast, Button, Image } from "@heroui/react";
import { CameraIcon, FaceIcon } from "@/Icons";
import ImageCropModal from "./imageCropperModal"
import { uploadProfileImage } from "@/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useTranslation } from "react-i18next";
// Lazy load the ImageCropModal so it’s loaded only when needed.

const ImageUploader = ({ text, id, setSlideAvailable,setSlideUnAvailable, showError, user }) => {
  const [imageToCrop, setImageToCrop] = useState<string | null>(null); // Image to crop
  const [croppedImage, setCroppedImage] = useState<string | null>(user[`image${id}`]); // Cropped image result
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for image processing
  const { data } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();

  // Resize the image using a canvas before cropping to reduce memory usage.
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

  // Handle file selection and conversion
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        // Resize image before passing to the cropper
        const resizedImage = await resizeImage(file);

        detectFaceInImage(resizedImage);

      } catch (error) {
        console.error("Error processing image:", error);
        alert("Error processing image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(()=>{
    if(imageToCrop){
      setSlideUnAvailable("modalStatus",  true)
    }else{
      setSlideUnAvailable("modalStatus",  false)
    }
  },[imageToCrop])
  // Placeholder for face detection; currently just passes the image for cropping.
  const detectFaceInImage = async (imageUrl: string) => {
    setImageToCrop(imageUrl);
  };

  // Handle the cropped image result from the modal
  const handleCroppedImage = async (image: string) => {
    
    
    setIsLoading(true)
    setCroppedImage(image);


    dispatch(
          uploadProfileImage({
            userId: data.id.toString(),
            imageFile: image,
            order: id,
        })
    ).then(then=>{
      if(then.meta.requestStatus === "rejected"){
            addToast({
              description: t("face_detect_error"),
              color: "warning",
              icon:<FaceIcon/>
            })
        setImageToCrop(null);
        setCroppedImage(null);
        setIsLoading(false);

      } else {
        setIsLoading(false);
        setSlideAvailable(`image${id}`, image)
        setCroppedImage(image);
        setImageToCrop(null);
      }



  })};



  return (
    <div style={{maxWidth:"60%"}} className="w-full h-full">
      {(!croppedImage && !isLoading) && (
        <Button
          disableAnimation
          style={{ aspectRatio: "3/4" }}
          className="w-full h-full flex flex-col items-center"
          color={showError ? "danger" : "default"}
          variant={showError ? "bordered": "solid"}
          
          onPress={() =>
            document.getElementById(`file-input-${id}`)?.click()
          }
        >
          <CameraIcon className="size-7" />
          <p className="text-wrap text-sm">{text}</p>
        </Button>
      )}

      {/* Hidden file input */}
      <input
        id={`file-input-${id}`}
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Display the cropped image if available */}
      {(croppedImage || isLoading) && (
        <Image
          isBlurred={isLoading}
          isLoading={isLoading}
          src={croppedImage || undefined}
          style={{ aspectRatio: "3/4" }}
          onClick={() =>
            document.getElementById(`file-input-${id}`)?.click()
          }
        />
      )}
      
      {/* Image Crop Modal wrapped with Suspense */}
      {imageToCrop && (
        <>
          <ImageCropModal
            onClose={() => setImageToCrop(null)}
            imageToCrop={imageToCrop}
            onImageCropped={handleCroppedImage}
          />
          </>
      )}
    </div>
  );
};

export default ImageUploader;
