import { Button } from "@heroui/react"
import { Link } from "react-router-dom"
import { FlashIcon } from "@/Icons"
import { RootState } from "@/store"
import { useSelector } from "react-redux"

export const EnergyButton = () => {
  const { data: user } = useSelector((state: RootState) => state.user);

    return <Button
        variant="solid"
        size="sm"
        aria-label="Energy"
        color="success"
        as={Link}
        to={'/energy'}
        style={{minWidth:"unset"}}
        className="px-1 gap-1 text-start h-6 text-white"
      >
          <FlashIcon fill="#FFFFFF" className="size-4" />
          { user && user.rewardPoints}
      </Button>
}