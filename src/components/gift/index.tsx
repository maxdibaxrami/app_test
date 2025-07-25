import { useState } from "react";
import {
  Avatar,
  Card,
  Button,
  CardHeader,
  Badge,
  CardBody,
  Link,
} from "@heroui/react";
import { BASEURL, getlookingfor } from "@/constant";
import { useTranslation } from "react-i18next";
import { CheckIcon, FlashIcon, GiftIcon } from "@/Icons";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { decreaseReferralReward, updateUserProfileViews } from "@/features/userSlice";
import { GiftSendConfetti } from "../explore/buttonEffect";

export const SendGiftCard = ({user, userIds}) => {
  
  const { t } = useTranslation();
  const lookingfor = getlookingfor(t)

  const [ gifSended, setgifSended ] = useState(false);
  const [ loading, setLoading ] = useState(false)

  const dispatch = useDispatch<AppDispatch>();

     const HandleSendGifts = async (event) => {
        setLoading(true)
        const arrayOfIds = user.giftUsers
        await dispatch(updateUserProfileViews({
          userId: user.id.toString(),
          updatedData: {
            giftUsers: Array.isArray(arrayOfIds) ? [...arrayOfIds, userIds.id] : [userIds.id]  ,
          }
        }));

        await dispatch(decreaseReferralReward({ amount:10 }))

        setLoading(false)
        setgifSended(true)
        GiftSendConfetti(event)
      };

      return (
    <Card className="max-w-[300px] border-none bg-transparent z-100" shadow="none">
      <CardHeader className="justify-between gap-3">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="lg"
            size="md"
            color="success"
            src={`${BASEURL}${user.photos[0] && user.photos[0].small}`}
          />
          <div className="flex flex-col items-start justify-center ">
            <h4 className="text-small font-semibold leading-none text-default-600">{user.firstName}</h4>
            <h5 className="text-small tracking-tight text-default-500">
              {lookingfor.find(item => item.id === user.profileData.lookingFor)?.title}
            </h5>
          </div>
        </div>
           
          <Badge 
            isOneChar 
            color={gifSended ? "primary" : "warning"}
            size="lg"
            classNames={!gifSended? {"badge":"w-[45px]"}:{}}
            content={
              gifSended ? 
              <div className="p-0.5 flex items-center">
                <CheckIcon strokeWidth={3} className="size-4" stroke="#FFFFFF" />
              </div>
              : 
              <div className="p-0.5 flex items-center">
                <FlashIcon className="size-4" fill="#FFFFFF" />
                <p className="font-bold text-[#fff] text-tiny text-s">-10</p>
              </div>
            } 
            placement="top-left"
          >
            <Button
              color="success"
              radius="lg"
              size="lg"
              isIconOnly
              isLoading={loading}
              isDisabled={gifSended || userIds.rewardPoints < 10}
              variant={"solid"}
              className="z-1000"
              onPress={HandleSendGifts}

            >
              <GiftIcon className="size-6 text-white"/>

            </Button>
          </Badge>
      </CardHeader>

      {userIds.rewardPoints < 3  &&
          <CardBody>
              <Link href="/#/energy" anchorIcon={
                <FlashIcon className="size-4" fill="#FFFFFF" />
              } className="text-xs" color="warning">
                {t("You_need_more_energy_to_continue_Tap_here_to_recharge.")}
              </Link>
          </CardBody>
        }
    </Card>
  );
};
