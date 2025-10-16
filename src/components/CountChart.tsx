"use client";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const CountChart = ({ males, females }: { males: number; females: number }) => {
  const data = [
    {
      name: "Total",
      count: females + males,
      fill: "#f5f5f0",
    },

    {
      name: "Female",
      count: females,
      fill: "#8d5f8c",
    },

    {
      name: "Male",
      count: males,
      fill: "#134686",
    },
  ];

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="23%"
          outerRadius="90%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* <Image
        src="/sex_sign.png"
        alt=""
        width={40}
        height={42}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      /> */}
    </div>
  );
};

export default CountChart;
