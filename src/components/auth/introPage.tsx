import { Chip, Avatar } from "@heroui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { cloudStorage } from '@telegram-apps/sdk';
import FontHandller from "../FontHandller";
import { SparklesText } from "../animate/sparkles";
import { useLaunchParams } from "@telegram-apps/sdk-react";


const IntroPage = ({ setSlideUnAvailable, setSlideAvailable, user }) => {
  const { t, i18n } = useTranslation();
  const lp = useLaunchParams();

  const [isSelected, setIsSelected] = useState(i18n.language); // Initialize empty, we'll set this in useEffect

  // Function to change language in i18n
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Function to retrieve language from cloud storage or local storage
  const GetStoredLanguage = async () => {
    if (cloudStorage.isSupported()) {
      const storedLang = await cloudStorage.getItem('lang');
      return storedLang || ''; // Return empty string if no language is stored
    } else {
      // Fallback to localStorage
      return localStorage.getItem('lang') || ''; // Return empty string if nothing in localStorage
    }
  };

  // Function to store selected language in cloud storage or localStorage
  const StoreLanguage = async (lang) => {
    if (cloudStorage.isSupported()) {
      await cloudStorage.setItem('lang', lang);
    } else {
      // Fallback to localStorage
      localStorage.setItem('lang', lang);
    }
  };

  // Effect to load stored language on component mount
  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = await GetStoredLanguage();
      if (storedLang) {
        setIsSelected(storedLang); // Set the stored language as default
        changeLanguage(storedLang); // Apply the language in i18n
      } else if (user.language) {
        setIsSelected(user.language); // Fallback to user's language if no stored language
        changeLanguage(user.language);
      }
    };

    loadLanguage();

    document.documentElement.lang = isSelected;
    document.documentElement.dir = ['ar', 'fa'].includes(isSelected) ? 'rtl' : 'ltr';
    FontHandller();
    
  }, [user.language]); // Run once when the component mounts

  // Effect to handle changes in the selected language
  useEffect(() => {
    if (isSelected) {

      changeLanguage(isSelected); // Change the language in i18n
      setSlideAvailable("language", isSelected); // Notify that language is selected
      StoreLanguage(isSelected); // Store selected language in cloud storage or localStorage
 
    } else {
      setSlideUnAvailable("language", isSelected); // Handle case when no language is selected
    }

    document.documentElement.lang = isSelected;
    document.documentElement.dir = ['ar', 'fa'].includes(isSelected) ? 'rtl' : 'ltr';
    FontHandller();
  }, [isSelected]);

  return (
    <div className="flex items-center justify-between h-full px-6 flex-col pb-2">
      <div className=" flex flex-col gap-8">
        {['android', 'ios'].includes(lp.platform) ? null : <div style={{marginTop:"50px"}}></div>}
        <div className="flex items-center justify-center flex-col text-center">
          <img className="mb-4" style={{height:"70px"}} src="/assets/icon.png"/>
          <SparklesText className="text-5xl" sparklesCount={15} text="FACE MATCH" />
        </div>
        <p className="text-center text-sm">{t("login_description")}</p>
        <div>
          <p className="mb-2 text-center font-semibold text-medium">
            {t('Selectlanguageforcontinue')}
          </p>

          <motion.ul
            animate="visible"
            className="container flex gap-2 items-center justify-center flex-wrap"
          >
            <motion.li className="item">
              <Chip
                avatar={
                  <Avatar radius="sm" name="en" size="md" src="/assets/gb.svg" />
                }
                size="lg"
                radius="md"
                variant="solid"
                classNames={{"content":"font-semibold"}}
                onClick={() => setIsSelected("en")}
                color={isSelected === "en"? "primary":"default"}

              >
                English
              </Chip>
            </motion.li>

            <motion.li className="item">
              <Chip
                avatar={
                  <Avatar radius="sm" name="ru" size="md" src="/assets/ru.svg" />
                }
                size="lg"
                variant="solid"
                radius="md"
                onClick={() => setIsSelected("ru")}
                classNames={{"content":"font-semibold"}}
                color={isSelected === "ru"? "primary":"default"}

              >
                Russian
                
              </Chip>
            </motion.li>

            <motion.li className="item">
              <Chip
                avatar={
                  <Avatar radius="sm" name="fa" size="md" src="/assets/ir.svg" />
                }
                size="lg"
                variant="solid"
                onClick={() => setIsSelected("fa")}
                color={isSelected === "fa"? "primary":"default"}
                classNames={{"content":"font-semibold"}}
                radius="md"

              >
                Farsi
              </Chip>
            </motion.li>

            <motion.li className="item">
              <Chip
                avatar={
                  <Avatar radius="sm" name="ar" size="md" src="/assets/sa.svg" />
                }
                size="lg"
                variant="solid"
                color={isSelected === "ar"? "primary":"default"}
                onClick={() => setIsSelected("ar")}
                radius="md"
                classNames={{"content":"font-semibold"}}
              >
                Arabic
              </Chip>
            </motion.li>
          </motion.ul>
        </div>

        <p>
          <p className="text-center text-xs">{t("privacy_policy")}</p>

        </p>

      </div>
    </div>
  );
};

export default IntroPage;
