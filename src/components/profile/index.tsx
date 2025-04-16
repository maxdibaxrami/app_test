import {  User, Button, cn, Card, CardFooter} from "@heroui/react";
import {
  VerifyIconFill,
  PerimumIcon,
} from "@/Icons/index";

import DataList from "./dataList";
import { Link } from "react-router-dom";

import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTranslation } from "react-i18next";
import { ProfileBackgroundSvg } from "@/Icons/profileBackgroundSVG";
import { motion } from "framer-motion";
import ProfileActivityCard from "./profileActivity";

const ProfilePage = () => {
  
  const { t } = useTranslation();

  const { data: user, verifiedAccountLoading } = useSelector((state: RootState) => state.user);

  return (
    <div
      className="relative w-screen px-5 h-full pb-16 text-default-700"
      style={{
        maxHeight: "100%",
        height:"100%",
        marginTop:"6.5rem",
        marginBottom:"3rem",
      }}
    >
      <motion.div transition={{ delay: 2 , duration: 2 }} initial={{opacity:0}} animate={{opacity:1}} className="absolute h-full dark:opacity-70 -top-[80px] inset-0 flex items-center z-[-10]">
        <ProfileBackgroundSvg/>
      </motion.div>
      <div className="flex mb-1 w-full justify-between items-center">
        <div className="flex w-full flex-col">
        <User
            avatarProps={{
              src:user.photos[0]? user.photos[0].smallUrl : null,
              color:"primary",
              className:"w-20 h-20 rounded-xl"
            }}
            classNames={{
              "name":"text-xl px-2 py-1 font-bold",
              "description":"px-2 py-1",
            }}
            description={
              <div className="flex gap-2">
                <Button color="primary" className="font-semibold text-white"  variant="shadow" as={Link} to={`/profile-edit`} size="sm">{t('edit_profile')}</Button>
                <Button color="secondary" className="font-semibold" as={Link} to="/setting" variant="solid" size="sm">
                  {t('Setting')}
                </Button>
              </div>
            }
            name={<p className="flex align-center">
              <span>{user.firstName} </span> , <span>{user.age} </span> {user.verifiedAccount && < VerifyIconFill fill="#21b6a8" className="mx-0.5 size-6" />} {user.premium && <PerimumIcon />}</p>}
          />
        </div>
      </div>

      <div className="mt-8">
        <Card shadow="none" isPressable as={Link} to={"/add-friends"} className="border-1 border-default-200 dark:border-default-100  backdrop-blur bg-neutral/10" radius="lg">
          <div className="flex items-center p-2 h-full">
              <div>
                <p className="text-4xl p-3">👫</p>
              </div>
              <div>
                  <p className="font-bold">{t("invite_your_friend")}</p>
                  <p className="text-xs">{t("Inviteyourfriendsandgetapremiumaccount")}</p>
              </div>

          </div>
        </Card>
      </div>
      <div className="grid gap-2 mt-2 grid-cols-3 sm:grid-cols-3">

        <ProfileActivityCard/>

        <Card shadow="none" as={Link} to={'/energy'} className="border-1 border-default-200 dark:border-default-100 border-default-200 dark:border-default-100 backdrop-blur aspect-square bg-neutral/10" radius="lg">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-4xl">🔋</p>
            <CardFooter className="justify-center border-none overflow-hidden py-1 absolute before:rounded rounded bottom-1 w-full z-10">
              <p className="font-semibold text-sm text-center">{t("energy")}</p>
            </CardFooter>
          </div>
        </Card>

        <Card as={Link} to={'/premium-Page'} shadow="none" className="border-1 border-default-200 dark:border-default-100 backdrop-blur aspect-square bg-neutral/10" radius="lg">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-4xl">⭐️</p>
            <CardFooter className="justify-center border-none overflow-hidden py-1 absolute before:rounded rounded bottom-1 w-full z-10">
              <p className="font-semibold text-sm text-center">{t("premium_account")}</p>
            </CardFooter>
          </div>
        </Card>

      </div>  
      <DataList user={user} verifiedAccountLoading={verifiedAccountLoading}/>
    </div>
  );
};


export const IconWrapper = ({children, className}) => (
  <div style={{borderRadius:"50%"}} className={cn(className, "flex items-center  rounded-small justify-center p-2")}>
    {children}
  </div>
);

export default ProfilePage;
