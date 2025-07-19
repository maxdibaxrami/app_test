import 'swiper/css';
import 'swiper/css/pagination';
import './style.css';

import { useMemo } from "react";
import { Card, CardFooter, Chip } from "@heroui/react";
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import SwiperImages from './swiperImage';
import { Pagination, Autoplay } from 'swiper/modules';
import { HashtagIcon, HeartIconOutLine, HeightIcon, LanguageIcon, LocationIcon, VerifyIconFill } from '@/Icons/index';
import ExploreCartData from './exploreCartData';
import ParallaxText from '../animate/text-slider';
import { gethobbies, getStaticData } from '@/constant';
import { useTranslation } from 'react-i18next';

const ExploreCard = (props) => {
  const { t } = useTranslation();
    
  const hobbies = useMemo(() => gethobbies(t), [t,props.profile]);
  const staticData = useMemo(() => getStaticData(t), [t,props.profile]);
  const swiperSlide = useSwiperSlide();

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="swiper-pagination-bullet ' + className + '">' + (index + 1) + '</span>';
    },
  };


  return (
    <>
      <div
        style={{
          width: "calc(100%)",
          maxHeight: "100%",
          overflow: "scroll",
          cursor: "grab",
          display: "flex",
          justifyContent: "center",
        }}
        
      >
        <div className='py-2' style={{ width: "calc(100% - 36px)" }}>
          <Card shadow='none' radius="lg" className="w-full relative col-span-12 sm:col-span-7 border-0 shadow-0">
            {props?.profile.city && 
              <Chip startContent={<LocationIcon className="size-5 mx-1 text-white"/>} className='absolute z-50 font-bold top-2 text-white left-2' color="primary" variant="flat">
                {props?.profile.city}
              </Chip>
            }
                   
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              pagination={pagination}
              navigation={false}
              modules={[Pagination, Autoplay]}
              className="mySwiper"
            >
                  {props?.profile?.photos.length === 0 ?
                    <SwiperSlide key={0}>
                      <SwiperImages url={"https://via.placeholder.com/400x500"} />
                    </SwiperSlide>
                
                  :
                    props?.profile?.photos?.map((value, index) => (
                      <SwiperSlide key={index+index}>
                        <SwiperImages url={value.large} />
                      </SwiperSlide>
                    ))
                  }
                  
            </Swiper>
            

            <div
              style={{ overflow: "hidden" }}
              className="absolute bottom-0 z-10 w-full"
            >
              <div className="relative h-full w-full">
                <CardFooter
                    style={{ height: "100%", maxHeight:"100%" , overflow:"hidden"}}
                    className="items-start gap-1 px-0 border-0 flex-col py-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
                >

              <ParallaxText duration={30} disableAnimation={!swiperSlide.isActive}>
                {Array.isArray(props.profile.interests) && props.profile.interests.length > 0?
                  props.profile.interests.map((value)=> {
                    const interests = hobbies.find(hobbie => hobbie.id == parseInt(value))
                    
                    return <Chip
                              variant="solid"
                              size="sm"
                              className="mx-2 backdrop-blur bg-success/40 backdrop-saturate-150"
                              style={{ marginRight: "10px" }}
                            >
                              {interests.emoji} {interests.name}
                          </Chip>
                        })
                        : null
                }
                
              </ParallaxText>


              <ParallaxText duration={40} disableAnimation={!swiperSlide.isActive}>
                <Chip
                  variant="solid"
                  size="sm"
                  color="primary"
                  className="mx-1 backdrop-blur bg-primary/60 backdrop-saturate-150"
                  startContent={<HeartIconOutLine fill="#FFF" className="size-4 mx-1" />}
                >
                  {staticData.RealationStatus.find(RealationStatus => RealationStatus.key == props.profile.moreAboutMe.relationStatus).label}
                </Chip>

                <Chip
                  variant="solid"
                  color="primary"
                  size="sm"
                  className="mx-1 backdrop-blur bg-primary/60 backdrop-saturate-150"

                  startContent={<HeightIcon fill="#FFF" className="size-4 mx-1" />}
                >
                  {props.profile.moreAboutMe.height}
                </Chip>

                    {props.profile.moreAboutMe.languages.map((value)=> staticData.languages.find(languages => languages.key === value).label).map((value,index)=>{
                          return <Chip
                          variant="solid"
                          color="primary"
                          className="mx-1 backdrop-blur bg-primary/60 backdrop-saturate-150"
                          key={index}
                          size="sm"
                          startContent={<LanguageIcon className="size-4  mx-1" />}
                        >
                          {value}
      
                        </Chip>
                      })}

              </ParallaxText>

                  <div style={{textAlign:"start"}} className="flex flex-grow pb-6 w-full px-3">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <p className="text-white capitalize font-bold text-xl">
                            {props.profile.firstName}, {props.profile.age}
                          </p>
                          {props.profile.verifiedAccount && <VerifyIconFill fill="#21b6a8" className="ml-2 size-6"/>}
                           
                        </div>
                      </div>

                      <ExploreCartData profile={props.profile} />
                    </div>
                  </div>
                </CardFooter>
              </div>
            </div>
          </Card>
        </div>
      </div>

    </>
  );
};

export default ExploreCard;
