import { BASEURL } from "@/constant";
import { RootState } from "@/store";
import { Avatar, ScrollShadow } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MatchList = () => {
  const { t } = useTranslation();
  const { data: user } = useSelector((state: RootState) => state.user);
  const { data: match, loading } = useSelector((state: RootState) => state.match);


  return (
    (<div style={{position:"relative",zIndex:10}} className=" rounded-xl">
      <div style={{ paddingBottom: "0.5rem" }} className="flex justify-between items-center">
        <span className="text-large text-default-600 font-bold">
          {t("matches")}
        </span>
      </div>
      {!loading &&
            <ScrollShadow hideScrollBar size={20} className="flex gap-2 max-w-[100%] h-[70px]" orientation="horizontal">
              {(match.map((value, index) => {
                  const user2 = user.id !== value.likedUser.id? value.likedUser : value.user
                  return <div key={index} className="flex items-center">
                    <Avatar
                      as={Link}
                      to={`/chat-detail?user1=${value.likedUser.id}&user2=${value.user.id}`}
                      color={user2.premium? "warning" : "default" }
                      radius="full"
                      size="lg"
                      src={user2.photos[0] && user2.photos[0].smallUrl && `${BASEURL}${user2.photos[0].smallUrl}`}
                    />
                  </div>
              }))}
            </ScrollShadow>
      }

    </div>)
  );
};

export default MatchList;
