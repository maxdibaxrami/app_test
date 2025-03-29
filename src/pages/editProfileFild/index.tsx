import { useState, useEffect, useCallback, useMemo } from "react";
import TopBarPages from "@/components/tobBar/index";
import { Page } from "@/components/Page.tsx";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useTranslation } from "react-i18next";
import {
  ButtonGroup,
  Button,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Alert,
  addToast,
} from "@heroui/react";
import { SearchIcon } from "@/Icons";
import axios from "axios";
import axiosInstance from "@/api/base";
import SecondaryButton from "@/components/miniAppButtons/secondaryButton";
import MainButton from "@/components/miniAppButtons/MainButton";
import { useLocation, useSearchParams } from "react-router-dom";
// Import the thunk and rename to avoid conflict with state property
import { updateUserData } from "@/features/userSlice";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "next-themes";

// Define the City interface
interface City {
  name: string;
  country: string;
  lat?: string;
  lng?: string;
}

// Custom hook for debouncing a value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function EditProfilePageText() {
  const lp = useLaunchParams();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { theme } = useTheme();

  
  const {
    data: user,
    updateUserData: updatingUserData, // boolean flag from state
  } = useSelector((state: RootState) => state.user);

  // States for handling profile data
  const [gender, setGender] = useState(user?.gender || "");
  const [name, setName] = useState(user?.firstName || "");
  const [bio, setBio] = useState(user?.profileData.bio || "");
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [work, setWork] = useState(user?.profileData.work || "");

  // States for handling city selection
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [inputValue, setInputValue] = useState<string>(user?.city || "");
  
  const [cityList, setCityList] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [quastion1, setquastion1] = useState(user?.question1 || "");
  const [quastion2, setquastion2] = useState(user?.question2 || "");

  const [education, setEducation] = useState(user.profileData.education || "")
  const location = useLocation();

  const [searchParams] = useSearchParams();
  

  // Helper functions to update city & country values
  const setSlideAvailable = (key: string, value: any) => {
    if (key === "city") {
      setCity(value);
      setInputValue(value); // also update the input
    } else if (key === "country") {
      setCountry(value);
    }
  };

  const setSlideUnAvailable = (key: string, value: any) => {
    if (key === "city") {
      setCity("");
      setInputValue("");
    } else if (key === "country") {
      setCountry("");
    }
    console.log(value)
  };

  // On mount, prefill the city input if user data exists
  useEffect(() => {
    if (user?.city) {
      setInputValue(user.city);
      setSlideAvailable("city", user.city);
      setSlideAvailable("country", user.country);
    } else {
      setSlideUnAvailable("city", null);
      setSlideUnAvailable("country", null);
    }
  }, [user?.city, user?.country]);

  // Debounce the input value to avoid excessive API calls
  const debouncedInput = useDebounce(inputValue, 1000);

  // Fetch city list when debounced input changes and has at least 2 characters
  useEffect(() => {
    if (debouncedInput.trim().length < 2) {
      setCityList([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const source = axios.CancelToken.source();
    const endpoint = `https://copychic.ru/api/cities/search?name=${encodeURIComponent(
      debouncedInput
    )}`;
    axiosInstance
      .get(endpoint, { cancelToken: source.token })
      .then((response) => {
        setCityList(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.error("Error fetching cities:", error);
        }
        setCityList([]);
        setIsLoading(false);
      });
    return () => {
      source.cancel("Operation canceled due to new request.");
    };
  }, [debouncedInput]);

  // Helper: Get flag emoji from country code
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Map fetched city data into Autocomplete items
  const items = useMemo(() => {
    return cityList.map((city: City) => ({
      label: `${getFlagEmoji(city.country)} ${city.country}, ${city.name}`,
      value: city.name,
      country: city.country,
      lat: city.lat,
    }));
  }, [cityList]);

  // Handle changes to the Autocomplete input
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // When a city is selected, update the available values
  const handleSelectionChange = useCallback((country: string, city: string) => {
    setSlideAvailable("city", city);
    setSlideAvailable("country", country);
  }, []);

  // Calculate padding for platform (e.g., for notches)
  const getPaddingForPlatform = () => {
    if (["ios", "android"].includes(lp.platform)) {
      return "0px"; // Adjust as needed for iOS notch
    } else {
      return "0px";
    }
  };

  // PATCH request handler for updating user data
  const handleSave = () => {
    if(bio.length <= 2 || bio.length >= 100){
        addToast({
            title: `${t("EnteryourBio")}`,
            description: t("min_max_2_18"),
            color: "danger",
          })
          return
    }

    if(name.length <= 2 || name.length >= 18){
        addToast({
            title: t("name"),
            description: t("min_max_2_18"),
            color: "danger",
          })
          return
    }


    if (user) {
      const updatedData = {
        gender,
        firstName: name,
        bio,
        work,
        city,
        country,
        instagram,
        education,
        question1: quastion1,
        question2: quastion2,
      };

      // Dispatch the update thunk (PATCH)
      dispatch(updateUserData({ userId: user.id.toString(), updatedData }));
    }
    navigate(-1)
  };

  return (
    <Page>
      <div className="container mx-auto max-w-7xl flex-grow">
        <TopBarPages />
        <section
          className="flex flex-col items-center justify-center gap-1"
          style={{ paddingTop: `calc(5rem + ${getPaddingForPlatform()})` }}
        >
          <form className="flex w-full flex-col gap-2 px-6">
            {searchParams.get('page') === "input" && 
                <div className="flex flex-col gap-4">

                        <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                        <p className="text-base font-semibold text-center">{t("Fillprofiledata")} 📝</p>
                        <p className="text-xs text-center">{t("secondaryTextProfile")}</p>
                        </div>

                <div>
                    <p className="text-sm mt-2 mb-1">{t("Iam")}</p>
                    <ButtonGroup color="danger" className="w-full">
                    <Button
                        onPress={() => setGender("male")}
                        color={gender === "male" ? "primary" : "default"}
                        className="w-[50%]"
                    >
                        {t("Male")}
                    </Button>
                    <Button
                        onPress={() => setGender("female")}
                        color={gender === "female" ? "primary" : "default"}
                        className="w-[50%]"
                    >
                        {t("Female")}
                    </Button>
                    </ButtonGroup>
                </div>

                {/* Input for Name */}
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isRequired
                    label={t("name")}
                    type="text"
                    color="default"
                    className="w-full"
                    labelPlacement="inside"
                    errorMessage={t("min_max_2_18")}
                    isInvalid={name.length <= 2 || name.length >= 18}
                    placeholder={`${t("EnteryourBio")}`}
                />

                {/* Textarea for Bio */}
                <Textarea
                    className="w-full"
                    label={t("Bio")}
                    isRequired
                    value={bio}
                    color="default"
                    labelPlacement="inside"
                    onChange={(e) => setBio(e.target.value)}
                    errorMessage={t("min_max_2_100")}
                    isInvalid={bio.length <= 2 || bio.length >= 100}
                    placeholder={`${t("EnteryourBio")} ${t("min_max_2_100")}`}
                />


                </div>
            }

                {searchParams.get('page') === "location" && 
                <div className="flex flex-col gap-4">

                        <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                        <p className="text-base font-semibold text-center">{t("locationTitle")} 📝</p>
                        <p className="text-xs text-center">{t("locationDescription")}</p>
                        </div>

                {/* Integrated Autocomplete for City Selection */}
                <Autocomplete
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    items={items}
                    isRequired
                    isLoading={isLoading}
                    placeholder={t("type_to_search")}
                    label={t("cityTitle")}
                    errorMessage={t("type_to_search")}
                    isInvalid={!city}
                    startContent={<SearchIcon className="size-5" />}
                >
                    {(item: any) => (
                    <AutocompleteItem
                        onPress={() =>
                        handleSelectionChange(item.country, item.value)
                        }
                        key={`${item.value}-${item.country}-${item.lat}`}
                    >
                        {item.label}
                    </AutocompleteItem>
                    )}
                </Autocomplete>
                <Alert
                    variant="faded"
                    color="warning"
                    title={t("enter_city_name_alert_message")}
                />
                </div>
            }

         
            
            {searchParams.get('page') === "work" && 
                <div className="flex flex-col gap-4">
                    <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                        <p className="text-base font-semibold text-center">{t("enter_work_position_text")}💼</p>
                        <p className="text-xs text-center">{t("career_description")}</p>
                    </div>
                <Input
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    label={t("work_text")}
                    type="text"
                    color="default"
                    className="w-full"
                    labelPlacement="inside"
                    placeholder={`${t("enter_work_position_text")}`}
                />
                </div>
            }

            {searchParams.get('page') === "instagram" && 
                <div className="flex flex-col gap-4">

                    <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                        <p className="text-base font-semibold text-center">{t("instagram_text")}🔗</p>
                        <p className="text-xs text-center">{t("instagram_description")}</p>
                    </div>
                <Input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    label={t("instagram_text")}
                    type="text"
                    color="default"
                    className="w-full"
                    labelPlacement="inside"
                    placeholder={`${t("enter_instagram_text")}`}
                />
                </div>
            }
            {searchParams.get('page') === "quastion" && 
                <div className="flex flex-col gap-4">

                <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                        <p className="text-base font-semibold text-center">{t("questions_text")}❓</p>
                        <p className="text-xs text-center">{t("personality_description")}</p>
                    </div>
                <Textarea
                    value={quastion1}
                    onChange={(e) => setquastion1(e.target.value)}
                    label={t("weekend_getaway_text")}
                    type="text"
                    color="default"
                    className="w-full"
                    labelPlacement="inside"
                />

                <Textarea
                    value={quastion2}
                    onChange={(e) => setquastion2(e.target.value)}
                    label={t("dinner_question_text")}
                    type="text"
                    color="default"
                    className="w-full"
                    size="md"
                    labelPlacement="inside"
                />
                </div>
            }



   

            {searchParams.get('page') === "education" && 
                <div className="flex flex-col gap-4">

                    <div className="mb-1 mt-1 px-6 pt-8 pb-4 flex flex-col gap-2">
                        <p className="text-base font-semibold text-center">{t("education_text")}👨‍🎓</p>
                        <p className="text-xs text-center">{t("education_description")}</p>
                    </div>
                <Input
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    label={t("Education")}
                    type="text"
                    color="default"
                    className="w-full"
                    labelPlacement="inside"
                    placeholder={`${t("enter_education_text")}`}
                />
                </div>
            }


          </form>
        </section>
      </div>

      <MainButton
        text={t("Save")}
        backgroundColor="#1FB6A8"
        textColor="#FFFFFF"
        hasShineEffect={location.pathname === "/edit-profile-field"}
        isEnabled={
          !updatingUserData && location.pathname === "/edit-profile-field"
        }
        isLoaderVisible={updatingUserData}
        isVisible={location.pathname === "/edit-profile-field"}
        onClick={handleSave}
      />

      <SecondaryButton
        text={t("close")}
        backgroundColor={theme === "light"? "#FFFFFF" : "#000000"}
        textColor={theme === "light"? "#000000" : "#FFFFFF"}
        hasShineEffect={false}
        isEnabled={location.pathname === "/edit-profile-field"}
        isLoaderVisible={false}
        isVisible={location.pathname === "/edit-profile-field"}
        position="left"
        onClick={()=> navigate(-1)}
      />
    </Page>
  );
}
