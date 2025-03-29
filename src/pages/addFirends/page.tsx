import TopBarPages from "@/components/tobBar/index";
import { Page } from "@/components/Page";
import { useLaunchParams, shareURL } from "@telegram-apps/sdk-react";
import { motion } from "framer-motion";
import { addToast, Button, Card, CardHeader,CircularProgress,Image, Listbox, ListboxItem, ListboxSection, Spinner } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { AddFirendsIcon } from "@/Icons";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { fetchReferralUsersData } from "@/features/refralSlice";

export default function AddFirends() {

  const lp = useLaunchParams();
  const { t } = useTranslation(); // Initialize translation hook


  const dispatch = useDispatch<AppDispatch>();

  const { data: referral, refraledUserData, loading, lrefraledUserDataoading } = useSelector((state: RootState) => state.referral);
  const { data: user} = useSelector((state: RootState) => state.user);

  const amoutPerUser = user.premium? 0.12 : 0.1 ;


  useEffect(() => {
    dispatch(fetchReferralUsersData(user.id.toString()));
  }, []);

  const getPaddingForPlatform = () => {
    return lp.platform === 'ios' ? '50px' : '25px'; // Padding for different platforms
  };

  const AddFirendsDialog = () => {
    if (shareURL && referral) {
      // Only share when referral is available
      shareURL(referral, t("share_link"));
    } else {
      console.error('shareURL is not available or referral data is missing');
    }
  };


  const ActiveUsers = useMemo(() => {
    if(refraledUserData !== null || refraledUserData.length !== 0){
      return refraledUserData.filter(item => item.activityScore >= 80).length 
    }
  }, [refraledUserData]);

  return (
    <Page>
      <div
        className="container mx-auto max-w-7xl flex-grow h-screen"
        style={{ marginBottom: "5rem" }}
      >
        <TopBarPages />
        <section
          className="flex flex-col px-6 items-center justify-center"
          style={{ paddingTop: `calc(4rem + ${getPaddingForPlatform()})` }}
        >


            {loading || lrefraledUserDataoading ? (
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.6 } }}
                className="flex items-center h-[90vh] justify-center"
              >
                <Spinner size="lg" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.6 } }}
              >
                <p className="font-semibold text-center text-sm">
                  {t("Inviteyourfriendsandgetapremiumaccount")}
                </p>

                <p className="my-1 text-center text-xs">
                  {t("activity_based_claim_text")}
                </p>
                <div className="flex flex-col">
                  <Button
                        className="mt-3 w-full text-white"
                        radius="sm"
                        onPress={AddFirendsDialog}
                        color="success"
                        startContent={<AddFirendsIcon fill="#FFF"/>}
                      >
                        {t("share_link")}
                  </Button>
                </div>

                  <Card className="w-full mt-2">
                    <CardHeader className="justify-between">
                      <div className="flex gap-5">
                        <Image
                            alt="heroui logo"
                            height={40}
                            radius="sm"
                            src="/assets/toncoin-ton-logo.png"
                            width={40}
                          />
                        <div className="flex flex-col gap-1 items-start justify-center">
                          <h4 className="text-small font-semibold leading-none text-default-600">{t("how_much_earn_text")}</h4>
                          <h5 className="text-small tracking-tight text-default-400">{ActiveUsers * amoutPerUser} TON</h5>
                          <p className="text-xs text-success/80">{`${amoutPerUser} TON ${t("per_active_user_text")}`}</p>

                        </div>
                      </div>
                      <Button
                        color="primary"
                        radius="full"
                        size="sm"
                        onPress={() => {
                          if(ActiveUsers * amoutPerUser < 5 ){
                            addToast({
                              title: t("error_text"),
                              description: t("claim_reward_text"),
                              color: "danger",
                            });
                          } else{
                            addToast({
                                    title: "",
                                    description: "feature are developing. that will add comming soon ...",
                                    color: "danger",
                                  });
                          }
                        }}
                        variant={"solid"}
                      >
                         {t("claim")}
                      </Button>

                    </CardHeader>
                  </Card>
                  <ListboxWrapper>
                  <Listbox title="ds" aria-label="Dynamic Actions">
                    <ListboxSection title={t('referral_user_text')}>
                      {refraledUserData.map((item:any) => (
                        <ListboxItem
                        key={item.id}
                        isReadOnly
                        endContent={
                          <CircularProgress
                              aria-label="Loading..."
                              color={item.activityScore >= 80 ? "success" :"warning"}
                              showValueLabel={true}
                              size="sm"
                              disableAnimation
                              value={item.activityScore}
                            />
                        }
                      >
                        {item.firstName}
                      </ListboxItem>
                      ))}
                    </ListboxSection>
                  </Listbox>

                </ListboxWrapper>

                  <p className="text-xs my-2">{t("activity_based_claim_text")}</p>


                
              </motion.div>
            )}

        </section>
      </div>
    </Page>
  );
}


export const ListboxWrapper = ({children}) => (
  <div className="w-full mt-4 border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);
