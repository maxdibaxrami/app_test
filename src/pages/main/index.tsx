// src/pages/MainPage.tsx
import React, { useRef, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import { Page } from '@/components/Page'
import TopBar from '@/components/tobBar/index'
import NearByFilter from '@/components/naerby/NearByFilter'
import { Button } from '@heroui/button'
import { FitlerIcon } from '@/Icons'
import { Navbar, NavbarContent, NavbarItem } from '@heroui/react'
import NavBar from '@/components/NavBar'

const MainPage: React.FC = React.memo(() => {
  const lp = useLaunchParams()
  const location = useLocation()
  const filterRef = useRef(null)

  // only recalc when platform changes
  const paddingTop = useMemo(
    () => (['ios'].includes(lp.platform) ? '50px' : '25px'),
    [lp.platform]
  )

  // show the filter FAB only on the “nearby” sub‑route
  const showFilter = location.pathname.endsWith('/explore')

  const handleFilterClick = () => {
    filterRef.current?.openModal()
  }

  return (
    <Page back={false}>
      <TopBar />

      <section
        style={{ paddingTop }}
        className="flex relative flex-col items-center justify-center gap-4"
      >
        <Outlet />

        {showFilter && (
          <div
            className="fixed z-50 left-1/2 transform -translate-x-1/2 bottom-8 fade-in"
          >
            <Button
              variant="shadow"
              size="md"
              onPress={handleFilterClick}
              radius="lg"
              isIconOnly
              aria-label="Filter"
              color="primary"
              className="bg-primary/80 backdrop-blur"
            >
              <FitlerIcon className="size-5" />
            </Button>
          </div>
        )}

          <div
            className="fixed w-full z-50 left-1/2 transform -translate-x-1/2 bottom-0 fade-in"
          >
            <Navbar style={{ zIndex:1000 }} className="px-1 w-full safe-area-bottom---padding  flex items-start justify-center pb-2">
              <NavbarContent className="w-full" justify="center">
                <NavbarItem className="w-full">
                  <NavBar />
                </NavbarItem>
              </NavbarContent>
            </Navbar>

           </div>
      </section>





      <NearByFilter ref={filterRef} />
    </Page>
  )
})

export default MainPage
