import { useState } from "react";
import { addToast, Button, Card, CardBody, Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import axios from '@/api/base';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { updateUserData } from "@/features/userSlice";
import { MatchConfetti } from "@/components/explore/buttonEffect";
import { SparklesCustomIconText } from "@/components/animate/customSarkles";
import { invoice } from "@telegram-apps/sdk-react";
// Import the invoice object from the telegram-apps/sdk package:

export const StarsCard = ({ title, description, price, energy, icon }) => {
  const { t } = useTranslation();
  const [txStatus, setTxStatus] = useState("idle"); // "idle", "pending", "success", "error"
  const { data: user } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const handlePaymentTelegram = async () => {
    if (txStatus === "pending") return; // Prevent duplicate clicks
    setTxStatus("pending");

    try {
      // Prepare payload for your backend API
      const payload = {
        title,
        description,
        price, // Price should be in the expected units
        energy,
        userId: user.telegramId,
      };

      // Call your backend endpoint to create an invoice.
      const response = await axios.post("/invoice/create-invoice", payload);
      if (!response.data || !response.data.result) {
        throw new Error("Invoice URL not received");
      }

      console.log(invoice.open.isAvailable())

      // Check if invoice feature is supported:
      if (invoice.open.isAvailable()) {
        // Open the invoice in URL mode using the returned URL.
        // The second parameter 'url' ensures that the SDK treats the passed value as a URL.
        const status = await invoice.open(response.data.result, "url");
        console.log(status)
        // After the promise resolves, invoice.isOpened() should be false.
        if (status === "cancelled" || status === "failed") {
          addToast({
            title: t("Error"),
            description: t("payment_failed_text"),
            color: "danger",
          });
          setTxStatus("error");
        } else {
          // Payment successful – update the user's reward points.
          await dispatch(
            updateUserData({
              updatedData: { rewardPoints: user.rewardPoints + energy },
            })
          );
          addToast({
            title: t("payment_successful_text"),
            description: t("power_added_successfully_text"),
            color: "success",
          });
          MatchConfetti();
          setTxStatus("success");
        }
      } else {
        throw new Error("Invoice feature is not supported on this device.");
      }
    } catch (error: any) {
      let errorMessage = error.message || t("Unknown error occurred");

      if (error.code === "TIMEOUT") {
        errorMessage = t("Transaction timed out. Please try again.");
      } else if (error.code === "VERIFICATION_FAILED") {
        errorMessage = t("Unable to verify the transaction. Please ensure sufficient balance.");
      }

      console.error(errorMessage);

      addToast({
        title: t("Error"),
        description: errorMessage,
        color: "danger",
      });
      setTxStatus("error");
    }
  };

  return (
    <Card className="py-2 mb-2 bg-background/70">
      <CardBody className="flex flex-col">
        <div className="flex flex-col justify-center">
          <h4 className="flex flex-col font-semibold text-small my-1 text-center leading-none text-default-600">
            <SparklesCustomIconText
              text={<p className="text-4xl p-1">{icon}</p>}
              icon={<p className="text-4xl p-1">{icon}</p>}
            />
            <span className="my-1 flex items-center justify-center">{title}</span>
            <span className="mx-2 my-1">
              <Chip color="success" size="sm">
                +{energy} {t("energy")}
              </Chip>
            </span>
          </h4>
          <h5 className="text-xs tracking-tight my-1 text-center text-default-400">
            {description}
          </h5>
        </div>
        <Button
          color="primary"
          radius="lg"
          size="sm"
          className="w-full mt-2"
          variant="solid"
          onPress={handlePaymentTelegram}
          // Disable button if a transaction is pending
          isDisabled={txStatus === "pending"}
        >
           
          $ {price} 
        </Button>
      </CardBody>
    </Card>
  );
};
