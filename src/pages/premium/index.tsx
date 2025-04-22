import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, cn, Spinner, Tab, Tabs } from "@heroui/react";
import { Page } from "@/components/Page.tsx";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { TonCoinIcon, WalletIcon } from "@/Icons";
import { PermiumCard } from "./permiumCards";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { RootState } from "@/store";
import { Address } from "@ton/core";
import { SparklesCustomIconText } from "@/components/animate/customSarkles";
import { motion } from "framer-motion";
import { ProfileBackgroundSvg } from "@/Icons/profileBackgroundSVG";
import { PermiumCardStars } from "./permiumCardsStars";
import { PermiumCardEnergy } from "./permiumEnergyCard";


const PremiumPage: React.FC = () => {
  const { t } = useTranslation();
  const wallet = useTonWallet();

  useEffect(()=>{ console.log(wallet)},[wallet])
  const [tonConnectUI] = useTonConnectUI();
  const { loading } = useSelector((state: RootState) => state.user);
  const lp = useLaunchParams();
  const [tonWalletAddress, setTonWalletAddress] = useState(null);

  const handleWalletConnection = useCallback(async (address: string) => {
    // Convert the address to UQ format (user-friendly bounceable)
    const parsedAddress = Address.parse(address);
    const bounceableAddress = parsedAddress.toString({
      urlSafe: true,
      bounceable: true, // This ensures it's in the bounceable format (UQ...)
      testOnly: false, // Ensure it's not a testnet address
    });

    setTonWalletAddress(bounceableAddress as any);
    console.log("Wallet connected successfully!", bounceableAddress); // Debugging
    console.log(tonWalletAddress)
    // Update the user's document in Firestore with the wallet address
  }, []);

  const handleWalletDisconnection = useCallback(async () => {
    setTonWalletAddress(null);

  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  };


  const TonPaymentList = [ {
    title: t("1_month_premium"), // English: "1-Month Premium", Farsi: "پریمیوم یک ماهه", Arabic: "بريميوم لمدة شهر واحد", Russian: "Премиум на 1 месяц"
    description: t("save_10_percent"), // English: "1-month premium subscription", Farsi: "اشتراک یک ماهه پریمیوم", Arabic: "اشتراك بريميوم لمدة شهر واحد", Russian: "Подписка премиум на 1 месяц"
    price: 0.5,  // example TON price
    duration: t("duration_1_month"), // English: "1 Month", Farsi: "یک ماه", Arabic: "شهر واحد", Russian: "1 месяц"
    icon: "⭐️",
    Id:"1month"
  },
  {
    title: t("3_month_premium"), // English: "3-Month Premium", Farsi: "پریمیوم سه ماهه", Arabic: "بريميوم لمدة 3 أشهر", Russian: "Премиум на 3 месяца"
    description: t("save_20_percent"), // English: "3-month premium subscription", Farsi: "اشتراک سه ماهه پریمیوم", Arabic: "اشتراك بريميوم لمدة 3 أشهر", Russian: "Подписка премиум на 3 месяца"
    price: 1,  // example TON price (10% off monthly)
    duration: t("duration_3_months"), // English: "3 Months", Farsi: "سه ماه", Arabic: "3 أشهر", Russian: "3 месяца"
    icon: "🌟",
    Id:"3months"

  },
  {
    title: t("1_year_premium"), // English: "1-Year Premium", Farsi: "پریمیوم یک ساله", Arabic: "بريميوم لمدة عام", Russian: "Премиум на 1 год"
    description: t("save_30_percent"), // English: "1-year premium subscription", Farsi: "اشتراک یک ساله پریمیوم", Arabic: "اشتراك بريميوم لمدة عام", Russian: "Подписка премиум на 1 год"
    price: 2.5,  // example TON price (30% off monthly)
    duration: t("duration_1_year"), // English: "1 Year", Farsi: "یک سال", Arabic: "عام واحد", Russian: "1 год"
    icon: "🌠",
    Id:"1year"

  }]
  


  const StarPaymentList = [ {
    title: t("1_month_premium"), // English: "1-Month Premium", Farsi: "پریمیوم یک ماهه", Arabic: "بريميوم لمدة شهر واحد", Russian: "Премиум на 1 месяц"
    description: t("save_10_percent"), // English: "1-month premium subscription", Farsi: "اشتراک یک ماهه پریمیوم", Arabic: "اشتراك بريميوم لمدة شهر واحد", Russian: "Подписка премиум на 1 месяц"
    price: 0.1,  // example TON price
    duration: t("duration_1_month"), // English: "1 Month", Farsi: "یک ماه", Arabic: "شهر واحد", Russian: "1 месяц"
    icon: "⭐️",
    Id:"1month"
  },
  {
    title: t("3_month_premium"), // English: "3-Month Premium", Farsi: "پریمیوم سه ماهه", Arabic: "بريميوم لمدة 3 أشهر", Russian: "Премиум на 3 месяца"
    description: t("save_20_percent"), // English: "3-month premium subscription", Farsi: "اشتراک سه ماهه پریمیوم", Arabic: "اشتراك بريميوم لمدة 3 أشهر", Russian: "Подписка премиум на 3 месяца"
    price: 3.5,  // example TON price (10% off monthly)
    duration: t("duration_3_months"), // English: "3 Months", Farsi: "سه ماه", Arabic: "3 أشهر", Russian: "3 месяца"
    icon: "🌟",
    Id:"3months"

  },
  {
    title: t("1_year_premium"), // English: "1-Year Premium", Farsi: "پریمیوم یک ساله", Arabic: "بريميوم لمدة عام", Russian: "Премиум на 1 год"
    description: t("save_30_percent"), // English: "1-year premium subscription", Farsi: "اشتراک یک ساله پریمیوم", Arabic: "اشتراك بريميوم لمدة عام", Russian: "Подписка премиум на 1 год"
    price: 8,  // example TON price (30% off monthly)
    duration: t("duration_1_year"), // English: "1 Year", Farsi: "یک سال", Arabic: "عام واحد", Russian: "1 год"
    icon: "🌠",
    Id:"1year"

  }]


  const EnergyPeymentList = [ {
    title: t("1_month_premium"), // English: "1-Month Premium", Farsi: "پریمیوم یک ماهه", Arabic: "بريميوم لمدة شهر واحد", Russian: "Премиум на 1 месяц"
    description: t("save_10_percent"), // English: "1-month premium subscription", Farsi: "اشتراک یک ماهه پریمیوم", Arabic: "اشتراك بريميوم لمدة شهر واحد", Russian: "Подписка премиум на 1 месяц"
    price: 1300,  // example TON price
    duration: t("duration_1_month"), // English: "1 Month", Farsi: "یک ماه", Arabic: "شهر واحد", Russian: "1 месяц"
    icon: "⭐️",
    Id:"1month"
  },
  {
    title: t("3_month_premium"), // English: "3-Month Premium", Farsi: "پریمیوم سه ماهه", Arabic: "بريميوم لمدة 3 أشهر", Russian: "Премиум на 3 месяца"
    description: t("save_20_percent"), // English: "3-month premium subscription", Farsi: "اشتراک سه ماهه پریمیوم", Arabic: "اشتراك بريميوم لمدة 3 أشهر", Russian: "Подписка премиум на 3 месяца"
    price: 2400,  // example TON price (10% off monthly)
    duration: t("duration_3_months"), // English: "3 Months", Farsi: "سه ماه", Arabic: "3 أشهر", Russian: "3 месяца"
    icon: "🌟",
    Id:"3months"

  },
  {
    title: t("1_year_premium"), // English: "1-Year Premium", Farsi: "پریمیوم یک ساله", Arabic: "بريميوم لمدة عام", Russian: "Премиум на 1 год"
    description: t("save_30_percent"), // English: "1-year premium subscription", Farsi: "اشتراک یک ساله پریمیوم", Arabic: "اشتراك بريميوم لمدة عام", Russian: "Подписка премиум на 1 год"
    price: 5000,  // example TON price (30% off monthly)
    duration: t("duration_1_year"), // English: "1 Year", Farsi: "یک سال", Arabic: "عام واحد", Russian: "1 год"
    icon: "🌠",
    Id:"1year"

  }]

  
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col p-6 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Determine safe area padding based on platform
  const getPaddingForPlatform = () =>
    ["ios", "android"].includes(lp.platform) ? "4.5px" : "4rem";

  return (
    <Page>
      <div
        className="container relative mx-auto max-w-7xl flex-grow h-screen"
        style={{ marginBottom: "5rem" }}
      >
        <section
          className="flex flex-col px-6 items-center safe-area-top justify-center"
          style={{ paddingTop: getPaddingForPlatform() }}
        >
              <motion.div transition={{ delay: 2 , duration: 2 }} initial={{opacity:0}} animate={{opacity:1}} className="fixed h-full dark:opacity-70 -top-[80px] inset-0 flex items-center z-[-10]">
                <ProfileBackgroundSvg/>
              </motion.div>
          <div className="flex flex-col items-center">
            
             <SparklesCustomIconText sparklesCount={15} text={<p className="text-4xl p-1">⭐️</p>} icon={<p className="text-4xl p-1">⭐️</p>} />
              
            <p className="text-2xl text-foreground/90 font-bold ">
              {t("premium_account")}
            </p>
            <p className="text-sm text-center font-tiny text-warning/80 mb-4">
              {t("Tounlockallfeatures,youneedapremiumaccount.")}
            </p>
          </div>
          <Tabs classNames={{"panel":"w-full"}} size="lg" color="primary" fullWidth aria-label="Options">

            <Tab  key="energy" title={
                <p className="text-md flex items-center gap-1">
                  🔋 {t("energy")}
                </p>
              }>
              <Card className="w-full bg-transparent ">
                                <CardBody className=" bg-primary/10">
                                  <div className="grid grid-cols-1 sm:grid-cols-1 ">
                                    {EnergyPeymentList.map((value, index) => (
                                      <PermiumCardEnergy
                                        key={index}
                                        title={value.title}
                                        description={value.description}
                                        price={value.price}
                                        icon={value.icon}
                                        Id={value.Id}   
                                      />
                                    ))}
                                  </div> 
                                </CardBody>
              </Card>
            </Tab>

            <Tab  key="stars" title={
              <p className="text-md flex items-center gap-1">
                ⭐️ Stars
            </p>
            }>
              <Card className="w-full bg-transparent ">
                                <CardBody className=" bg-primary/10">
                                  <div className="grid grid-cols-1 sm:grid-cols-1 ">
                                    {StarPaymentList.map((value, index) => (
                                      <PermiumCardStars
                                        key={index}
                                        title={value.title}
                                        description={value.description}
                                        price={value.price}
                                        icon={value.icon}
                                        Id={value.Id}                                     />
                                    ))}
                                  </div> 
                                </CardBody>
              </Card>
            </Tab>

            <Tab isDisabled={["ios"].includes(lp.platform)? true : false} key="ton" title={
              <p className="text-md flex items-center gap-1">
              <TonCoinIcon className="size-5" /> Ton
            </p>
            }>

              <Card className="w-full bg-transparent ">
                                <CardBody className=" bg-primary/10">
                                  <Button className="mb-2" startContent={<WalletIcon className="size-5"/>} onPress={handleWalletAction} color="primary" variant="solid">
                                  {tonConnectUI.connected? t("disconnect_wallet_text") : t("connect_wallet_text")}
                                  </Button>
                                  <div className="grid grid-cols-1 sm:grid-cols-1 ">
                                    {TonPaymentList.map((value, index) => (
                                      <PermiumCard
                                        key={index}
                                        title={value.title}
                                        description={value.description}
                                        price={value.price}
                                        tonConnectUIInstance={tonConnectUI}
                                        icon={value.icon}
                                        Id={value.Id}
                                      />
                                    ))}
                                  </div> 
                                </CardBody>
              </Card>

            </Tab>

          </Tabs>

        </section>
      </div>
    </Page>
  );
};

export const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    style={{ borderRadius: "50%" }}
    className={cn(className, "flex items-center rounded-small justify-center p-2")}
  >
    {children}
  </div>
);

export default PremiumPage;
