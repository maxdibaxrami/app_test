import "./style.css"
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import FinalStepAuth from "@/components/auth/finalStep";
import { Page } from "@/components/Page";
import { useLaunchParams, useSignal, initData } from "@telegram-apps/sdk-react";
import { signupUser } from "@/features/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchUserData } from "@/features/userSlice";
import { useTranslation } from "react-i18next";
import SecondaryButton from "@/components/miniAppButtons/secondaryButton";
import MainButton from "@/components/miniAppButtons/MainButton";
import { SparklesText } from "@/components/animate/sparkles";
import LookingforList from "@/components/core/WhyIamHereAuthList";
import SelectCity from "@/components/auth/CitySelector";

export default function EditProfileStepper() {


  const { t } = useTranslation();
  const { data } = useSelector((state: RootState) => state.user);

  const lp = useLaunchParams();

  const dispatch = useDispatch<AppDispatch>();
  const initDataState = useSignal(initData.state);
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
    try {
  
      // Destructure unwanted keys and gather the rest into "restUser"
      const { selectedCityInputValue, ...restUser } = user;
  
      // Conditionally add referralCode only if it has 3 or more characters
      const userData = {
        ...restUser
      };
  
      // Dispatch the signup action
      const result = await dispatch(signupUser({ userData, id: data.id }));
  
      // Check if signup was successful, then fetch updated user data
      if (signupUser.fulfilled.match(result)) {
        await dispatch(fetchUserData(initDataState.user.id.toString()));
      }
    } catch (error) {
      console.error("Error during signup or image upload:", error);
    } finally {
      // Ensure loading is turned off regardless of the outcome
      setUploadImageLoading(false);
    }
  };
  
  
  



  return (
    <Page back={false}>
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
                  <p className="text-base font-semibold text-center">{t("Birthdate")} 📆</p>
                  <p className="text-xs text-center">{t("dob_prompt")}</p>
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
            isEnabled={ selectedTab === 2 ? false : true} 
            isLoaderVisible={false}
            isVisible={selectedTab !== 2}
            onClick={()=>{
              if(selectedTab === 2 ){
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
            isEnabled={selectedTab === 2 ? false : true} 
            isLoaderVisible={false}
            isVisible={
              !(selectedTab === 0 || selectedTab === 2)
            }
            position="left"
            onClick={prevPage}
          />
        
        
         
        </motion.div>
    </Page>
  );
}
