import { Avatar } from "@heroui/react";
import {  motion } from "framer-motion";
import {  useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";
import { getStaticData } from "@/constant";
import React from "react";
// Static Data moved outside component for better memoization


const ExploreCartData = ({ profile, openFooter }) => {

  const { t } = useTranslation();
  const [slideCount, setSlideCount] = useState(0);

  // Memoize static data to avoid recalculating on every render
  const staticData = useMemo(() => getStaticData(t), [t]);



  const profileItems = useMemo(() => [
    {
      key: 1,
      color: "default",
      icon: <p className="text-xl p-1">👨‍🎓</p>,
      label: t("Education"),
      text: profile?.profileData.education
    },
    {
      key: 2,
      color: "primary",
      icon: <p className="text-xl p-1">📝</p>,
      label: `${t("Bio")}`,
      text: profile.profileData.bio,
    },
    {
      key: 3,
      color: "success",
      // Now you can render the icon component here as JSX
      icon: staticData.Items.find(item => item.id === profile.profileData.lookingFor)?.icon && 
            React.createElement(staticData.Items.find(item => item.id === profile.profileData.lookingFor)?.icon, { className: "size-6" }),
      label: t("lookingFor"),
      text: staticData.Items.find(item => item.id === profile.profileData.lookingFor)?.title,
    },
    {
      key: 4,
      color: "secondary",
      icon: <p className="text-xl text-white p-1">💼</p>,
      label: t("work_text"),
      text: profile.profileData.work.replace("_"," "),
    },
  ].filter((value) => value.text), [profile, staticData.Items, t]);

  const currentSlide = useMemo(() => slideCount % profileItems.length, [slideCount, profileItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideCount((prev) => prev + 1); // Update slide count every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);
  
  const ProfileCard = useMemo(() => ({ color, icon, label, text }) => {
    return (
      <motion.div
        className="flex gap-3 mt-1"
        initial={openFooter ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex items-center justify-center">

          <Avatar
            color={color}
            radius="lg"
            icon={icon}
            size="md"
            classNames={{
              icon: "text-white/90 size-6",
            }}
          />
          
        </div>
        <div className="flex flex-col">
          <p className="text-small text-white font-bold">{label}</p>
          <p className="text-xs text-white">{text}</p>
        </div>
      </motion.div>
    );
  }, [openFooter, profile]);

  
  return (
    <div>

      <ProfileCard {...profileItems[currentSlide]} />
    </div>
  );
};

// Prop Types
ExploreCartData.propTypes = {
  slideCount: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
  openFooter: PropTypes.bool.isRequired,
};



export default ExploreCartData;
