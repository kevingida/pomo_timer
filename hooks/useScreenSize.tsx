"use client";
import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });
  const sm = screenSize.width >= 640;
  const md = screenSize.width >= 768;
  const lg = screenSize.width >= 1024;
  const xl = screenSize.width >= 1280;

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { screenSize, sm, md, lg, xl };
};

export default useScreenSize;
