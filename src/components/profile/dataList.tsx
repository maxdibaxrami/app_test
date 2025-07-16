import { Listbox, ListboxItem, Chip, cn, Spinner } from "@heroui/react";
import { ArrowRight } from "@/Icons/index";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const DataList = ({user, verifiedAccountLoading}) => {

  const { t, i18n } = useTranslation();  // Initialize translation hook
  const { data } = useSelector((state: RootState) => state.like);  // Assuming the like slice is in state.like

  return (
    <div className="w-full mt-3 text-default-700 bg-neutral/10 border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      <Listbox aria-label={t('listbox_aria_label')} variant="solid">
        {user.verifiedAccount === false &&      
          <ListboxItem
            key="verify_account"
            href={"/#/verify-account"}
            showDivider
            isDisabled={verifiedAccountLoading}
            description={t("Boost_Your_Trustworthiness")}
            classNames={{"description":"font-wrap w-[90%]"}}
            className="px-0 w-full"
            startContent={
              <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary"> 
                <p className="text-md">⭐️</p>
              </IconWrapper>
            }
            endContent={
              verifiedAccountLoading ?
                  <Spinner size="sm" />
                :
                <ArrowRight className="size-6 mx-1" style={{transform:`${i18n.language==="ar" || i18n.language === 'fa'?"rotate(180deg)":"rotate(0deg)"}`}}/>
              }
            
          >
          <p className="font-semibold">{t("Verification")}</p>
          </ListboxItem>     
        }
        
        <ListboxItem
          key="edit_profile"
          showDivider
          href={"/#/profile-edit"}
          description={t('edit_profile')}
          className="px-0 w-full"
          classNames={{"description":"font-wrap w-[90%]"}}
          endContent={
            <ArrowRight className="size-6 mx-1" style={{transform:`${i18n.language==="ar" || i18n.language === 'fa'?"rotate(180deg)":"rotate(0deg)"}`}}/>
          }
          
          startContent={
            <IconWrapper className=" aspect-square flex items-center p-0 w-10 h-10 text-primary"> 
                <p className="text-md">👤</p>
            </IconWrapper>
          }
        >
          <p className="font-semibold">{t('profile')}</p>
        </ListboxItem>

        <ListboxItem
          key="see_gift"
          href={"/#/gift-view"}
          showDivider
          description={t('list_of_users_send_you_gift')}
          className="px-0 w-full"
          classNames={{"description":"font-wrap w-[90%]"}}
          endContent={user && user.giftUsers.length === 0? <ArrowRight className="size-6 mx-1" style={{transform:`${i18n.language==="ar" || i18n.language === 'fa'?"rotate(180deg)":"rotate(0deg)"}`}}/> : <Chip color="warning"> {user.giftUsers.length} </Chip>  }
          startContent={
            <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary"> 
                <p className="text-md">🎁</p>
            </IconWrapper>
          }
        >
          <p className="font-semibold">{t('gift_List')}</p>
        </ListboxItem>

        <ListboxItem
          key="see_likes"
          href={"/#/main/likes"}
          showDivider
          description={t('see_likes')}
          classNames={{"description":"font-wrap w-[90%]"}}
          className="px-0 w-full"
          endContent={data && data.length === 0? <ArrowRight className="size-6 mx-1" style={{transform:`${i18n.language==="ar" || i18n.language === 'fa'?"rotate(180deg)":"rotate(0deg)"}`}}/> : <Chip color="warning">{data && data.length}</Chip>  }
          startContent={
            <IconWrapper className=" aspect-square flex items-center p-0 w-10 h-10 text-primary"> 
                <p className="text-md">👍</p>
            </IconWrapper>
          }
        >
          <p className="font-semibold">{t('who_like_you')}</p>
        </ListboxItem>
        <ListboxItem
          key="see_views"
          description={t('see_views')}
          href={"/#/profile-view"}
          showDivider
          classNames={{"description":"font-wrap w-[90%]"}}
          className="px-0 w-full"
          endContent={user && user.profileViews.length === 0? <ArrowRight className="size-6 mx-1" style={{transform:`${i18n.language==="ar" || i18n.language === 'fa'?"rotate(180deg)":"rotate(0deg)"}`}}/> : <Chip color="warning">{user && user.profileViews.length}</Chip>  }
          startContent={
            <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary"> 
                <p className="text-md">👁</p>
            </IconWrapper>
          }
        >
          <p className="font-semibold">{t('who_viewed_profile')}</p>
        </ListboxItem>


        <ListboxItem
          key="favorite_users"
          description={t('list_of_favorite_users')}
          href={"/#/favorite-view"}
          className="px-0 w-full"
          showDivider
          classNames={{"description":"font-wrap w-[90%]"}}
          endContent={user && user.favoriteUsers.length === 0? <ArrowRight className="size-6 mx-1" style={{transform:`${i18n.language==="ar" || i18n.language === 'fa'?"rotate(180deg)":"rotate(0deg)"}`}}/> : <Chip color="warning">{user && user.favoriteUsers.length}</Chip>}
          startContent={
            <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary"> 
                <p className="text-md">💛</p>
            </IconWrapper>
          }
        >
          <p className="font-semibold">{t('favorite')} </p>
        </ListboxItem>


        <ListboxItem
          key="support"
          description={t('form_message_us')}
          href={`/#/chat-detail?user1=${user.id}&user2=${1}`}
          className="px-0 w-full"
          classNames={{"description":"font-wrap w-[90%]"}}
          endContent={<ArrowRight className="size-6 mx-1" style={{transform:`${i18n.language==="ar" || i18n.language === 'fa'?"rotate(180deg)":"rotate(0deg)"}`}}/>}
          startContent={
            <IconWrapper className="aspect-square flex items-center p-0 w-10 h-10 text-primary"> 
                <p className="text-md">💭</p>
            </IconWrapper>
          }
        >
          <p className="font-semibold">{t('support')} </p>
        </ListboxItem>



      </Listbox>
    </div>
  );
};

export default DataList;


export const IconWrapper = ({children, className}) => (
  <div className={cn(className, "flex items-center bg-default/20 rounded-small justify-center")}>
    {children}
  </div>
);