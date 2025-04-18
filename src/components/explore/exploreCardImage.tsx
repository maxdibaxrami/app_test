import {Image} from "@heroui/react";
import { useSwiper } from "swiper/react";

const ExploreCardImage = (props) => {
    
    const swiper = useSwiper();

    return <Image draggable="false" onClick={() => swiper.slideNext() } {...props} />
}

export default ExploreCardImage