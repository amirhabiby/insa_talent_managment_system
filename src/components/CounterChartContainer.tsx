import Image from "next/image";
import CountChart from "./CountChart";

import Counter from "@/components/Counter";

const CountChartContainer = async () => {
  const males = 48;
  const females = 64;

  return (
    <div className=" bg-white rounded-xl w-full h-full p-4 shadow">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-blue">Registered Talents</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      <CountChart males={males} females={females} />
      {/* BOTTOM    */}
      <div className="flex judtify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-logopink rounded-full" />
          <h1 className="font-bold text-blue">
            <Counter target={females} />
          </h1>
          <h2 className="text-xs text-blue">
            Females ({Math.round((females / (males + females)) * 100)}%)
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-blue rounded-full" />
          <h1 className="font-bold text-blue">
            <Counter target={males} />
          </h1>
          <h2 className="text-xs text-blue">
            Male ({Math.round((males / (males + females)) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
