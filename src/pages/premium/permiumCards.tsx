import { useState } from "react";
import { TonCoinIcon } from "@/Icons";
import { addToast, Button, Card, CardBody } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { TON_WALLET } from "@/constant";
import { MatchConfetti } from "@/components/explore/buttonEffect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { activatePremium } from "@/features/userSlice";
import { SparklesCustomIconText } from "@/components/animate/customSarkles";
import { resetLikes, setLastReset } from "@/features/likeLimitationSlice";
import { resetLikes as limitationLike, setLastReset as resetLastreaset } from "@/features/likeLimitationSlice";

export const PermiumCard = ({ title, description, price, tonConnectUIInstance, icon, Id }) => {
  const { t } = useTranslation();
  const [txStatus, setTxStatus] = useState("idle"); // idle, pending, success, or error
  const { data: user } = useSelector((state: RootState) => state.user);

  const dispatch: AppDispatch = useDispatch();

  const handlePaymentTon = async () => {
    if (txStatus === "pending") return; // Avoid duplicate transactions
  
    setTxStatus("pending");
  
    try {
      // Construct the transaction object with validUntil in seconds
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 5 * 60,
        messages: [
          {
            address: TON_WALLET,
            amount: (price * Math.pow(10, 9)).toString(),
          },
        ],
      };
  
      console.log("Sending transaction:", transaction);
  
      // Send the transaction through the TonConnect UI
      await tonConnectUIInstance.sendTransaction(transaction);
  
      // Transaction success - update user state
      await dispatch(
        activatePremium({
          duration: Id
        })
      );
  
      addToast({
        title: t("payment_successful_text"),
        description: t("premium_account_activated"),
        color: "success",
      });
  
      // Fire success animation
      MatchConfetti();
  
      setTxStatus("success");
      const today = new Date().setHours(0, 0, 0, 0);
      dispatch(resetLikes());
      dispatch(setLastReset(today));
      dispatch(limitationLike());
      dispatch(resetLastreaset(today));
      
      return true; // Transaction successful
    } catch (error) {
      console.error("Transaction failed:", error);
      let errorMessage = error.message || t("Unknown error occurred");
  
      if (error.code === "TIMEOUT") {
        errorMessage = t("Transaction timed out. Please try again.");
      } else if (error.code === "VERIFICATION_FAILED") {
        errorMessage = t("Unable to verify the transaction. Ensure you have enough TON.");
      }
  
      console.log(errorMessage)

      addToast({
        title: t("Error"),
        description: t('payment_failed_text'),
        color: "danger",
      });
  
      setTxStatus("error");
      return false; // Transaction failed
    }
  };
  

  return (
    <Card shadow="none" className="py-2 mb-2 border-1 border-default-200 dark:border-default-100 backdrop-blur bg-primary/10">
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
          onPress={handlePaymentTon}
          isDisabled={!tonConnectUIInstance.connected || user.premium === true} // Prevent clicking while a transaction is pending
        >
          <TonCoinIcon className="size-5" />
          {price} TON
        </Button>
      </CardBody>
    </Card>
  );
};
