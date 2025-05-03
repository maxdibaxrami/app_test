import { Card, CardHeader, Image } from "@heroui/react";
import { BASEURL } from "@/constant";
import { VerifyIconFill, PerimumIcon } from "@/Icons";
import { Link } from "react-router-dom";

const NearByCard = ({ data }) => {
  
  return (
    <Card
    as={Link}
    to={`/user?userId=${data.id}`}
    className="col-span-12 sm:col-span-4 h-[100%]">
        <CardHeader className="absolute z-10 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex-col !items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">{`${data.country}, ${data.city}`}</p>
          <h4 className="font-bold text-white/90 flex items-center truncate gap-1 text-large">
          <span className="truncate">{`${data.firstName}`} </span>
          <span className="flex items-center">
            {data.verifiedAccount && <VerifyIconFill fill="#21b6a8" className="size-5"/>}
            {data.premium && <PerimumIcon className="size-5"/>}
          </span>
        </h4> 
        </CardHeader>
        <Image
          removeWrapper
          loading="lazy"
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={`${BASEURL}${data.photo}`}
        />
      </Card>

  );
};

export default NearByCard;
