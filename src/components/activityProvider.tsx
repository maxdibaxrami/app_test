// ActivityListener.tsx
import { incrementActivity } from "@/features/activitySlice";
import { updateUserData } from "@/features/userSlice";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ActivityListener = () => {
  const dispatch = useDispatch<AppDispatch>();
  let lastActivity = Date.now();
  const { activityScore } = useSelector((state: RootState) => state.activity);

  useEffect(() => {
    const handleActivity = () => {
      lastActivity = Date.now();
      dispatch(incrementActivity(0.1));
    };

    // Listen to mobile touch events
    window.addEventListener("touchstart", handleActivity);
    // Listen to desktop events (if applicable)
    window.addEventListener("click", handleActivity);

    // Optionally boost the score if activity has occurred recently
    const interval = setInterval(() => {
      if (Date.now() - lastActivity < 10000) {
        dispatch(incrementActivity(0.05));
      }
    }, 20000);

    return () => {
      dispatch(
        updateUserData({
            activityScore: activityScore, // Adjust this logic as needed
        })
      );
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(interval);
    };
  }, [dispatch]);

  return null;
};

export default ActivityListener;
