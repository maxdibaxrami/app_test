import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { BASEURL } from "@/constant";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PerimumIcon, VerifyIconFill } from "@/Icons";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const LikeCard = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: user } = useSelector((state: RootState) => state.user);

  return (
    <Card
      as={Link}
      to={user.premium ? `/main/likes?user=${data.id}` : "/main/likes"}
      className={user.premium ? "py-4 h-[100%] " : "py-4 h-[100%] blurred-image" } 
      isPressable
    >
    <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
      <small className={"text-default-500 truncate"}>{`${data.country}, ${data.city}`}</small>
      <h4 className={"font-bold  flex items-center gap-1 text-large"}>
        <span className={"truncate"}>{`${data.firstName}`} </span>
        <span className="flex items-center">
          {data.verifiedAccount && <VerifyIconFill fill="#21b6a8" className="size-5"/>}
          {data.premium && <PerimumIcon className="size-5"/>}
        </span>
      </h4>                                      
    </CardHeader>
    <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className={user.premium ? "object-cover h-full w-full rounded-xl" : "object-cover h-full w-full rounded-xl blurred-image"}
          style={{ aspectRatio: "3/4" }}
          classNames={{"wrapper":"aspackt-image"}}
          isLoading={isLoading}
          src={data.photos[0] && `${BASEURL}${data.photos[0].url}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
      
        />
    </CardBody>
  </Card>
  );
};

export default LikeCard;


