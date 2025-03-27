import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, cn, Spinner, Tab, Tabs } from "@heroui/react";
import { Page } from "@/components/Page.tsx";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { TonCoinIcon, WalletIcon } from "@/Icons";
import { SparklesFlashIconText } from "@/components/animate/flash-sparkles";
import { Link } from "react-router-dom";
import { EnergyCard } from "./energyCards";
import { TaskCard } from "./taskCard";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { RootState } from "@/store";
import { Address } from "@ton/core";
import { StarsCard } from "./starsCards";


const EnergyViewPage: React.FC = () => {
  const { t } = useTranslation();
  const wallet = useTonWallet();

  useEffect(()=>{ console.log(wallet)},[wallet])
  const [tonConnectUI] = useTonConnectUI();
  const { data: user, loading } = useSelector((state: RootState) => state.user);
  const lp = useLaunchParams();
  const [selected, setSelected] = useState("task");
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

  {/*const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };*/}

  const TaskList = [
    {
      title: t("title_task_Profile"),
      description: t("description_task_Profile"),
      reward: "40",
      type: "COMPLETE_PROFILE",
      isDaily: false,
    },
    {
      title: t("title_channel_Profile"),
      description: t("description_channel_Profile"),
      reward: "20",
      type: "SUBSCRIBE_CHANNEL",
      isDaily: false,
    },
    {
      title: t("title_like_Profile"),
      description: t("description_like_Profile"),
      reward: "10",
      type: "LIKE_USER",
      isDaily: true,
    },
    {
      title: t("title_activity_Profile"),
      description: t("description_activity_Profile"),
      reward: "20",
      type: "ACTIVITY_USER",
      isDaily: true,
    },
    {
      title: t("title_match_Profile"),
      description: t("description_match_Profile"),
      reward: "20",
      type: "MATCH_USER",
      isDaily: true,
    },

    {
      title: t("Verification"),
      description: t("Boost_Your_Trustworthiness"),
      reward: "20",
      type: "VERIFY_ACCONT",
      isDaily: false,
    },
  ];

  const TonPaymentList = [
    {
      title: t("title_Starter_Energy"),
      description: t("description_Starter_Energy"),
      price: 0.5,
      energy: 599,
      icon:"🌕"
    },
    {
      title: t("title_advanced_Energy"),
      description: t("description_advanced_Energy"),
      price: 1,
      energy: 1300,
      icon:"🌏"

    },
    {
      title: t("title_mega_Energy"),
      description: t("description_mega_Energy"),
      price: 2,
      energy: 2400,
      icon:"🪐"

    },
    {
      title: t("title_supercharged_energy"),
      description: t("description_supercharged_energy"),
      price: 3,
      energy: 5000,
      icon:"☄️"

    },
  ];


  const StarPeymentList = [
    {
      title: t("title_Starter_Energy"),
      description: t("description_Starter_Energy"),
      price: 0.3,
      energy: 599,
      icon:"🌕"
    },
    {
      title: t("title_advanced_Energy"),
      description: t("description_advanced_Energy"),
      price: 3,
      energy: 1300,
      icon:"🌏"

    },
    {
      title: t("title_mega_Energy"),
      description: t("description_mega_Energy"),
      price: 6,
      energy: 2400,
      icon:"🪐"

    },
    {
      title: t("title_supercharged_energy"),
      description: t("description_supercharged_energy"),
      price: 9,
      energy: 5000,
      icon:"☄️"

    },
  ];


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
        className="container mx-auto max-w-7xl flex-grow h-screen"
        style={{ marginBottom: "5rem" }}
      >
        <section
          className="flex flex-col px-6 items-center safe-area-top justify-center"
          style={{ paddingTop: getPaddingForPlatform() }}
        >
          <div className="flex flex-col items-center">
            <SparklesFlashIconText
              text={
                <IconWrapper className="bg-background/80 text-secondary/80">
                  <p className="text-4xl">🔋</p>
                </IconWrapper>
              }
              sparklesCount={25}
              colors={{ first: "#FFFFFF", second: "#FFFFFF" }}
            />
            <p className="text-xl text-foreground/90 ">
              {`${user.rewardPoints} ${t("energy")}`}
            </p>
          </div>

          <div className="my-3">
            <Card
              isPressable
              as={Link}
              to={"/add-firends"}
              className="border-1 border-default-200 dark:border-default-100 backdrop-blur bg-neutral/10"
              radius="lg"
            >
              <div className="flex items-center p-2 h-full">
                <div>
                  <p className="text-4xl p-3">👫</p>
                </div>
                <div>
                  <p className="font-bold">{t("invite_your_friend")}</p>
                  <p className="text-xs">
                    {t("Inviteyourfriendsandgetapremiumaccount")}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex w-full flex-col">
            <Tabs
              size="lg"
              fullWidth
              color="primary"
              aria-label="Options"
              selectedKey={selected}
              //@ts-ignore
              onSelectionChange={setSelected}
            >
              <Tab key="task" title={t("task")}>
                <Card>
                  <CardBody>
                    {TaskList.map((value, index) => (
                      <TaskCard
                        key={index}
                        title={value.title}
                        description={value.description}
                        reward={value.reward}
                        type={value.type}
                        isDaily={value.isDaily}
                      />
                    ))}
                  </CardBody>
                </Card>
              </Tab>
              

              <Tab
                  key="stars"
                  title={
                    <p className="text-md flex items-center gap-1">
                       ⭐️ Stars
                    </p>
                  }
                >
                  <Card>
                    <CardBody>
                      {StarPeymentList.map((value, index) => (
                        <StarsCard
                          key={index}
                          title={value.title}
                          description={value.description}
                          price={value.price}
                          energy={value.energy}
                          icon={value.icon}

                        />
                      ))}
                    </CardBody>
                  </Card>
                </Tab>
                
                <Tab
                  key="ton"
                  isDisabled={["ios"].includes(lp.platform)? true : false}
                  title={
                    <p className="text-md flex items-center gap-1">
                      <TonCoinIcon className="size-5" /> Ton
                    </p>
                  }
                >
                  <Card>
                    <CardBody>
                      <Button className="mb-2" startContent={<WalletIcon className="size-5"/>} onPress={handleWalletAction} color="primary" variant="shadow">
                      {tonConnectUI.connected? t("disconnect_wallet_text") : t("connect_wallet_text")}
                      </Button>
                      {TonPaymentList.map((value, index) => (
                        <EnergyCard
                          key={index}
                          title={value.title}
                          description={value.description}
                          price={value.price}
                          energy={value.energy}
                          tonConnectUIInstance={tonConnectUI}
                          icon={value.icon}

                        />
                      ))}
                    </CardBody>
                  </Card>
                </Tab>
              

            </Tabs>
          </div>
          <p className="text-xs px-3">{t("description_for_energy")}</p>
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

export default EnergyViewPage;
