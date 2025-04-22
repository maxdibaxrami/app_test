import "swiper/css";
import "swiper/css/effect-creative";
import "./style.css";

import React, { useEffect, useState, useCallback } from "react";
import ExploreCard from "./exploreCart";
import MatchModal from "./matchModal";
import { Button } from "@heroui/button";
import { ChatIcon, CloseCircleIcon, GiftIcon, LikeIcon, LockIcon } from "@/Icons";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useDispatch, useSelector } from "react-redux";
import { likeUser } from "@/features/likeSlice";
import { AppDispatch, RootState } from "@/store";
import { NotFoundUserExplore } from "@/Icons/notFoundUserExplore";
import { fetchFilteredExplore } from "@/features/exploreSlice";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import { fetchMatches } from "@/features/matchSlice";
import { SparklesHeartText } from "../animate/hearSparkles";
import { incrementLikes, resetLikes, setLastReset } from "@/features/likeLimitationSlice";
import { PopOverPerimum } from "../perimum/popOver";
import { SendGiftCard } from "../gift";
import { FlashMessageCard } from "./flashMessage";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/effect-fade';

import { EffectFade } from 'swiper/modules';

const ExplorePage = () => {
  const maxLikes = 30;
  const dispatch: AppDispatch = useDispatch();
  const { data: user } = useSelector((state: RootState) => state.user);
  const { data: users, loading, page, limit, total, secondLoading } = useSelector((state: RootState) => state.explore);
  const { t } = useTranslation();
  const { likesCount, lastReset } = useSelector((state: RootState) => state.likeLimit);
  const { requestLoading } = useSelector((state: RootState) => state.like);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  // Reset likes at the beginning of a new day.
  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (lastReset < today) {
      dispatch(resetLikes());
      dispatch(setLastReset(today));
    }
  }, [dispatch, lastReset]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleLikeUser = useCallback(async () => {
    console.log(likesCount > maxLikes)
    if (likesCount > maxLikes) return;
    try {
      if(user.premium === false){
        dispatch(incrementLikes());
      }
      const resultAction = await dispatch(
        likeUser(users[activeSlideIndex].id)
      );
      //@ts-ignore
      if (resultAction.payload?.isMatch === true) {
        dispatch(fetchMatches());
        openModal();
      }
    } catch (error) {
      console.error("Failed to like user:", error);
    } finally {
      swiperInstance?.slideNext();
    }
  }, [dispatch, likesCount, maxLikes, user.id, users, activeSlideIndex, swiperInstance, openModal]);

  const handleNotLike = useCallback(() => {
    console.log(users.length)

    if (likesCount > maxLikes) return;
    swiperInstance.slideNext();

    if (user.premium === false) {
      dispatch(incrementLikes());
    }
  }, [dispatch, likesCount, maxLikes, swiperInstance]);

  const lp = useLaunchParams();
  const getPaddingForPlatform = () => (["ios"].includes(lp.platform) ? "50px" : "25px");

  // When reaching the end of the current batch, fetch new users
  useEffect(() => {
    if (users && activeSlideIndex === users.length - 1) {
      dispatch(
        fetchFilteredExplore({
          ageRange: null,
          city: null,
          country: null,
          languages: null,
          page,
          limit,
        })
      );
      // Reset the slider to start with the new batch.
      setActiveSlideIndex(0);
    }
  }, [activeSlideIndex, users, page, limit, total, dispatch]);


  useEffect(()=>{
    setActiveSlideIndex(0);
  },[users])

  

  if (loading || secondLoading) {
    return (
      <div style={{ position: "relative" }}>
        <div
          className="flex justify-center items-center"
          style={{
            width: "100vw",
            height: `calc(100vh - ${getPaddingForPlatform()})`,
            position: "relative",
          }}
        >
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="relative h-screen w-screen p-6 flex flex-col items-center justify-center">
        <NotFoundUserExplore />
        <div className="flex gap-4 flex-col px-6 text-center items-center">
          <p className="text-tiny">{t("nolikemessage")}</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="w-screen bg-background" style={{ position: "relative" }}>
      <Swiper
        effect={"fade"}
        grabCursor={true}
        className="mySwiper"
        style={{ marginTop: "6rem" }}
        allowTouchMove={false}
        modules={[EffectFade]}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
      >
        {users.map((value) => (
          <SwiperSlide className="bg-background" key={value.id}>
            <ExploreCard profile={value} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div style={{ bottom: "25px", zIndex: 50 }} className="fixed card p-2 w-full flex justify-center items-end">
        <div className="p-2" style={{ borderRadius: "50%", zIndex: 50 }}>
          <Popover backdrop="opaque" showArrow placement="bottom-start">
            <PopoverTrigger>
              <Button
                isDisabled={likesCount >= maxLikes}
                radius="lg"
                style={{ width: "55px", height: "55px" }}
                size="lg"
                isIconOnly
                color="success"
                variant="shadow"
                
              >
                
                <GiftIcon className="size-7 text-white"/>

              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 backdrop-blur bg-background/90 backdrop-saturate-150">
              <SendGiftCard userIds={user} user={users[activeSlideIndex]} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="p-2" style={{ borderRadius: "50%", zIndex: 50 }}>
          <Button
            isDisabled={likesCount >= maxLikes}
            onClick={handleNotLike}
            radius="lg"
            style={{ width: "65px", height: "65px" }}
            size="lg"
            isIconOnly
            color="primary"
            variant="shadow"
            className="flex items-center justify-center"
          >
            <CloseCircleIcon className="size-9"/>
          </Button>
        </div>

        <div className="p-2" style={{ borderRadius: "50%", zIndex: 50 }}>
          {likesCount >= maxLikes ? (
            <PopOverPerimum isOpen={true}>
              <Button
                isDisabled
                radius="lg"
                style={{ width: "65px", height: "65px" }}
                size="lg"
                isIconOnly
                color="secondary"
                variant="shadow"
                className="flex items-center justify-center"
              >
                <LockIcon style={{ width: "2.5rem", height: "2.5rem" }} className="size-8" />
              </Button>
            </PopOverPerimum>
          ) : (
            <SparklesHeartText
              text={
                <Button
                  style={{ width: "65px", height: "65px" }}
                  radius="lg"
                  isLoading={requestLoading}
                  isIconOnly
                  onPress={handleLikeUser}
                  color="secondary"
                  variant="shadow"
                  className="flex items-center justify-center"
                >
                  <LikeIcon className="size-9"/>
                </Button>
              }
              colors={{ first: "#ff4b61", second: "#A8B2BD" }}
              sparklesCount={5}
            />
          )}
        </div>

        <div className="p-2" style={{ borderRadius: "50%", zIndex: 50 }}>
          <Popover backdrop="opaque" showArrow placement="bottom-end">
            <PopoverTrigger>
              <Button
                isDisabled={likesCount >= maxLikes}
                radius="lg"
                style={{ width: "55px", height: "55px" }}
                size="lg"
                isIconOnly
                color="warning"
                variant="shadow"
              >
                 <ChatIcon className="size-7 text-white"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 backdrop-blur bg-background/90 backdrop-saturate-150">
              <FlashMessageCard userIds={user} user={users[activeSlideIndex]} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {users[activeSlideIndex - 1] && (
        <MatchModal
          isOpen={isModalOpen}
          modalData={users[activeSlideIndex - 1]}
          onClose={closeModal}
          thisUserId={user.id}
        />
      )}
    </div>
  );
};

export default React.memo(ExplorePage);
