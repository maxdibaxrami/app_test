import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input, Spinner } from "@heroui/react"; // use the Input component from HeroUI
import { Listbox, ListboxItem } from "@heroui/react"; // use the Listbox components from HeroUI
import { useTranslation } from "react-i18next";
import axios from "axios";
import axiosInstance from "@/api/base";
import { SearchIcon } from "@/Icons";

// Helper: convert country code to flag emoji.
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Debounce hook to limit API calls during input changes.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// City interface
interface City {
  name: string;
  country: string;
  lat?: string;
  lng?: string;
}

// Props for the search input component.
interface CitySearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  startContent?: React.ReactNode;
  endContent?:React.ReactNode;
}

// A memoized search input component.
const CitySearchInput: React.FC<CitySearchInputProps> = React.memo(
  ({ value, onChange, placeholder, startContent, endContent }) => {
    const { t } = useTranslation();

    return (
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        startContent={startContent}
        endContent={endContent}
        labelPlacement="inside"
        label={t("cityTitle")} 
        
      />
    );
  }
);

// Props for the listbox component.
interface CityListBoxProps {
  cities: City[];
  onSelect: (city: City) => void;
  selectedCity?: City | null;
  selectedValueCityList?: any;
  setSelectedCityKeys?:any
  selectedCityKeys?:any
}

// A memoized listbox to display search results.
const CityListBox: React.FC<CityListBoxProps> = React.memo(
  ({ cities, onSelect, setSelectedCityKeys, selectedCityKeys }) => {
    // Memoize the mapped items to avoid re-calculating on each render.
    const items = useMemo(
      () =>
        cities.map((city) => ({
          key: `${city.name}-${city.country}-${city.lat}`,
          label: `${getFlagEmoji(city.country)} ${city.country}, ${city.name}`,
          city,
        })),
      [cities]
    );

    return (
      <div className="w-full mt-2 max-w-full max-h-[350px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        <Listbox style={{overflow:"scroll"}} className="max-h-[330px]" selectedKeys={selectedCityKeys} onSelectionChange={setSelectedCityKeys} items={items} selectionMode="single">
          {items.map((item) => (
            <ListboxItem
              key={item.city.lat}
              onPress={() => onSelect(item.city)}
              >
              {item.label}
            </ListboxItem>
          ))}
        </Listbox>
      </div>
    );
  }
);

// Props for the main component.
interface SelectCityProps {
  setSlideAvailable: (key: string, value: any) => void;
  setSlideUnAvailable: (key: string, value: any) => void;
  user: any;
  showError: boolean;
  selectedValueCityList:any;
  setSelectedCityKeys:any;
  selectedCityKeys:any;
}

// The main component integrating the search input and listbox.
const SelectCity: React.FC<SelectCityProps> = ({
  setSlideAvailable,
  setSlideUnAvailable,
  user,
  selectedValueCityList,
  setSelectedCityKeys,
  selectedCityKeys,
  
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>(user.city || "");
  const [cityList, setCityList] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // If the user already has a city, prefill the input and update the slides.
  useEffect(() => {
    if (user.city) {
      setInputValue(user.city);
      setSelectedCity({ name: user.city, country: user.country });
      setSlideAvailable("city", user.city);
      setSlideAvailable("country", user.country);
    } else {
      setSlideUnAvailable("city", null);
      setSlideUnAvailable("country", null);
    }
  }, [user.city, user.country]);

  // Debounce the input to reduce API calls.
  const debouncedInput = useDebounce(inputValue, 1000);

  // Fetch city results when input length is at least 2 characters.
  useEffect(() => {
    if (debouncedInput.trim().length < 2) {
      setCityList([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const source = axios.CancelToken.source();
    const endpoint = `https://copychic.ru:3000/api/cities/search?name=${encodeURIComponent(
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

  // Use callback to update the input value.
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  // Handle city selection from the list.
  const handleSelectCity = useCallback(
    (city: City) => {
      setSelectedCity(city);
      setSlideAvailable("city", city.name);
      setSlideAvailable("country", city.country);
    },
    [setSlideAvailable]
  );

  return (
    <div className="flex flex-col px-6 pb-4">
      <CitySearchInput
        value={inputValue}
        onChange={handleInputChange}
        placeholder={t("type_to_search")}
        startContent={<SearchIcon className="size-5" />}
        endContent={isLoading && <Spinner size="sm" />}
        
      />
      {cityList.length > 0 && (
        <CityListBox
          selectedValueCityList={selectedValueCityList}
          setSelectedCityKeys={setSelectedCityKeys}
          selectedCityKeys={selectedCityKeys}
          cities={cityList}
          onSelect={handleSelectCity}
          selectedCity={selectedCity}
        />
      )}
    </div>
  );
};

export default React.memo(SelectCity);
