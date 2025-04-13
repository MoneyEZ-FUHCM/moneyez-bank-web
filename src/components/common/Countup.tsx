"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const CountupCustom = ({
  value,
  className = "text-center",
}: {
  value: number;
  className?: string;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) setStartCount(true);
  }, [inView]);

  return (
    <div ref={ref} className={`${className} font-bold`}>
      {startCount && <CountUp start={0} end={value} duration={3} />}
    </div>
  );
};

export { CountupCustom };
