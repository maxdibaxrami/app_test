
import "swiper/css";
import "swiper/css/effect-creative";

import { Avatar, Button, cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Popover, PopoverContent, PopoverTrigger, Spinner } from "@heroui/react";
import { Listbox, ListboxItem, ListboxSection, Chip } from "@heroui/react";
import {
  HashtagIcon,
  AboutMeSolid,
  PerimumIcon,
  VerifyIconFill,
  ChatIcon,
  FireIcon,
  HeartIcon,
  EducationIcon,
  MoreIcon,
  LockIcon,
  FavoriteColor,
  GiftIcon,
  LikeIcon
} from "@/Icons/index";

import { Page } from '@/components/Page.tsx';
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { BASEURL, getDrinkStatus, gethobbies, getKidStatus, getlanguages, getPetStatus, getRealationStatus, getSexualityStatus, getSmokingStatus } from "@/constant";
import { useEffect, useMemo, useState } from "react";
import { fetchUserDataId, updateUserData, updateUserProfileViews } from "@/features/userSlice";
import { useSearchParams } from "react-router-dom";
import { fetchMatches } from "@/features/matchSlice";
import { fetchLikesAnotherUser, likeUser } from "@/features/likeSlice";
import MatchModal from "@/components/explore/matchModal";
import { motion } from "framer-motion";
import { incrementLikes, resetLikes, setLastReset } from "@/features/NearByLikeLimitation";
import { SendGiftCard } from "@/components/gift";
import { SparklesHeartText } from "@/components/animate/hearSparkles";
import { FlashMessageCard } from "@/components/explore/flashMessage";
import { PopOverPerimum } from "@/components/perimum/popOver";

import TopBarPages from "@/components/tobBar/index";
import { ProfileBackgroundSvg } from "@/Icons/profileBackgroundSVG";

import ModalFormReport from '@/components/core/reportModal/index'

export default function ProfilePage() {
  const maxLikes = 5;
  const { t } = useTranslation();  // Initialize translation hook
  const lp = useLaunchParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { data: user, updateUserData:updateUserDataLoading , userPageData : UserData , userPageLoading : LoadingUser } = useSelector((state: RootState) => state.user);
  const { fetchLikeAntoherUser, requestLoading } = useSelector((state: RootState) => state.like);

  const { data : matchs } = useSelector((state: RootState) => state.match);

  const { likesCount, lastReset } = useSelector((state: RootState) => state.NearByLimitation);

  const userId = searchParams.get("userId")

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedUser, setLikedUser ] = useState(false);
  
  const [openReportModal, setOpenModalReport] = useState(false)

  const RealationStatus = getRealationStatus(t)
  const languages = getlanguages(t)
  const SexualityStatus = getSexualityStatus(t)
  const hobbies = gethobbies(t)
  const PetStatus = getPetStatus(t)
  const DrinkStatus = getDrinkStatus(t)
  const SmokingStatus = getSmokingStatus(t)
  const KidStatus = getKidStatus(t)

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  useEffect(()=>{

    if (UserData && LoadingUser != true && UserData.id.toString() == userId && Array.isArray(UserData.profileViewsIds)) {
      const userId = user.id;
      const arrayOfIds = UserData.profileViewsIds;
      // Check if the user's ID is not already in the profileViews array
      if (arrayOfIds.includes(userId)) {
        return
      }
        // Update the profileViews array with the new user ID
        dispatch(updateUserProfileViews({
          userId: UserData.id.toString(),
          updatedData: {
            profileViews: [...arrayOfIds, userId]  // Append the user ID to the array
          }
        }));
    }

    
  },[UserData, LoadingUser])

  const liked = useMemo(() => {
    if (fetchLikeAntoherUser) {
      return !!fetchLikeAntoherUser.some((like) => like.id === user.id);
    }
    return false;
  }, [fetchLikeAntoherUser, user.id]);

  const match = useMemo(() => {
    if (matchs && UserData) {
      return !!matchs.some((match) => match.likedUser.id === UserData.id || match.user.id === UserData.id);
    }
    return false;
  }, [matchs, UserData]);


  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0); // Get today's date at midnight
    if (lastReset < today) {
      // It's a new day, reset the like count
      dispatch(resetLikes());
      dispatch(setLastReset(today));
    }
  }, [dispatch, lastReset]);

  useEffect(()=> {
    if(userId){
      dispatch(fetchLikesAnotherUser(userId))
      dispatch(fetchUserDataId(userId))
    }
  } ,[userId])

  const getPaddingForPlatform = () => {
    if (['ios','android'].includes(lp.platform)) {
      // iOS/macOS specific padding (e.g., accounting for notches)
      return '0px'  // Adjust as needed for iOS notch
    } else {
      // Android/base padding
      return '70px' // Default padding
    }
  };


   const HandleAddToFavorite = async (value) => {
    
      const arrayOfIds = user.favoriteUsers.map(v=> v.id)
      await dispatch(updateUserData({
        userId: user.id.toString(),
        updatedData: {
          favoriteUsers: Array.isArray(arrayOfIds) ? [...arrayOfIds, value] : [value]  // Ensure favoriteUsers is an array
        }
      }));

    };
  
    const HandleRemoveFromFavorite = async (value) => {
      const arrayOfIds = user.favoriteUsers.map(v=> v.id)

      await dispatch(updateUserData({
        userId: user.id.toString(),
        updatedData: {
          favoriteUsers: Array.isArray(arrayOfIds)
            ? arrayOfIds.filter(favorite => favorite != value)  // Remove the user with the matching id
            : []  // If favoriteUsers is not an array, set it to an empty array
        }
      }));
    };


  const handleLikeUser = async () => {
    
    if (likesCount >= maxLikes && searchParams.get('page') != "likes")  {
      return;
    }  

    try {
      // Dispatch the action and unwrap the result
      const resultAction = await dispatch(likeUser({ userId: user.id , likedUserId: parseInt(userId) }));
      if(user.premium === false){
        dispatch(incrementLikes())
      }
      setLikedUser(true)

      // @ts-ignore
      if (resultAction.payload.isMatch === true) {
        openModal()
        dispatch(fetchMatches(user.id.toString()));
      }
      
    } catch (error) {
      console.error('Failed to like user:', error);
    }
  };


    const ProfileCard = ({ color, icon, text }) => {
      return <motion.div
        className="flex gap-3 mt-1 mb-1"
        initial={{ opacity: 1 }}
        style={{ marginLeft: "4px" }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          ease: "linear",
          duration: 0.25,
        }}
      >
        <div className="flex items-center justify-center">
          <Avatar
            color={color}
            radius="md"
            icon={icon}
            size="md"
            classNames={{
              icon: "text-white/90 size-6",
            }}
          />
        </div>
        <div className="flex items-center">
          <p className="text-foreground capitalize font-bold  text-md">{text}</p>
        </div>
      </motion.div>
  };
  
    const Items = [
      {
        id: "1",
        title: t("Heretodate"),
        description: t("IwanttogoondatesandhaveagoodtimeNolabels"),
        icon: <FireIcon />,
        color: "success" // Valid color
      },
      {
        id: "2",
        title: t("Opentochat"),
        description: t("ImheretochatandseewhereitgoesNopressure"),
        icon: <ChatIcon />,
        color: "warning" // Valid color
      },
      {
        id: "3",
        title: t("Readyforarelationship"),
        description: t("ImlookingforsomethingthatlastsNogames"),
        icon: <HeartIcon fill="#FFF" />,
        color: "danger" // Valid color
      },
    ];
  
    // Profile details to display
    const profileItems = [
      {
        key: 1,
        color: "danger",
        gradient: "bg-gradient-to-br from-[#C20E4D] to-[#F54180]",
        icon: <EducationIcon className="size-6" />,
        label: t("Education"),
        text: UserData?.profileData.education,
      },
      {
        key: 2,
        color: "primary",
        gradient: "bg-gradient-to-br from-[#338EF7] to-[#004493]",
        icon: <AboutMeSolid className="size-6" />,
        label: `${t("Bio")}:`,
        text: UserData?.profileData.bio,
      },
      {
        key: 3,
        color: "success",
        gradient: "bg-gradient-to-br from-[#0E793C] to-[#17C964]",
        icon: Items.find(item => item.id == UserData?.profileData.lookingFor)?.icon,
        label: t("lookingFor"),
        text: Items.find(item => item.id == UserData?.profileData.lookingFor)?.title,
      }
    ].filter((value) => value.text);


    const moreAboutMeData = useMemo(()=>{
      if(UserData){
        return [
          {
            key: "relationStatus",
            label: t("RelationStatus"),
            icon: <p className="text-md p-1">👩‍❤️‍👨</p>,
            value: RealationStatus.find(RealationStatus => RealationStatus.key === UserData.moreAboutMe.relationStatus).label ,
            color:"primary"
          },
          {
            key: "height",
            label: t("Height"),
            icon: <p className="text-md p-1">📏</p>,
            value: UserData.moreAboutMe.height,
            color:"secondary"
          },
          {
            key: "sexuality",
            label: t("SexualityStatus"),
            icon: <p className="text-md p-1">🌈</p>,
            value: SexualityStatus.find(SexualityStatus => SexualityStatus.key === UserData.moreAboutMe.sexuality).label,
            color:"success"
          },
          {
            key: "Language",
            label: t("Language"),
            icon: <p className="text-md p-1">🈶</p>,
            value:`${user.moreAboutMe.languages.map((value)=> languages.find(languages => languages.key === value).label).join(", ")}`,
            color:"primary"
          },
          {
            key: "kids",
            label: t("KidsStatus"),
            icon: <p className="text-md p-1">👦</p>,
            value: KidStatus.find(KidStatus => KidStatus.key === UserData.moreAboutMe.kids).label,
            color:"warning"
          },
          
          {
            key: "smoking",
            label: t("SmokingStatus"),
            icon: <p className="text-md p-1">🚬</p>,
            value: SmokingStatus.find(SmokingStatus => SmokingStatus.key === UserData.moreAboutMe.smoking).label,
            color:"secondary"
          },
          {
            key: "drink",
            label: t("DrinkStatus"),
            icon: <p className="text-md p-1">🥃</p>,
            value: DrinkStatus.find(DrinkStatus => DrinkStatus.key === UserData.moreAboutMe.drink).label,
            color:"danger"
          },
          {
            key: "pets",
            label: t("PetStatus"),
            icon: <p className="text-md p-1">🐶</p>,
            value: PetStatus.find(PetStatus => PetStatus.key === UserData.moreAboutMe.pets).label,
            color:"warning"
          },
        ];
      }

  

  },[UserData, LoadingUser])


  return (
    <Page>
        <div
          className="containe relative pt-3 mx-auto max-w-7xl flex-grow top-bar-height w-full safe-area-top"
          style={{
            maxHeight: "100%",
            height:"100%",
            marginBottom:"5rem",
            
          }}
      >

              <motion.div transition={{ delay: 2 , duration: 2 }} initial={{opacity:0}} animate={{opacity:1}} className="fixed h-full dark:opacity-70 -top-[80px] inset-0 flex items-center z-[-10]">
                <ProfileBackgroundSvg/>
              </motion.div>
              
         <TopBarPages />
        {!LoadingUser ? 
              <section
                className="flex flex-col safe-area-top"
              >
              
      
                  <div  className="px-3 w-full mb-4">
                    <div style={{marginTop:`${getPaddingForPlatform()}`}} className="w-full px-1 bg-neutral/10 text-default-700 border-small rounded-large border-default-200 dark:border-default-100">
                      <Listbox 
                        aria-label="Listbox menu with sections" 
                        variant="solid"
                        
                      >
                        <ListboxItem>
                          <div className="flex flex-grow w-full">
                                <div className="flex flex-col w-full">
                                  <div className="flex items-center justify-between w-full ">
                                    <div className="flex flex-col">
                                      <div className="flex items-center"> 
                                        <p className="text-foreground capitalize font-bold text-xl">
                                          {UserData.firstName}, {UserData.age}
                                        </p>
                                        {UserData.verifiedAccount && <VerifyIconFill fill="#21b6a8" className="ml-2 size-6"/>}
                                        {UserData.premium && <PerimumIcon />}
                                      </div>
                                      <div>
                                        <p className="text-tiny">{`${UserData.country}, ${UserData.city}`}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <div>
                                        {user.favoriteUsers.map(v=> v.id).includes(UserData.id) ? 
                                          <Button className="mx-1" isLoading={updateUserDataLoading} size="sm" onPress={()=> HandleRemoveFromFavorite(UserData.id)} radius="lg" isIconOnly color="warning" variant="shadow">
                                            <FavoriteColor className="size-5" stroke={"#FFF"} fill={"#FFF"}/>
                                          </Button>
                                        : 
                                          <Button className="mx-1" isLoading={updateUserDataLoading} size="sm" onPress={() => HandleAddToFavorite(UserData.id)} radius="lg" isIconOnly color="warning" variant="shadow">
                                            <FavoriteColor className="size-5" stroke={"#c98927"} fill={"#c98927"}/> 
                                          </Button>
                                        }
                                      </div>

                                      <Dropdown>
                                        <DropdownTrigger>
                                          <Button size="sm" radius="lg" isIconOnly variant="solid">
                                            <MoreIcon fill="#FFF"/>
                                          </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
                                          <DropdownItem
                                            key="edit"
                                            onPress={()=> setOpenModalReport(true)}
                                          >
                                            {t("report_text")}
                                          </DropdownItem>
                                          <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                          >
                                            {t("block_text")}
                                          </DropdownItem>
                                        </DropdownMenu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                </div>
                          </div>
                            

                        </ListboxItem>
                        {UserData.photos && UserData.photos[0] && 
                              <ListboxSection>
                                <ListboxItem classNames={{"base":"px-0"}} isReadOnly>
                                    <Image 
                                          alt="Profile hero Image"
                                          className="w-full h-full"
                                          classNames={{
                                              wrapper: "w-full maxcontentimportant",
                                          }}
                                          loading="lazy"
                                          src={`${BASEURL}${UserData?.photos[0].large}`} // dynamic image URL
                                          style={{
                                              objectFit: "cover",
                                              aspectRatio: "3/4" 
                                          }}
                                      />
                                </ListboxItem>
                              </ListboxSection>
                            
                            }
                        <ListboxSection                   
                          classNames={{"heading":"font-bold"}} 
                          className="relative" 
                          title={t("WhyIamhere")}>
                         
                         {profileItems.map((item,index) => {
                            if(item.key === 3 )
                            {
                              return <ListboxItem
                              key={index+5}
                              className="px-0 py-1"
                              >
                              <ProfileCard
                                key={item.key}
                                color={item.color}
                                icon={item.icon}
                                text={item.text}
                              />
                            </ListboxItem>
                            }

                          })}
      
                        </ListboxSection>

                        <ListboxSection                   
                          classNames={{"heading":"font-bold"}} 
                          className="relative" 
                          title={t("Bio")}>
                              <ListboxItem
                                key={321321}
                                className="px-1 py-0"
                              >
                                <p className="text-md">{UserData?.profileData.bio}</p>
                              </ListboxItem>

                        </ListboxSection>

                          <ListboxSection                   
                            classNames={{"heading":"font-bold"}} 
                            className="relative" 
                            title={t("more_about_me")}>

                              <ListboxItem
                                key={321321}
                                classNames={{"title":"flex px-1 gap-2 py-0 flex-wrap","base":"px-0"}}
                              >
                                 {moreAboutMeData.map((item, index)=>{
                                    if(item.value === " " || item.value === "" || item.value ===null)
                                    {
                                      return null
                                    }

                                    // @ts-ignore
                                    return <Chip className="mx-0" size="md" key={index} color={item.color} startContent={item.icon} variant="shadow">
                                      {item.value}
                                    </Chip>

                                  })}
                              </ListboxItem>
                          </ListboxSection>



                            {UserData.photos && UserData.photos[1] && 
                              <ListboxSection>
                                <ListboxItem classNames={{"base":"px-0"}} isReadOnly>
                                    <Image 
                                          alt="Profile hero Image"
                                          className="w-full h-full"
                                          classNames={{
                                              wrapper: "w-full maxcontentimportant",
                                          }}
                                          loading="lazy"
                                          src={`${BASEURL}${UserData?.photos[1].large}`} // dynamic image URL
                                          style={{
                                              objectFit: "cover",
                                              aspectRatio: "3/4" 
                                          }}
                                      />
                                </ListboxItem>
                              </ListboxSection>
                            
                            }

                    {UserData?.profileData && UserData?.profileData.education !== null && UserData.profileData.education !=="" && UserData.profileData.education !==" " &&

                        <ListboxSection                   
                          classNames={{"heading":"font-bold"}} 
                          className="relative" 
                          title={t("Education")}>
                              <ListboxItem
                                key={321321}
                                className="px-1 py-0"
                              >
                                <p className="text-md">{UserData?.profileData.education}</p>
                              </ListboxItem>

                        </ListboxSection>
                    }

                        {UserData?.profileData && UserData?.profileData.work !== null && UserData.profileData.work !==" " && UserData.profileData.work !=="" &&
                                                <ListboxSection                   
                                                classNames={{"heading":"font-bold"}} 
                                                className="relative" 
                                                title={t("work_text")}>
                                                    <ListboxItem
                                                      key={321321}
                                                      className="px-1 py-0"
                                                    >
                                                      <p className="text-md">{UserData?.profileData.work}</p>
                                                    </ListboxItem>
                      
                                              </ListboxSection>
                        }


                          {UserData.photos && UserData.photos[2] && 
                              <ListboxSection>
                                <ListboxItem classNames={{"base":"px-0"}} isReadOnly>
                                    <Image 
                                          alt="Profile hero Image"
                                          className="w-full h-full"
                                          classNames={{
                                              wrapper: "w-full maxcontentimportant",
                                          }}
                                          loading="lazy"
                                          src={`${BASEURL}${UserData?.photos[2].large}`} // dynamic image URL
                                          style={{
                                              objectFit: "cover",
                                              aspectRatio: "3/4" 
                                          }}
                                      />
                                </ListboxItem>
                              </ListboxSection>
                            
                            }
                            
                            {UserData.interests && UserData.interests.length > 0  && 
                            <ListboxSection 
                              classNames={{"heading":"font-bold"}} 
                              className="relative" 
                              title={t("interested")}
                            >
                                <ListboxItem
                                  key={111}
                                  className="px-0"
                                >
                                  
                                <div className="flex flex-wrap">
                                  {UserData.interests.map((value, index) => {
                                      return (
                                        <Chip
                                          key={index}
                                          className="m-1 bg-neutral/70"
                                          color="success"
                                          avatar={<HashtagIcon className="size-4"/>}
                                          variant="solid"
                                        >
                                          {hobbies.find(hobbie => hobbie.id == value).name}
                                        </Chip>
                                      );
                                    })}
                                      
                                </div>
                                </ListboxItem>
                              </ListboxSection>

                            }

                            {UserData.photos && 
                              <ListboxSection>
                                <ListboxItem classNames={{"base":"px-0"}} isReadOnly>
                                  <div className="grid gap-2 grid-cols-2">
                                    {UserData.photos.slice(3, 9).map((value)=>{
                                      return <div>
                                        <Image 
                                            alt="Profile hero Image"
                                            className="w-full h-full"
                                            classNames={{
                                                wrapper: "w-full maxcontentimportant",
                                            }}
                                            loading="lazy"
                                            src={`${BASEURL}${value.large}`} // dynamic image URL
                                            style={{
                                                objectFit: "cover",
                                                aspectRatio: "3/4" 
                                            }}
                                        />
                                      </div>
                                    })}
                                  </div>

                                    
                                </ListboxItem>
                              </ListboxSection>
                            
                            }

                          {UserData?.question1 && UserData?.question1 !== null &&

                            <ListboxSection                   
                              classNames={{"heading":"font-bold"}} 
                              className="relative" 
                              title={t("weekend_getaway_text")}>
                                  <ListboxItem
                                    key={32132231}
                                    className="px-1 py-0"
                                  >
                                    <p className="text-md">{UserData?.question1}</p>
                                  </ListboxItem>

                            </ListboxSection>
                          }


                          {UserData?.question2 && UserData?.question2 !== null &&

                            <ListboxSection                   
                              classNames={{"heading":"font-bold"}} 
                              className="relative" 
                              title={t("dinner_question_text")}>
                                  <ListboxItem
                                    key={32178321}
                                    className="px-1 py-0"
                                  >
                                    <p className="text-md">{UserData?.question2}</p>
                                  </ListboxItem>

                            </ListboxSection>
                          }

                            {UserData?.instagram && UserData?.instagram !== null &&

                            <ListboxSection                   
                              classNames={{"heading":"font-bold"}} 
                              className="relative" 
                              title={t("instagram_text")}>
                                  <ListboxItem
                                    key={32178321}
                                    className="px-1 py-0"
                                  >
                                    <p className="text-md">{UserData?.instagram}</p>
                                  </ListboxItem>

                            </ListboxSection>
                            }


                            <ListboxSection                   
                              classNames={{"heading":"font-bold"}} 
                              className="relative" 
                              title={t("location")}>
                                  <ListboxItem
                                    key={38321}
                                    className="px-1 py-0"
                                  >
                                    <p className="text-md">{`${UserData.country}, ${UserData.city}`}</p>
                                  </ListboxItem>

                            </ListboxSection>

                          </Listbox>
                    </div>

                  </div>
              </section>

              :

              <div 
                className="flex flex-col items-center justify-center"
                style={{paddingTop:`calc(4rem + ${getPaddingForPlatform()})`, height:`calc(100vh)`}}  
              >
                <Spinner size="lg" />
              </div>
        }

      </div>


      <div 
        className="fixed card p-2 w-full flex justify-center items-end"
        style={{opacity:1, bottom:"25px", zIndex:50}}
      >

        <div
          className="p-2"
          style={{ borderRadius: "50%", zIndex: 50 }}
        >

        <Popover backdrop="opaque" showArrow placement="bottom-start">
          <PopoverTrigger>

          <Button isDisabled={likesCount >= maxLikes} radius="lg" style={{ width: "62px", height: "62px" }} size="lg" isIconOnly color="success" variant="shadow">
            <GiftIcon className="size-7 text-white"/>
          </Button>

          </PopoverTrigger>
          <PopoverContent className="p-1 backdrop-blur bg-background/90 backdrop-saturate-150">
            <SendGiftCard userIds={user} user={UserData}/>
          </PopoverContent>
        </Popover>

        </div>

        <div
          className="p-2 "
          style={{ borderRadius: "50%", zIndex: 50 }}
        >
           {likesCount >= maxLikes ? (
            <PopOverPerimum isOpen={true}>
              <Button isDisabled={true} radius="full" style={{ width: "62px", height: "62px" }} size="lg" isIconOnly color="secondary" variant="shadow" className="flex items-center justify-center">
                <LockIcon style={{ width: "2.5rem", height: "2.5rem" }} className="size-8" />
              </Button>
            </PopOverPerimum>
          ) : (
            <SparklesHeartText
              text={
                <Button isDisabled={likedUser || liked || match} isLoading={requestLoading} radius="lg" style={{ width: "72px", height: "72px" }} size="lg" isIconOnly onPress={handleLikeUser} color="secondary" variant="shadow" className="flex items-center justify-center">
                  <LikeIcon className="size-9"/>
                </Button>
              }
              colors={{ first: "#ff4b61", second: "#A8B2BD" }}
              sparklesCount={5} 
            />
          )}
        </div>


        <div
          className="p-2"
          style={{ borderRadius: "50%", zIndex: 50 }}
        >   

          <Popover backdrop="opaque" showArrow placement="bottom-end">
            <PopoverTrigger>

            <Button isDisabled={likesCount >= maxLikes} radius="lg" style={{ width: "62px", height: "62px" }} size="lg" isIconOnly color="warning" variant="shadow">
              <ChatIcon className="size-7 text-white"/>
            </Button>

            </PopoverTrigger>
            <PopoverContent className="p-1 backdrop-blur bg-background/90 backdrop-saturate-150">
              <FlashMessageCard userIds={user} user={UserData}/>
            </PopoverContent>
          </Popover>
        </div>

      </div>

      <ModalFormReport isOpen={openReportModal} onClose={function (): void {
        setOpenModalReport(false);
      } } reportedUserId={Number(userId)} reporterId={user.id}/>

      <MatchModal
        isOpen={isModalOpen}
        modalData={UserData}
        onClose={closeModal}
        thisUserId={user.id}
      />
 </Page>
  );
}


export const IconWrapper = ({children, className}) => (
  <div style={{borderRadius:"50%"}} className={cn(className, "flex items-center rounded-small justify-center")}>
    {children}
  </div>
);



