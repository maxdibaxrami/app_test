// ActivityListener.tsx
import { incrementActivity } from "@/features/activitySlice";
import { updateUserData } from "@/features/userSlice";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ActivityListener = () => {
  let lastActivity = Date.now();
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector((state: RootState) => state.user);
  const { activityScore } = useSelector((state: RootState) => state.activity);

  useEffect(() => {
    // Optionally boost the score if activity has occurred recently
    const interval = setInterval(() => {
      if (Date.now() - lastActivity < 5000) {
        dispatch(incrementActivity(1));
      }
    }, 20000);

    return () => {
       dispatch(
              updateUserData({
                userId: user.id.toString(),
                updatedData: {
                  activityScore: activityScore, // Adjust this logic as needed
                },
              })
            );
      clearInterval(interval);
    };
  }, []);

  return null;
};

export default ActivityListener;
