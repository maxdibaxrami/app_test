import { getRealationStatus } from "@/constant";
import {
    cn,
    Radio,
    RadioGroup,
  } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
  

  export const CustomRadio = (props) => {
    const {children, ...otherProps} = props;
  
    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "inline-flex py-2 m-0 w-full bg-foreground/20 hover:bg-content items-center justify-between",
            "flex-row-reverse max-w-[600px] cursor-pointer rounded-lg p-4 border-1 border-transparent",
            "data-[selected=true]:border-primary data-[selected=true]:bg-primary/10"
   
          ),
        }}
      >
        {children}
      </Radio>
    );
  };
  
const RealationStatusAuth = ({setSlideAvailable, setSlideUnAvailable, user}) => {
  const [selected, setSelected] = useState(user?.moreAboutMe? user.moreAboutMe.relationStatus : user.relationStatus );
  const { t } = useTranslation();

  const RealationStatus = getRealationStatus(t)
  
  useEffect(()=>{
    if(selected !==""){
      setSlideAvailable("relationStatus",selected)
      return
    }
    setSlideUnAvailable("relationStatus",selected)
  },[selected])
    return (
      <div className="flex  justify-between flex-col px-6  pb-4">
        <form className="flex w-full flex-col gap-4">
            <RadioGroup value={selected} onValueChange={setSelected} description={t('Selectedplancanbechangedatanytime')}>
                {RealationStatus.map((value)=> {
                    return <CustomRadio value={value.key}>
                    {value.label}
                </CustomRadio>
                })}
            </RadioGroup>
        </form>
      </div>
    );
  };
  

  
  export default RealationStatusAuth;
  

  