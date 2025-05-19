/* Wheel.tsx */
import React, { useRef, useState, useCallback, useMemo } from 'react'
import { KeenSliderOptions, TrackDetails, useKeenSlider } from 'keen-slider/react'
import './style.css'

interface WheelProps {
  initIdx?: number
  label?: string
  length: number
  loop?: boolean
  perspective?: 'left' | 'right' | 'center'
  setValue?: (relative: number, absolute: number) => string | number
  width: number
}

const Wheel: React.FC<WheelProps> = React.memo(({
  initIdx = 0,
  label = '',
  length: slides,
  loop = false,
  perspective = 'center',
  setValue,
  width,
}) => {
  const wheelSize = 20
  const slideDegree = 360 / wheelSize
  const slidesPerView = loop ? 9 : 1
  const [sliderState, setSliderState] = useState<TrackDetails | null>(null)
  const sizeRef = useRef(0)
  const radius = sizeRef.current / 2

  const options = useMemo<KeenSliderOptions>(() => ({
    slides: { number: slides, origin: loop ? 'center' : 'auto', perView: slidesPerView },
    vertical: true,
    initial: initIdx,
    loop,
    dragSpeed: (val) => {
      const height = sizeRef.current
      return (
        val *
        (height / ((height / 2) * Math.tan((slideDegree * Math.PI) / 180)) / slidesPerView)
      )
    },
    rubberband: !loop,
    mode: 'free-snap',
    created: (s) => sizeRef.current = s.size,
    updated: (s) => sizeRef.current = s.size,
    detailsChanged: (s) => setSliderState(s.track.details),
  }), [slides, initIdx, loop, slidesPerView, slideDegree])

  const [sliderRef] = useKeenSlider<HTMLDivElement>(options)

  const slideValues = useCallback(() => {
    if (!sliderState) return []
    const offset = loop ? 0.5 - 0.5 / slidesPerView : 0
    return Array.from({ length: slides }).map((_, i) => {
      const distance = (sliderState.slides[i].distance - offset) * slidesPerView
      const rotate = Math.abs(distance) > wheelSize / 2 ? 180 : distance * slideDegree * -1
      const style = { transform: `rotateX(${rotate}deg) translateZ(${radius}px)` }
      const value = setValue ? setValue(i, sliderState.abs + Math.round(distance)) : i
      return { style, value }
    })
  }, [sliderState, slides, loop, slidesPerView, wheelSize, slideDegree, radius, setValue])

  return (
    <div ref={sliderRef} className={`wheel keen-slider wheel--perspective-${perspective}`}>
      <div className="wheel__shadow-top" style={{ transform: `translateZ(${radius}px)` }} />
      <div className="wheel__inner">
        <div className="wheel__slides" style={{ width: `${width}px` }}>
          {slideValues().map(({ style, value }, idx) => (
            <div key={idx} className="wheel__slide" style={style}>
              <span>{value}</span>
            </div>
          ))}
        </div>
        {label && (
          <div className="wheel__label" style={{ transform: `translateZ(${radius}px)` }}>
            {label}
          </div>
        )}
      </div>
      <div className="wheel__shadow-bottom" style={{ transform: `translateZ(${radius}px)` }} />
    </div>
  )
})

export default Wheel