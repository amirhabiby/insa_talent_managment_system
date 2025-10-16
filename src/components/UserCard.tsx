import Image from "next/image";
import Counter from "@/components/Counter";
import { prisma } from "@/lib/prisma";

const UserCard = async ({ type, isOdd }: { type: string; isOdd: boolean }) => {
  const modelMap: Record<string, any> = {
    development: prisma.application.count({
      where: {
        departmentId: "f42712f4-658a-4182-b548-c2b18f7e509b",
      },
    }),
    cyber: prisma.application.count({
      where: {
        departmentId: "86adcba9-0e83-44e8-8c2c-02e7a4631576",
      },
    }),
    embedded: prisma.application.count({
      where: {
        departmentId: "52f53291-cef8-41a3-9c94-982549cdc80a",
      },
    }),
  };

  const data = await modelMap[type];

  return (
    <div className="rounded odd:bg-blue even:bg-logopink p-1.5 flex-1 min-w-[130px] shadow-lg">
      <div className="flex justify-between items-center">
        <span
          className={`text-[10px] px-2 py-1 rounded-full
         ${isOdd ? "text-white" : "text-white"}`}
        >
          2024/25
        </span>
        <Image
          className="cursor-pointer"
          src="/dotnobg.png"
          alt="dots"
          width={35}
          height={35}
        />
      </div>
      <h1
        className={`text-xl font-medium my-2 px-2 ${
          isOdd ? "text-white" : "text-white"
        }`}
      >
        <Counter target={data} />
      </h1>
      <h2
        className={`capitalize text-sm font-medium px-2 ${
          isOdd ? "text-white" : "text-white"
        }`}
      >
        {type}
      </h2>
    </div>
  );
};

export default UserCard;
