import { Avatar } from "@heroui/react";
import {  motion } from "framer-motion";
import {  useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import {
  HashtagIcon
} from "@/Icons";
import { Listbox, ListboxSection, ListboxItem, Chip } from "@heroui/react";
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
      text: profile.profileData.education.replace("_"," "),
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
      icon: <p className="text-xl p-1">💼</p>,
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
          <p className="text-small font-bold">{label}</p>
          <p className="text-xs text-default-500">{text}</p>
        </div>
      </motion.div>
    );
  }, [openFooter]);

  
  return (
    <div>
        {openFooter ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0}}
            style={{textAlign:"start"}}
          >
            {/* More About Me Section */}
            <motion.div
              className="w-full mb-4 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Listbox classNames={{"base":"mx-0 px-0"}} className="py-2" style={{ borderRadius: "8px" }} aria-label={t("moreAboutMe")}>
                <ListboxSection classNames={{"heading":"font-bold"}} title={t("profile")}>
                  <ListboxItem classNames={{"title":"flex flex-col px-1 gap-2 py-0 flex-wrap","base":"px-0"}} isReadOnly >
                    {profileItems.map(item => (
                      <ProfileCard
                        key={item.key}
                        color={item.color}
                        icon={item.icon}
                        label={item.label}
                        text={item.text}
                      />
                    ))}
                  </ListboxItem>
                </ListboxSection>
                <ListboxSection classNames={{"heading":"font-bold"}} title={t("moreAboutMe")}>
                  <ListboxItem 
                    classNames={{"title":"flex px-1 gap-2 py-0 flex-wrap","base":"px-0"}}
                    isReadOnly
                    >

                  {[
                    { icon: <p className="text-md p-1">👩‍❤️‍👨</p> , color: "primary", label: t("relationStatus"), description: staticData.RealationStatus.find(status => status.key === profile.moreAboutMe.relationStatus)?.label },
                    { icon: <p className="text-md p-1">📏</p>, color: "secondary", label: t("height"), description: `${profile.moreAboutMe.height} cm` },
                    { icon: <p className="text-md p-1">🈶</p>, color: "success", label: t("language"), description: profile.moreAboutMe.languages.map(lang => staticData.languages.find(l => l.key === lang).label).join(", ") },
                    { icon: <p className="text-md p-1">🌈</p>, color: "warning", label: t("sexuality"), description: staticData.SexualityStatus.find(sex => sex.key === profile.moreAboutMe.sexuality)?.label },
                    { icon: <p className="text-md p-1">👦</p>, color: "danger", label: t("kids"), description: staticData.KidStatus.find(kid => kid.key === profile.moreAboutMe.kids)?.label },
                    { icon: <p className="text-md p-1">🚬</p>, color: "primary", label: t("SmokingStatus"), description: staticData.SmokingStatus.find(smoke => smoke.key === profile.moreAboutMe.smoking)?.label },
                    { icon: <p className="text-md p-1">🥃</p>, color: "secondary", label: t("DrinkStatus"), description: staticData.DrinkStatus.find(drink => drink.key === profile.moreAboutMe.drink)?.label },
                    { icon: <p className="text-md p-1">🐶</p>, color: "success", label: t("PetStatus"), description: staticData.PetStatus.find(pet => pet.key === profile.moreAboutMe.pets)?.label },
                  ].map((item, idx) => (
                          // @ts-ignore
                      <Chip className="mx-0" size="md" key={idx} color={item.color} startContent={item.icon} variant="shadow">
                      {item.description}
                    </Chip>
                  ))}

                  </ListboxItem>
                </ListboxSection>
                <ListboxSection classNames={{"heading":"font-bold"}}  title={t("interests")}>
                  {Array.isArray(profile.interests) && profile.interests.length > 0 && (
                    <ListboxItem isReadOnly className="px-0" key={"asddsa123"}>
                      <div className="flex flex-wrap">
                        {profile.interests.map((interest, index) => (
                          <Chip key={index} className="m-1 bg-neutral/40" startContent={<HashtagIcon className="size-4" />} variant="solid">
                            {staticData.hobbies.find(hobbie => hobbie.id == parseInt(interest))?.name}
                          </Chip>
                        ))}
                      </div>
                    </ListboxItem>
                  )}
                </ListboxSection>

                {profile?.question1 && profile?.question1 !== null &&

                  <ListboxSection                   
                    classNames={{"heading":"font-bold"}} 
                    className="relative" 
                    title={t("weekend_getaway_text")}>
                        <ListboxItem
                          key={32132231}
                          className="px-1 py-0"
                        >
                          <p className="text-md">{profile?.question1}</p>
                        </ListboxItem>

                  </ListboxSection>
                  }


                  {profile?.question2 && profile?.question2 !== null &&

                  <ListboxSection                   
                    classNames={{"heading":"font-bold"}} 
                    className="relative" 
                    title={t("dinner_question_text")}>
                        <ListboxItem
                          key={32178321}
                          className="px-1 py-0"
                        >
                          <p className="text-md">{profile?.question2}</p>
                        </ListboxItem>

                  </ListboxSection>
                  }

                  {profile?.instagram && profile?.instagram !== null &&

                  <ListboxSection                   
                    classNames={{"heading":"font-bold"}} 
                    className="relative" 
                    title={t("instagram_text")}>
                        <ListboxItem
                          key={32178321}
                          className="px-1 py-0"
                        >
                          <p className="text-md">{profile?.instagram}</p>
                        </ListboxItem>

                  </ListboxSection>
                  }


                  <ListboxSection                   
                    classNames={{"heading":"font-bold"}} 
                    className="relative" 
                    title={t("location")}>
                        <ListboxItem
                          key={38321}
                          className="px-1 py-0"
                        >
                          <p className="text-md">{`${profile.country}, ${profile.city}`}</p>
                        </ListboxItem>

                  </ListboxSection>
              </Listbox>
            </motion.div>
          </motion.div>
        ) : (
          <ProfileCard {...profileItems[currentSlide]} />
        )}
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
