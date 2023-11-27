import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ShowCalendar from "../common/Calendar/Calendar";
import TutorCalenderSidebar from "./TutorCalenderSidebar";


const Scheduling = () => {

  const [activeTab, setActiveTab] = useState("month");
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const [disabledHours, setDisabledHours] = useState([]);
  const [disableColor, setDisableColor] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleCheckboxClick = (dayName, hourRange) => {
    // Check if the day or hour is already disabled
    const isDayDisabled = disableWeekDays.includes(dayName);
    const isHourDisabled = disabledHours.includes(hourRange);
    if (isDayDisabled) {
      // If both day and hour are already disabled, remove them
      setDisabledWeekDays(disableWeekDays.filter((day) => day !== dayName));
    } else if (isHourDisabled) {
      setDisabledHours(disabledHours.filter((hour) => hour !== hourRange));
    } else {
      // If either day or hour is not disabled, add them
      if (dayName) {
        if (!isDayDisabled) {
          setDisabledWeekDays([...(disableWeekDays??[]), dayName]);
        }
      }
      if (hourRange) {
        if (!isHourDisabled) {
          setDisabledHours([...disabledHours, hourRange]);
        }
      }
    }
  };

  return (
    <>
      <div className="form-scheduling">
        <div className="time-period">
          <div className='d-flex mt-5' style={{ height: "80vh" }}>
            <div className="px-2 col-3">
              <TutorCalenderSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                disableWeekDays={disableWeekDays}
                setDisabledWeekDays={setDisabledWeekDays}
                disabledHours={disabledHours}
                setDisabledHours={setDisabledHours}
                disableColor={disableColor}
                setDisableColor={setDisableColor}
              />
            </div>
            <div className='px-5 col-9'>
              <ShowCalendar
                setActiveTab={setActiveTab}
                setDisableColor={setDisableColor}
                disableColor={disableColor}
                activeTab={activeTab}
                disableWeekDays={disableWeekDays}
                disabledHours={disabledHours}
                setDisabledWeekDays={setDisabledWeekDays}
                setDisabledHours={setDisabledHours} />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scheduling;
