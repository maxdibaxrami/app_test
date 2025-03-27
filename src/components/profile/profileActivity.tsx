import { useSelector } from "react-redux";
import { Card, CircularProgress, CardFooter } from "@heroui/react";
import { t } from "i18next";
import { RootState } from "@/store";

const ProfileActivityCard = () => {
  const activityScore = useSelector((state: RootState) => state.activity.activityScore);

  return (
    <Card
      shadow="none"
      className="border-1 border-default-200 dark:border-default-100 backdrop-blur aspect-square bg-neutral/10"
      radius="lg"
    >
      <div className="flex items-center justify-center h-full">
        <CircularProgress
          aria-label="Loading..."
          color="success"
          showValueLabel={true}
          size="lg"
          value={activityScore}
          classNames={{ value: "font-semibold" }}
        />
        <CardFooter className="justify-center before:bg-white/10 border-none overflow-hidden py-1 absolute before:rounded rounded bottom-1 w-full z-10">
          <p className="font-semibold text-sm text-center">{t("activity")}</p>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProfileActivityCard;
