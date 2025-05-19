
/* YearWheelPicker.tsx */
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Wheel from '../core/While';

interface YearWheelPickerProps {
  user: { age?: number; dateBirth?: string }
  setSlideAvailable: (key: string, val: number | string) => void
  setSlideUnAvailable: () => void
  showError?: boolean
}

const YearWheelPicker: React.FC<YearWheelPickerProps> = ({
  user,
  setSlideAvailable,
  setSlideUnAvailable,
  showError = false,
}) => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const maxYear = currentYear - 18

  const years = useMemo(
    () => Array.from({ length: 101 }, (_, i) => maxYear - 100 + i),
    [maxYear]
  )

  const initYear = useMemo(
    () => (user.dateBirth ? new Date(user.dateBirth).getFullYear() : maxYear),
    [user.dateBirth, maxYear]
  )

  const initIndex = useMemo(() => {
    const idx = years.indexOf(initYear)
    return idx >= 0 ? idx : 0
  }, [initYear, years])

  // selectedYear only updates when a new slide is snapped
  const [selectedYear, setSelectedYear] = useState<number>(years[initIndex])

  // only update when slide snaps (via slideChanged), not on every frame
  const handleChange = useCallback(
    (_rel: number, abs: number) => {
      const pos = ((abs % years.length) + years.length) % years.length
      const year = years[pos]
      setSelectedYear((prev) => (prev !== year ? year : prev))
    },
    [years]
  )

  useEffect(() => {
    if (selectedYear != null) {
      setSlideAvailable('dateBirth', `${selectedYear}-01-01`)
      setSlideAvailable('age', currentYear - selectedYear)
    } else {
      setSlideUnAvailable()
    }
  }, [selectedYear, currentYear])

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <h2 className="mb-3 text-lg font-medium">
        Select Birth Year{' '}
        {showError && !selectedYear && <span className="text-red-500">*</span>}
      </h2>
      <div className="w-full max-w-xs h-48">
        <Wheel
          length={years.length}
          width={24}
          loop={true}
          initIdx={initIndex}
          onChange={handleChange}
          getValue={(idx, abs) => {
            const pos = ((abs % years.length) + years.length) % years.length
            return years[(pos + idx) % years.length]
          }}
        />
      </div>
    </div>
  )
}

export default YearWheelPicker
