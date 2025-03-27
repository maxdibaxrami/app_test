import { Calendar } from "@heroui/react";
import { useEffect, useState } from "react";
import { parseDate, today, getLocalTimeZone, DateValue } from "@internationalized/date";

const CalendarPicker = ({ setSlideAvailable, setSlideUnAvailable, user, showError }) => {
  // Define min and max allowed dates
  const minDate = parseDate("1900-01-01");
  const todayDate = today(getLocalTimeZone());
  const maxDate = todayDate.subtract({ years: 18 });

  const [age, setAge] = useState(user.age);
  const [dateBirth, setDateBirth] = useState(user.dateBirth);

  // Initialize state with the given initial date
  const initialDate = dateBirth ? parseDate(dateBirth) : null;

  const [value, setValue] = useState<DateValue | null>(initialDate);

  // Helper to format date as "YYYY-MM-DD"
  const formatDate = (dateValue) => {
    return `${dateValue.year}-${String(dateValue.month).padStart(2, "0")}-${String(dateValue.day).padStart(2, "0")}`;
  };

  // Helper to calculate age based on date string
  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
  
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return age;
  };

  // Handle changes in the DatePicker
  const handleDateChange = (newValue: DateValue | null) => {
    if (newValue) {
      const formattedDate = formatDate(newValue);
      setValue(parseDate(formattedDate));
      setDateBirth(formattedDate);
      setAge(calculateAge(formattedDate));
    }
  };

  useEffect(() => {
    if (dateBirth) {
      setSlideAvailable("dateBirth", dateBirth);
      setSlideAvailable("age", age);

    } else {
      setSlideUnAvailable();
    }
  }, [ dateBirth, age]);

  return (
    <div className="flex justify-between flex-col px-6 pb-4">
      <form className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-4">
                  <Calendar 
                    value={value}
                    onChange={handleDateChange}
                    style={{ width: "100%" }}
                    showMonthAndYearPickers
                    minValue={minDate}
                    maxValue={maxDate}
                    color="primary"
                    
                    errorMessage="Select date of birth"
                    isInvalid={showError && value === null}
                    
                  />
            </div>
          </form>
      </div>
  );
};

export default CalendarPicker;
