import {
    Slider,
    SliderValue,
  } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
  
const HeightAuth = ({setSlideAvailable, setSlideUnAvailable, user}) => {
    const { t } = useTranslation();
    const [value, setValue] = useState<SliderValue>(user.moreAboutMe.height || user.height);

    useEffect(()=>{
      if(value !== null ){
        setSlideAvailable("height",value)
      }else{
        setSlideUnAvailable("height",value)
      }
  
    },[value])
    
    return (
      <div className="flex  justify-between flex-col px-6 pb-4">
        <form className="flex w-full flex-col gap-4">
                <Slider
                  color="primary"
                  label={t('Height')}
                  maxValue={250}
                  getValue={(a) => `${a} cm`}
                  minValue={100}
                  size="lg"
                  value={value}
                  onChange={setValue}
                />
        </form>
      </div>
    );
  };
  

  
  export default HeightAuth;
  
