import { Button, ButtonGroup, Input, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ProfileDataAuth = ({ setSlideAvailable, setSlideUnAvailable, user, showError }) => {
  const { t } = useTranslation();

  // States for handling profile data
  const [gender, setGender] = useState(user.gender);
  const [name, setName] = useState(user.firstName || "");
  const [bio, setBio] = useState(user.bio || "");


  // Check form validity to allow slide changes (name, bio, date of birth)
  useEffect(() => {
    if (name.length > 2 && bio.length > 2 && name.length < 18 && bio.length < 100 && gender) {
      setSlideAvailable("firstName", name);
      setSlideAvailable("bio", bio);
      setSlideAvailable("gender", gender);

    } else {
      setSlideUnAvailable();
    }
  }, [name, bio, gender]);

  return (
    <div className="flex justify-between flex-col px-6 pb-4">
      <form className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-4">

        <div>
          <p className="text-sm mt-2 mb-1">{t("Iam")}</p>
          <ButtonGroup color="danger" className="w-full">
            <Button onPress={()=> setGender("male")} color={gender === "male" ? "primary" : "default"} className="w-[50%]">{t("Male")}</Button>
            <Button onPress={()=> setGender("female")} color={gender === "female" ? "primary" : "default"}  className="w-[50%]">{t("Female")}</Button>
          </ButtonGroup>
          {showError && !gender &&
            <p className="text-xs mt-1 text-danger">{t("select_your_gender")}</p>
          }

        </div>
        {/* Input for Name */}
        
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
          label={t('name')}
          type="text"
          color="default"
          className="w-full"
          labelPlacement="inside"
          errorMessage={t('min_max_2_18')}
          isInvalid={showError && name.length <= 2 || name.length >= 18}
          placeholder={`${t('EnteryourBio')}`}          
        />

        {/* Textarea for Bio */}
        <Textarea
          className="w-full"
          label={t('Bio')}
          isRequired
          value={bio}
          color="default"
          labelPlacement="inside"
          onChange={(e) => setBio(e.target.value)}
          errorMessage={t('min_max_2_100')}
          isInvalid={showError && bio.length <= 2 || bio.length >= 100}
          placeholder={`${t('EnteryourBio')} ${t('min_max_2_100')}`}
        />

        {/* Date Picker for Date of Birth */}
       

        </div>
      </form>
    </div>
  );
};

export default ProfileDataAuth;
