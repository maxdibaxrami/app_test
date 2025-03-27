import { useState } from "react";
import { addToast, Button, Card, CardBody } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { MatchConfetti } from "@/components/explore/buttonEffect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { activatePremium } from "@/features/userSlice";
import { SparklesCustomIconText } from "@/components/animate/customSarkles";
import { resetLikes, setLastReset } from "@/features/likeLimitationSlice";
import { resetLikes as limitationLike, setLastReset as resetLastreaset } from "@/features/likeLimitationSlice";
import axios from '@/api/base';
import { invoice } from "@telegram-apps/sdk-react";

export const PermiumCardStars = ({ title, description, price, icon, Id }) => {
  const { t } = useTranslation();
  const [txStatus, setTxStatus] = useState("idle"); // idle, pending, success, or error
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
            activatePremium({
              userId: user.id.toString(),
              duration: Id
            })
          );
      
          setTxStatus("success");
          const today = new Date().setHours(0, 0, 0, 0);
          dispatch(resetLikes());
          dispatch(setLastReset(today));
          dispatch(limitationLike());
          dispatch(resetLastreaset(today));

          addToast({
            title: t("payment_successful_text"),
            description: t("premium_account_activated"),
            color: "success",
          });
          MatchConfetti();
          setTxStatus("success");
        }
      } else {
        throw new Error("Invoice feature is not supported on this device.");
      }
    } catch (error: any) {
      console.error(error);
      let errorMessage = error.message || t("Unknown error occurred");

      if (error.code === "TIMEOUT") {
        errorMessage = t("Transaction timed out. Please try again.");
      } else if (error.code === "VERIFICATION_FAILED") {
        errorMessage = t("Unable to verify the transaction. Please ensure sufficient balance.");
      }
      console.log(errorMessage)
     addToast({
        title: t("Error"),
        description: t('payment_failed_text'),
        color: "danger",
      });
  
      setTxStatus("error");
    }
  };

  return (
    <Card shadow="none" className="py-2 w-full mb-2 border-1 border-default-200 dark:border-default-100 backdrop-blur bg-primary/10">
      <CardBody className="flex flex-col">
        <div className="flex flex-col justify-center">
          <h4 className="flex flex-col font-semibold text-small my-1 text-center leading-none text-default-600">
             <SparklesCustomIconText text={<p className="text-4xl p-1">{icon}</p>} icon={<p className="text-4xl p-1">{icon}</p>}>
              
             </SparklesCustomIconText>
          </h4>

            <span className="my-1 flex items-center font-bold justify-center">{title}</span>

            <div className="flex flex-col mx-2 my-1 gap-2">
              <ul className="text-center">
                <li className="text-xs font-tiny text-primary/80">💬 {t('message_anyone')} 💬</li>
                <li className="text-xs font-tiny text-primary/80">🤘 {t('unlimited_messaging')} 🤘</li>
                <li className="text-xs font-tiny text-primary/80">👀 {t('see_who_viewed')} 👀</li>
                <li className="text-xs font-tiny text-primary/80">👍 {t('see_who_likes')} 👍</li>
                <li className="text-xs font-tiny text-primary/80">🎁 {t('boost_referral_rewards')} 🎁</li>
              </ul>
            </div>

          <h5 className="text-xs tracking-tight my-1 text-center text-default-400">{description}</h5>
        </div>
        <Button
          color="primary"
          radius="lg"
          size="sm"
          className="w-full mt-2"
          variant="solid"
          onPress={handlePaymentTelegram}
          isDisabled={user.premium === true} // Prevent clicking while a transaction is pending
        >
          {price} $
        </Button>
      </CardBody>
    </Card>
  );
};
