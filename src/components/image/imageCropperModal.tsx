import { useState, useRef, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import "cropperjs/dist/cropper.css";
import { useTranslation } from "react-i18next";
import { CutIcon } from "@/Icons";
import Cropper  from 'react-cropper'

// Lazy load the Cropper library to avoid heavy upfront loading.

interface ImageCropModalProps {
  imageToCrop: string | null; // Image URL for cropping
  onImageCropped: (image: string) => void; // Callback to return the cropped image
  onClose?: () => void; // Callback to close the modal
}

const ImageCropModal = ({ imageToCrop, onImageCropped, onClose }: ImageCropModalProps) => {
  const cropperRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCropperReady, setIsCropperReady] = useState(false);
  const { t } = useTranslation();

  // Set cropper ready state once the image is loaded.
  useEffect(() => {
    if (cropperRef.current && imageToCrop) {
      const cropper = cropperRef.current?.cropper;
      setIsCropperReady(!!cropper);
    }
  }, [imageToCrop]);

  // Handle cropping and return the cropped image
  const handleCrop = () => {
    setLoading(true);
    if (isCropperReady && cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImageUrl = croppedCanvas.toDataURL();
        onImageCropped(croppedImageUrl);
        onClose && onClose();
      } else {
        console.error("Error: getCroppedCanvas method not available");
      }
    } else {
      console.error("Error: Cropper is not initialized or ready");
    }
    setLoading(false);
  };

  return (
    <Modal hideCloseButton size="5xl" isOpen={!!imageToCrop} onOpenChange={() => null}>
      <ModalContent>
        <>
          <ModalHeader className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <p>{t("Crop_Image")}</p>
            </div>
            <div>
              <Button startContent={<CutIcon className="size-5" />} isLoading={loading} color="primary" onPress={handleCrop}>
                {t("Save")}
              </Button>
            </div>
          </ModalHeader>
          <ModalBody>
            {/* Render Cropper inside Suspense to lazy load the heavy component */}
            {imageToCrop && (
                <Cropper
                  src={imageToCrop}
                  style={{ height: 400, width: "100%" }}
                  aspectRatio={3 / 4}
                  guides={false}
                  ref={cropperRef}
                  viewMode={1}
                  autoCropArea={1}
                  background={false}
                />
            )}
          </ModalBody>
        </>
      </ModalContent>           

    </Modal>
  );
};

export default ImageCropModal;
