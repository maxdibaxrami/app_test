import "./style.css"
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import FinalStepAuth from "@/components/auth/finalStep";
import { Page } from "@/components/Page";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateUserData } from "@/features/userSlice";
import { useTranslation } from "react-i18next";
import SecondaryButton from "@/components/miniAppButtons/secondaryButton";
import MainButton from "@/components/miniAppButtons/MainButton";
import { SparklesText } from "@/components/animate/sparkles";
import LookingforList from "@/components/core/WhyIamHereAuthList";
import SelectCity from "@/components/auth/CitySelector";
import { useNavigate } from "react-router-dom";
import RealationStatusAuth from '@/components/auth/RealationStatusAuth';
import InterestingAuth from "@/components/auth/interstingAuth";
import HeightAuth from "@/components/auth/HeightAuth";
import LanguageAuth from "@/components/auth/languagesAuth";
import SmokingListSelector from "@/components/core/smoking";
import PetsListSelector from "@/components/core/pets";
import KidsListSelector from "@/components/core/kids";
import DrinkListSelector from "@/components/core/drink";

export default function EditProfileStepper() {


  const { t } = useTranslation();
  const { data } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const lp = useLaunchParams();

  const dispatch = useDispatch<AppDispatch>();
  const [uploadImageLoading, setUploadImageLoading] = useState(true)

  
  const [selectedTab, setSelectedTab] = useState(0);
  const [nextSlideAvalable, setNextSlideAvalable] = useState(false)
  const [showError, setShowError] = useState(false)

  const [selectedCityKeys, setSelectedCityKeys] = useState(new Set([]));

  const selectedValueCityList = useMemo(() => Array.from(selectedCityKeys).join(", "), [selectedCityKeys]);


  const [user, setUser] = useState({
    city:null,
    country:null,
    profileStage:"complete2",
    selectedCityInputValue: new Set([]),
    lookingFor:null,
    interests:[],
    height:null,
    languages:[],
    smoking:null,
    pets:null,
    kids:null,
    drink:null
  });
  
  useEffect(()=>{
    console.log(user)
  },[user])
  const setSlideAvailable = (key, value) => {
    setNextSlideAvalable(true)
    setUser((prevUser) => ({
      ...prevUser,  // Spread the previous state to keep other fields unchanged
      [key]: value, // Dynamically update the specific key with the new value
    }));
  }

  const setSlideUnAvailable = (key, value) => {
    setNextSlideAvalable(false)
    setUser((prevUser) => ({
      ...prevUser,  // Spread the previous state to keep other fields unchanged
      [key]: value, // Dynamically update the specific key with the new value
    }));
  }

  const NextPage = () => setSelectedTab(selectedTab + 1);
  
  const prevPage = () => {
    if(selectedTab === 0 ) 
      return 
    setSelectedTab(selectedTab - 1)
  };

  const handleSignup = async () => {
    setUploadImageLoading(true);

    try {
      // Destructure unwanted keys and gather the rest into "restUser"
      const { selectedCityInputValue, ...restUser } = user;
  
      // Conditionally add referralCode only if it has 3 or more characters
      const userData = {
        ...restUser
      };
  
      // Dispatch the signup action
      await dispatch(updateUserData({
        userId: data.id.toString(),
        updatedData: userData
      }));
  
    } catch (error) {
      console.error("Error during signup or image upload:", error);
    } finally {
      // Ensure loading is turned off regardless of the outcome
      setUploadImageLoading(false);
      navigate('/edit-profile-stepper')
    }
  };
  
  
  



  return (
    <Page back={true}>
        <motion.div className="flex flex-col justify-between">
          {['android', 'ios'].includes(lp.platform) ? <div className="top-bar-height w-full safe-area-top"></div> : null}
        {
        selectedTab !== 0 ?
        ['android', 'ios'].includes(lp.platform) ? 
          <div className="fixed top-0 w-full flex items-center justify-center top-bar-height safe-area-top text-center"> 
            <SparklesText sparklesCount={10} className="text-xl" text="FACE MATCH" /> 
          </div> 
          :
          <div style={{marginTop:"20px", height:"20px"}} className="flex w-full items-center justify-center text-center"> 
            <SparklesText sparklesCount={10} className="text-xl" text="FACE MATCH" /> 
          </div> 
        :
        null
        }
          <div style={{ overflow:"scroll" }} className="w-full">
        
            <div className={selectedTab === 0 ? "fade-in" : ""}>
            {selectedTab === 0 && (
              <>
                <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                  <p className="text-base font-semibold text-center">{t("locationTitle")} 📍</p>
                  <p className="text-xs text-center">{t("locationDescription")}</p>
                </div>
                <SelectCity 
                    selectedValueCityList={selectedValueCityList} 
                    setSelectedCityKeys={setSelectedCityKeys} 
                    selectedCityKeys={selectedCityKeys} 
                    showError={showError} 
                    user={user} 
                    setSlideAvailable={setSlideAvailable} 
                    setSlideUnAvailable={setSlideUnAvailable} 
                />
              </>
            )}
            </div>

            <div className={selectedTab === 1 ? "fade-in" : ""}>
              {selectedTab === 1 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <LookingforList showError={showError} user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

            <div className={selectedTab === 2 ? "fade-in" : ""}>
              {selectedTab === 2 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <RealationStatusAuth user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>


            <div className={selectedTab === 3 ? "fade-in" : ""}>
              {selectedTab === 3 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <InterestingAuth user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

            <div className={selectedTab === 4 ? "fade-in" : ""}>
              {selectedTab === 4 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <HeightAuth user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

            <div className={selectedTab === 5 ? "fade-in" : ""}>
              {selectedTab === 5 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <LanguageAuth user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

            <div className={selectedTab === 6 ? "fade-in" : ""}>
              {selectedTab === 6 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <SmokingListSelector user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

            <div className={selectedTab === 7 ? "fade-in" : ""}>
              {selectedTab === 7 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <PetsListSelector user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>


            <div className={selectedTab === 8 ? "fade-in" : ""}>
              {selectedTab === 8 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <KidsListSelector user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

            <div className={selectedTab === 9 ? "fade-in" : ""}>
              {selectedTab === 9 && (
                <>
                  <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                    <p className="text-base font-semibold text-center">{t("whyTitle")} 🤔</p>
                    <p className="text-xs text-center">{t("whyDescription")}</p>
                  </div>
                  <DrinkListSelector user={user} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

          
            
            
            <div className={selectedTab === 10 ? "fade-in" : ""}>
              {selectedTab === 10 && (
                <>
                  <FinalStepAuth uploadImageLoading={uploadImageLoading} setSlideAvailable={setSlideAvailable} setSlideUnAvailable={setSlideUnAvailable} />
                </>
              )}
            </div>

            
          </div>

          {/* Wrapping BottomController in motion.div for smooth position changes */}
         
          <MainButton
            text={t('Next')}
            backgroundColor="#1FB6A8"
            textColor="#FFFFFF"
            hasShineEffect={nextSlideAvalable}
            isEnabled={ selectedTab === 10 ? false : true} 
            isLoaderVisible={false}
            isVisible={selectedTab !== 10}
            onClick={()=>{
              if(selectedTab === 9 ){
                  handleSignup()
              }
              if(nextSlideAvalable){
                NextPage()
                setShowError(false)
                return
              }else{
                setShowError(true)
                return
              }
            
              }
            }
          />
          <SecondaryButton
            text={t('previous')}
            backgroundColor="#000000"
            textColor="#FFFFFF"
            hasShineEffect={false}
            isEnabled={selectedTab === 10 ? false : true} 
            isLoaderVisible={false}
            isVisible={
              !(selectedTab === 0 || selectedTab === 10)
            }
            position="left"
            onClick={prevPage}
          />
        
          <SecondaryButton
            text={t('skip')}
            backgroundColor="#000000"
            textColor="#FFFFFF"
            hasShineEffect={false}
            isEnabled={selectedTab <= 2 && selectedTab >=10 ? false : true} 
            isLoaderVisible={false}
            isVisible={
              !(selectedTab === 0 || selectedTab === 2 || selectedTab === 1)
            }
            position={selectedTab <= 2 ? "left" : "bottom" }
            onClick={NextPage}
          />
        
        
         
        </motion.div>
    </Page>
  );
}
