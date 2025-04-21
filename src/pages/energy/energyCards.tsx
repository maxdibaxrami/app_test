import { useState } from "react";
import { TonCoinIcon } from "@/Icons";
import { addToast, Button, Card, CardBody, Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { TON_WALLET } from "@/constant";
import { MatchConfetti } from "@/components/explore/buttonEffect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { updateUserData } from "@/features/userSlice";
import { SparklesCustomIconText } from "@/components/animate/customSarkles";

export const EnergyCard = ({ title, description, price, energy, tonConnectUIInstance, icon }) => {
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
        updateUserData({
          updatedData: {
            rewardPoints: user.rewardPoints + energy,
          },
        })
      );
  
      addToast({
        title: t("payment_successful_text"),
        description: t("power_added_successfully_text"),
        color: "success",
      });
  
      // Fire success animation
      MatchConfetti();
  
      setTxStatus("success");
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
    <Card className="py-2 mb-2 bg-background/70">
      <CardBody className="flex flex-col">
        <div className="flex flex-col justify-center">
          <h4 className="flex flex-col font-semibold text-small my-1 text-center leading-none text-default-600">
             <SparklesCustomIconText text={<p className="text-4xl p-1">{icon}</p>} icon={<p className="text-4xl p-1">{icon}</p>}>
              
             </SparklesCustomIconText>
             

            <span className="my-1 flex items-center justify-center">{title}</span>
            <span className="mx-2 my-1">
              <Chip color="success" size="sm">
                +{energy} {t("energy")}
              </Chip>
            </span>
          </h4>
          <h5 className="text-xs tracking-tight my-1 text-center text-default-400">{description}</h5>
        </div>
        <Button
          color="primary"
          radius="lg"
          size="sm"
          className="w-full mt-2"
          variant="solid"
          onPress={handlePaymentTon}
          isDisabled={!tonConnectUIInstance.connected} // Prevent clicking while a transaction is pending
        >
          <TonCoinIcon className="size-5" />
          {price} TON
        </Button>
      </CardBody>
    </Card>
  );
};
