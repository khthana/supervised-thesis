import { useState, useEffect, useRef } from "react";

interface RangeSliderComponentProps {
  title: string;
  initialMin: number;
  initialMax: number;
  min: number;
  max: number;
  step: number;
  gap: number;
  isStarComponent: boolean;
}

const RangeSliderComponent = ({
  title,
  initialMin,
  initialMax,
  min,
  max,
  step,
  gap,
  isStarComponent
}: RangeSliderComponentProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const [minZIndex, setMinZIndex] = useState(1);
  const [maxZIndex, setMaxZIndex] = useState(0);

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (maxValue - value >= gap && value <= max) {
      setMinValue(value);
      setMinZIndex(value === maxValue ? 2 : 1);
      setMaxZIndex(value === maxValue ? 1 : 0);
    } else if (value < minValue) {
      setMinValue(value);
      setMinZIndex(value === maxValue ? 2 : 1);
      setMaxZIndex(value === maxValue ? 1 : 0);
    }
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value - minValue >= gap && value <= max) {
      setMaxValue(value);
      setMaxZIndex(value === minValue ? 2 : 1);
      setMinZIndex(value === minValue ? 1 : 0);
    } else if (value > maxValue) {
      setMaxValue(value);
      setMaxZIndex(value === minValue ? 2 : 1);
      setMinZIndex(value === minValue ? 1 : 0);
    }
  };

  useEffect(() => {
    if (progressRef.current) {
        if(isStarComponent) {
            progressRef.current.style.left = ((minValue-1) / (max-1)) * 100 + "%";
            progressRef.current.style.right = 100 - ((maxValue-1) / (max-1)) * 100 + "%";
        } else {
            progressRef.current.style.left = (minValue / max) * 100 + "%";
            progressRef.current.style.right = 100 - (maxValue / max) * 100 + "%";
        }
      //console.log(`left ${progressRef.current.style.left}`)
      //console.log(`right ${progressRef.current.style.right}`)
    }
  }, [minValue, maxValue, max]);

  return (
    <div className="flex flex-col w-96 bg-white shadow-xl rounded-lg px-6 py-4">
      <div className="flex flex-row kanit justify-between mb-4">
        <div className="flex">
            {title}
        </div>
        <div className="flex flex-row">
            <div className="flex">
            {minValue}
            </div>
            <div className="flex">
            &nbsp;-&nbsp;
            </div>
            <div className="flex">
            {maxValue}
            </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="slider relative h-1 rounded-md bg-gray-300">
          <div
            className="progress absolute h-1 bg-red-300 rounded "
            ref={progressRef}
          ></div>
        </div>

        <div className="range-input relative  ">
          <input
            onChange={handleMin}
            type="range"
            min={min}
            step={step}
            max={max}
            value={minValue}
            className="range-min absolute w-full  -top-1  h-1   bg-transparent  appearance-none pointer-events-none cursor-pointer"
            style={{ zIndex: minZIndex }}
          />

          <input
            onChange={handleMax}
            type="range"
            min={min}
            step={step}
            max={max}
            value={maxValue}
            className="range-max absolute w-full  -top-1 h-1  bg-transparent appearance-none pointer-events-none cursor-pointer"
            style={{ zIndex: maxZIndex }}
          />
        </div>
      </div>
    </div>
  );
};

export default RangeSliderComponent;
