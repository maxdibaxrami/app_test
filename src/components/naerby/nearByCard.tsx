import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { BASEURL } from "@/constant";
import { Link } from "react-router-dom";
import { VerifyIconFill, PerimumIcon } from "@/Icons";
import { useState } from "react";

const NearByCard = ({ data }) => {
    const [isLoading, setIsLoading] = useState(true);
  
  return (
    <Card
        as={Link}
        to={`/user?userId=${data.id}`}
        className="py-4 h-[100%] bg-neutral/10"
        isPressable
        shadow="none"
        disableAnimation
      >
      <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
        <small className="text-default-500 truncate">{`${data.country}, ${data.city}`}</small>
        <h4 className="font-bold flex items-center truncate gap-1 text-large">
          <span className="truncate">{`${data.firstName}`} </span>
          <span className="flex items-center">
            {data.verifiedAccount && <VerifyIconFill fill="#21b6a8" className="size-5"/>}
            {data.premium && <PerimumIcon className="size-5"/>}
          </span>
        </h4>                                      
      </CardHeader>
      <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover h-full w-full rounded-xl"
            style={{ aspectRatio: "1/1" }}
            classNames={{"wrapper":"aspackt-image-card"}}
            isLoading={isLoading}
            src={`${BASEURL}${data.photo}`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
        
          />
      </CardBody>
    </Card>
 
  );
};

export default NearByCard;
