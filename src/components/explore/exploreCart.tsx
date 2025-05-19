// ExploreCard.jsx
import 'swiper/css';
import 'swiper/css/pagination';
import './style.css';

import React, { useMemo } from 'react';
import { Card, CardFooter, Chip } from '@heroui/react';
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import SwiperImages from './swiperImage';
import ParallaxText from '../animate/text-slider';
import ExploreCartData from './exploreCartData';
import { gethobbies, getStaticData } from '@/constant';
import { useTranslation } from 'react-i18next';
import {
  HashtagIcon,
  HeartIconOutLine,
  HeightIcon,
  LanguageIcon,
  VerifyIconFill
} from '@/Icons/index';

// Hoist these so they aren’t recreated every render
const containerStyle = {
  width: '100%',
  maxHeight: '100%',
  overflow: 'scroll',
  cursor: 'grab',
  display: 'flex',
  justifyContent: 'center'
};
const wrapperStyle = { width: 'calc(100% - 36px)' };

const ExploreCard = ({ profile }) => {
  const { t } = useTranslation();

  // Only depend on t, not on whole `profile`
  const hobbies = useMemo(() => gethobbies(t), [t]);
  const staticData = useMemo(() => getStaticData(t), [t]);
  const slide = useSwiperSlide();

  // Build fast lookup maps
  const hobbyMap = useMemo(
    () => Object.fromEntries(hobbies.map(h => [h.id, h.name])),
    [hobbies]
  );
  const relationMap = useMemo(
    () => Object.fromEntries(staticData.RealationStatus.map(r => [r.key, r.label])),
    [staticData]
  );
  const languageMap = useMemo(
    () => Object.fromEntries(staticData.languages.map(l => [l.key, l.label])),
    [staticData]
  );

  return (
    <div style={containerStyle}>
      <div className="py-2" style={wrapperStyle}>
        <Card shadow="none" radius="lg" className="w-full col-span-12 sm:col-span-7 border-0 shadow-0">
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            pagination={{ clickable: false }}
            navigation={false}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {profile.photos.length === 0 ? (
              <SwiperSlide key="empty">
                <SwiperImages url="https://via.placeholder.com/400x500" />
              </SwiperSlide>
            ) : (
              profile.photos.map((p, i) => (
                <SwiperSlide key={p.id ?? i}>
                  <SwiperImages url={p.large} />
                </SwiperSlide>
              ))
            )}
          </Swiper>

          <div className="absolute bottom-0 z-10 w-full" style={{ overflow: 'hidden' }}>
            <CardFooter
              className="items-start gap-1 px-0 border-0 flex-col py-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
              style={{ height: '100%', maxHeight: '100%', overflow: 'hidden' }}
            >
              <ParallaxText duration={30} disableAnimation={!slide.isActive}>
                {Array.isArray(profile.interests) &&
                  profile.interests.map(id => (
                    <Chip
                      key={id}
                      variant="solid"
                      size="sm"
                      className="mx-2 backdrop-blur bg-success/40 backdrop-saturate-150"
                      startContent={<HashtagIcon className="size-4 mx-1" />}
                      style={{ marginRight: 10 }}
                    >
                      {hobbyMap[+id]}
                    </Chip>
                  ))}
              </ParallaxText>

              <ParallaxText duration={40} disableAnimation={!slide.isActive}>
                <Chip
                  key="relation"
                  variant="solid"
                  size="sm"
                  color="primary"
                  className="mx-1 backdrop-blur bg-primary/60 backdrop-saturate-150"
                  startContent={<HeartIconOutLine fill="#FFF" className="size-4 mx-1" />}
                >
                  {relationMap[profile.moreAboutMe.relationStatus]}
                </Chip>

                <Chip
                  key="height"
                  variant="solid"
                  size="sm"
                  color="primary"
                  className="mx-1 backdrop-blur bg-primary/60 backdrop-saturate-150"
                  startContent={<HeightIcon fill="#FFF" className="size-4 mx-1" />}
                >
                  {profile.moreAboutMe.height}
                </Chip>

                {profile.moreAboutMe.languages.map(langKey => (
                  <Chip
                    key={langKey}
                    variant="solid"
                    size="sm"
                    color="primary"
                    className="mx-1 backdrop-blur bg-primary/60 backdrop-saturate-150"
                    startContent={<LanguageIcon className="size-4 mx-1" />}
                  >
                    {languageMap[langKey]}
                  </Chip>
                ))}
              </ParallaxText>

              <div className="flex flex-grow pb-6 w-full px-3" style={{ textAlign: 'start' }}>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <p className="text-white capitalize font-bold text-xl">
                        {profile.firstName}, {profile.age}
                      </p>
                      {profile.verifiedAccount && (
                        <VerifyIconFill fill="#21b6a8" className="ml-2 size-6" />
                      )}
                    </div>
                  </div>
                  <ExploreCartData profile={profile} />
                </div>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Now memoize so it only re-renders on prop change
export default React.memo(ExploreCard);
