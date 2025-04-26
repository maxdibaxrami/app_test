import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@heroui/button";
import { addToast, Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "@/store";
import { isUserSubscribed } from "@/helpers/checkUserJoinChannel";
import { increaseReferralReward } from "@/features/userSlice";
import { useNavigate } from "react-router-dom";
import { openTelegramLink } from "@telegram-apps/sdk-react";

interface TaskCardProps {
  title: string;
  description: string;
  reward: string;
  type: string;
  isDaily: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  reward,
  type,
  isDaily,
}) => {
  const [taskDone, setTaskDone] = useState(false);
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { data: user } = useSelector((state: RootState) => state.user);
  const { data: match } = useSelector((state: RootState) => state.match);
  const { likesCount } = useSelector((state: RootState) => state.likeLimit);
  const activityScore = useSelector((state: RootState) => state.activity.activityScore);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)

  // Helper: verify if a task can be completed
  const canCompleteTask = (taskType: string, isDailyTask: boolean): boolean => {
    const storageKey = `task_${taskType}`;
    const lastCompleted = localStorage.getItem(storageKey);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastCompleted) {
      return isDailyTask ? now - parseInt(lastCompleted, 10) >= oneDay : false;
    }
    return true;
  };

  const markTaskCompleted = (taskType: string) => {
    localStorage.setItem(`task_${taskType}`, Date.now().toString());
  };

  useEffect(()=>{
    if (!canCompleteTask(type, isDaily)) {
      setTaskDone(true)
    }else{
      setTaskDone(false)

    }
  },[])

  const handleTaskDone = async (taskType: string) => {
    setLoading(true)
    // Block if the task has already been completed within the allowed period
    if (!canCompleteTask(taskType, isDaily)) {
      addToast({
        title: t("error_text"),
        description: isDaily
          ? t("Daily task already completed. Please try again after 24 hours.")
          : t("This task can only be completed once."),
        color: "danger",
      });
      setLoading(false)

      return;
    }

    // Task-specific validations
    if (taskType === "COMPLETE_PROFILE") {
      if (!user.question1) {
        addToast({
          title: t("title_profile_complete"),
          description: t("weekend_getaway_text"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          endContent: (
            <Button color="danger" onPress={()=> navigate("/edit-profile-field?page=quastion")} size="sm" variant="flat">
              {t('open')}
            </Button>
          ),
        });
        setLoading(false)
        return;
      }
      if (!user.instagram) {
        addToast({
          title: t("title_profile_complete"),
          description: t("instagram_text"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          endContent: (
            <Button color="danger" onPress={()=> navigate("/edit-profile-field?page=instagram")} size="sm" variant="flat">
              {t('open')}
            </Button>
          ),
        });
        setLoading(false)

        return;
      }
      if (!user.interests || user.interests.length === 0) {
        addToast({
          title: t("title_profile_complete"),
          description: t("Selectinterested"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          endContent: (
            <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
              {t('open')}
            </Button>
          ),
        });
        setLoading(false)

        return;
      }
      if (!user.photos || user.photos.length < 3) {
        addToast({
          title: t("title_profile_complete"),
          description: t("insert_images_text"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          endContent: (
            <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
              {t('open')}
            </Button>
          ),
        });
        setLoading(false)

        return;
      }
      if (!user.profileData || user.profileData.bio.length < 3) {
        addToast({
          title: t("title_profile_complete"),
          description: t("EnteryourBio"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          endContent: (
            <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
              {t('open')}
            </Button>
          ),
        });
        setLoading(false)

        return;
      }
      if (!user.profileData.education || user.profileData.education === "prefer_not_to_say") {
        addToast({
          title: t("title_profile_complete"),
          description: t("EnteryourWorkandeducationstatus"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          endContent: (
            <Button color="danger" onPress={()=> navigate("/edit-profile-field?page=education")} size="sm" variant="flat">
              {t('open')}
            </Button>
          ),
        });
        setLoading(false)

        return;
      }
      if (!user.profileData.work || user.profileData.work === "prefer_not_to_say") {
        addToast({
          title: t("title_profile_complete"),
          description: t("EnteryourWorkandeducationstatus"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          endContent: (
            <Button color="danger" onPress={()=> navigate("/edit-profile-field?page=work")} size="sm" variant="flat">
              {t('open')}
            </Button>
          ),
        });
        setLoading(false)

        return;
      }
      if (user.moreAboutMe) {
        if (user.moreAboutMe.relationStatus === "4") {
          addToast({
            title: t("title_profile_complete"),
            description: t("relationStatus"),
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            endContent: (
              <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
                {t('open')}
              </Button>
            ),
          });
          setLoading(false)

          return;
        }
        if (user.moreAboutMe.kids === "6") {
          addToast({
            title: t("title_profile_complete"),
            description: t("kids"),
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            endContent: (
              <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
                {t('open')}
              </Button>
            ),
          });
          setLoading(false)

          return;
        }
        if (user.moreAboutMe.smoking === "5") {
          addToast({
            title: t("title_profile_complete"),
            description: t("SmokingStatus"),
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            endContent: (
              <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
                {t('open')}
              </Button>
            ),
          });
          setLoading(false)

          return;
        }
        if (user.moreAboutMe.drink === "5") {
          addToast({
            title: t("title_profile_complete"),
            description: t("DrinkStatus"),
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            endContent: (
              <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
                {t('open')}
              </Button>
            ),
          });
          setLoading(false)

          return;
        }
        if (user.moreAboutMe.pets === "5") {
          addToast({
            title: t("title_profile_complete"),
            description: t("relationStatus"),
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            endContent: (
              <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
                {t('open')}
              </Button>
            ),
          });
          setLoading(false)

          return;
        }
        if (!user.moreAboutMe.height || user.moreAboutMe.height === 0) {
          addToast({
            title: t("title_profile_complete"),
            description: t("Height"),
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            endContent: (
              <Button color="danger" onPress={()=> navigate("/profile-edit")} size="sm" variant="flat">
                {t('open')}
              </Button>
            ),
          });
          setLoading(false)

          return;
        }
      }
    } else if (taskType === "MATCH_USER") {
      if (!match || match.length <= 3) {
        addToast({
          description: t("description_match_Profile"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          
        });
        setLoading(false)

        return;
      }
    } else if (taskType === "LIKE_USER") {
      if (!likesCount || likesCount <= 10) {
        addToast({
          description: t("description_like_Profile"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
        setLoading(false)
        return;
      }
    } else if (taskType === "SUBSCRIBE_CHANNEL") {
      const url = "https://t.me/fase_match_channel"; // Replace with your actual channel URL
      const userId = parseInt(user.telegramId, 10);
      try {
        const isSubscribed = await isUserSubscribed(url, userId);
        if (!isSubscribed) {
          addToast({
            description: t("description_channel_Profile"),
            color: "danger",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            endContent: (
              <Button color="danger" onPress={()=> openTelegramLink(url)} size="sm" variant="flat">
                {t('open')}
              </Button>
            ),
          });
          return;
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
        setLoading(false)

        return;
      }
    } else if (taskType === "ACTIVITY_USER") {
      if (!activityScore || activityScore <= 80) {
        addToast({
          description: t("not_active_enough_text"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
        setLoading(false)

        return;
      }
    }else if(taskType === "VERIFY_ACCONT"){
      if(!user.verifiedAccount){
        addToast({
          description: t("account_not_verified_text"),
          color: "danger",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
        setLoading(false)

        return;
      }

    
    }

    // If all validations pass, update the user reward.
    try {
      await dispatch(increaseReferralReward({ amount:parseInt(reward) }))
      
    } catch (error) {
      console.error("Error updating user data:", error);
      setLoading(false)

      return;
    }

    // Mark the task as completed (or update the timestamp)
    markTaskCompleted(taskType);

    addToast({
      title: t("success_text"),
      description: t("task_complete_text"),
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      color: "success",
    });

    setTaskDone(true);
    setLoading(false)

  };

  return (
    <div className="flex justify-between py-1 my-1">
      <div className="flex gap-1">
        <div className="flex mx-1 flex-col gap-1 items-start justify-center">
          <h4 className="text-small flex items-center font-semibold leading-none text-default-600">
            <span>{title}</span>
            <span className="mx-2 flex gap-1">
              <Chip color="primary" variant="shadow" size="sm">
                +{reward} {t("energy")}
              </Chip>
              {isDaily && (
                <Chip variant="shadow" color="warning" size="sm">
                  {t("daily_text")}
                </Chip>
              )}
            </span>
          </h4>
          <h5 className="text-xs flex items-center tracking-tight text-default-400">{description}</h5>
        </div>
      </div>
      <Button
        className={taskDone ? "bg-transparent text-foreground border-default-200" : ""}
        color="secondary"
        radius="lg"
        isLoading={loading}
        size="sm"
        variant={taskDone ? "bordered" : "shadow"}
        onPress={taskDone ? null : () => handleTaskDone(type)}
      >
        {taskDone ? t("claimed") : t("claim")}
      </Button>
    </div>
  );
};
