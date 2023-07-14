import React, { useState, useRef, useEffect } from "react";
import "./RangeSlider.css";

const RangeSlider = () => {
  const [sliderValues, setSliderValues] = useState({
    minValue: 1980,
    maxValue: 2023
  });

  const sliderRef = useRef(null);
  const thumbMinRef = useRef(null);
  const thumbMaxRef = useRef(null);
  const trackRef = useRef(null);
  const isDragging = useRef(false);

  const handleThumbMouseDown = (thumbRef) => {
    return (event) => {
      event.preventDefault();
      isDragging.current = true;
      thumbRef.current.classList.add("active");
    };
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    if (isDragging.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const offsetX = event.clientX - sliderRect.left;
      const sliderWidth = sliderRect.width;
      const minValue = sliderValues.minValue;
      const maxValue = sliderValues.maxValue;
      const valueRange = maxValue - minValue;
      const pixelRange = sliderWidth;
      const percent = (offsetX / pixelRange) * 100;
      const value = Math.round((valueRange * percent) / 100 + minValue);

      if (thumbMinRef.current.classList.contains("active")) {
        const newMinValue = Math.min(value, sliderValues.maxValue);
        if (newMinValue < sliderValues.minValue) return;
        setSliderValues((prevState) => ({
          ...prevState,
          minValue: newMinValue,
          maxValue: Math.max(newMinValue, prevState.maxValue)
        }));
      } else if (thumbMaxRef.current.classList.contains("active")) {
        const newMaxValue = Math.min(value, sliderValues.maxValue);
        setSliderValues((prevState) => ({
          ...prevState,
          minValue: Math.min(prevState.minValue, newMaxValue),
          maxValue: newMaxValue
        }));
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      thumbMinRef.current.classList.remove("active");
      thumbMaxRef.current.classList.remove("active");
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };
  const handleTouchMove = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - sliderRect.left;

    const fakeMouseEvent = new MouseEvent("mousemove", {
      clientX: offsetX,
      clientY: touch.clientY,
      pageX: touch.pageX,
      pageY: touch.pageY,
      screenX: touch.screenX,
      screenY: touch.screenY
    });

    handleMouseMove(fakeMouseEvent);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    thumbMinRef.current.classList.remove("active");
    thumbMaxRef.current.classList.remove("active");
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);

      document.removeEventListener("touchmove", handleTouchMove, {
        passive: false
      });
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="slider" ref={sliderRef}>
      <div
        className="track"
        ref={trackRef}
        style={{
          left: `${((sliderValues.minValue - 1980) / (2023 - 1980)) * 100}%`,
          width: `${
            ((sliderValues.maxValue - sliderValues.minValue) / (2023 - 1980)) *
            100
          }%`
        }}
      />
      <div
        className="thumb thumb-min"
        ref={thumbMinRef}
        style={{
          left: `${((sliderValues.minValue - 1980) / (2023 - 1980)) * 100}%`,
          transform: `translateX(-${
            ((sliderValues.minValue - 1980) / (2023 - 1980)) * 100
          }%)`
        }}
        onMouseDown={handleThumbMouseDown(thumbMinRef)}
        onTouchStart={handleThumbMouseDown(thumbMinRef)}
      >
        <label>{sliderValues.minValue}</label>
      </div>
      <div
        className="thumb thumb-max"
        ref={thumbMaxRef}
        style={{
          left: `${((sliderValues.maxValue - 1980) / (2023 - 1980)) * 100}%`,
          transform: `translateX(-${
            ((sliderValues.maxValue - 1980) / (2023 - 1980)) * 100
          }%)`
        }}
        onMouseDown={handleThumbMouseDown(thumbMaxRef)}
        onTouchStart={handleThumbMouseDown(thumbMaxRef)}
      >
        <label>{sliderValues.maxValue}</label>
      </div>
    </div>
  );
};

export default RangeSlider;
