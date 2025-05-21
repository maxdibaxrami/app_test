import { Card, CardFooter, Image } from "@heroui/react";
import { BASEURL } from "@/constant";
import { PerimumIcon, VerifyIconFill } from "@/Icons";
import { Link } from "react-router-dom";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const ProfileViewCard = ({ data }) => {
  const { data: user } = useSelector((state: RootState) => state.user);

  return (
      <Card
        isFooterBlurred
        isDisabled={false}
        radius="lg"
        isPressable
        className="border-none aspect-square w-full relative"
        as={Link}
        to={user.premium ? `/profile-view?user=${data.id}` : '/profile-view'}

      >
        <Image
          alt="Woman listing to music"
          className="object-cover w-full h-full shadow-small"
          classNames={{
            wrapper:"w-full aspect-square h-full maxcontentimportant",
            img : user.premium ? "w-full aspect-square h-full " :"w-full aspect-square h-full blurred-image"
          }}
          loading="lazy"
          src={`${BASEURL}${data.imageUrl}`}
          style={{ width: "100%", height: "100%",maxWidth:"unset" }}
        />


          <CardFooter style={{height:"42px", visibility:user.premium? "unset" : "hidden"}} className="justify-between border-0 border-transparent z-10 bg-background/70 overflow-hidden py-1 absolute before:rounded-xl bottom-0 z-10">
            
            <div className=" w-full">
                <div className="flex justify-between items-center">
                  <p style={{textAlign:"start"}} className="flex items-center text-tiny text-foreground/80 text-handller">
                    {`${data.firstName} ${data.age}`}

                   {data.verifiedAccount && <VerifyIconFill fill="#21b6a8" className="ml-2 size-6"/> }
                   {data.premium && <PerimumIcon />}
                  </p>
                  
                </div>
              </div>

        </CardFooter>
      </Card>
  );
};

export default ProfileViewCard;
