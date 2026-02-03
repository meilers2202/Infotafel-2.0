"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Weather from "./components/weather";
import Events from "./components/events";
import Fahrplan from "./components/bus";
import LocInfo from "./components/locinfo";
import Foods from "./components/foods";
import Plan from "./components/plan";
import Image from "next/image";
import GenInfo from "./components/geninfo";
import axios from "axios";


export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Keep track of active slide
  const [isTransitioning, setIsTransitioning] = useState(false); // To handle the transition state
  const [backgroundImage, setBackgroundImage] = useState("black_bg.jpg")

  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      const newIndex = emblaApi.selectedScrollSnap();
      setIsTransitioning(true); // Start transition
      setTimeout(() => {
        setActiveIndex(newIndex); // Update active slide index
        setIsTransitioning(false); // End transition after duration
      }, 200); // Match the transition duration (200ms)
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Re-add keybinding for numpad navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Numpad4") {
        scrollPrev(); // Move backward when Numpad4 is pressed
      } else if (event.code === "Numpad6") {
        scrollNext(); // Move forward when Numpad6 is pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollPrev, scrollNext]);


  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await axios.get(
          'http://localhost:1337/api/backgrounds?populate=*&&filters[Aktiv][$eq]=true'
        );
        const backgrounds = response.data.data;

        // Check if there are any active backgrounds
        if (backgrounds.length > 0) {
          // Pick a random background from the active ones
          const randomIndex = Math.floor(Math.random() * backgrounds.length);
          const randomBg = backgrounds[randomIndex];

          // Set the random background to state
          console.log(randomBg.Hintergrund[0].url)
          setBackgroundImage("http://localhost:1337"+randomBg.Hintergrund[0].url)
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchBackground();
  }, []);

  const slides = [
    <Weather key="weather" isActive={activeIndex === 0} />,
    <Foods key="foods" isActive={activeIndex === 1} />,
    <Plan key="plan" isActive={activeIndex === 2} />,
    <Fahrplan key="fahrplan" isActive={activeIndex === 3} />,
    <Events key="events" isActive={activeIndex === 4} />,
    <LocInfo key="locinfo" isActive={activeIndex === 5} />,
    <GenInfo key="geninfo" isActive={activeIndex === 6} />,
  ];

  return (
    <div
      className="bg-cover bg-center w-full flex flex-col p-0 m-0"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        objectFit: "cover",
      }}
    >
      <div className="flex bg-black/65 w-full overflow-hidden lg:overflow-hidden sm:overflow-auto">
        {/* Carousel */}
       <div className="w-full" ref={emblaRef}>
          <div className="flex transition-opacity ease-in-out duration-200">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`embla__slide w-full flex-shrink-0 overflow-y-auto overflow-x-hidden transition-opacity duration-200 pb-32 ${ 
                  index === activeIndex || isTransitioning 
                    ? "opacity-100 visible pointer-events-auto" 
                    : "opacity-0"
                }`}

                aria-hidden={index !== activeIndex}
              >
                {slide}
              </div>
            ))}
          </div>
          {/* Left Arrow */}
          <button
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block ${
              !canScrollPrev ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous Slide"
          >
            <Image src="/arrowleft.png" alt="Previous" width={50} height={50} />
          </button>

          {/* Right Arrow */}
          <button
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block ${
              !canScrollNext ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next Slide"
          >
            <Image src="/arrowright.png" alt="Next" width={50} height={50} />
          </button>
        </div>
      </div>
    </div>
  );
}
