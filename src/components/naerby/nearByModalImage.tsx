import {Image} from "@heroui/react";
import { useSwiper } from "swiper/react";

const NearByModalImage = (props) => {
    
    const swiper = useSwiper();

    return <Image onClick={() => swiper.slideNext() } {...props} />
}

export default NearByModalImage