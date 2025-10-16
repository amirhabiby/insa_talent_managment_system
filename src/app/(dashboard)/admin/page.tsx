import CountChartContainer from "@/components/CounterChartContainer";
import EventCalendar from "@/components/EventCalendar";

import UserCard from "@/components/UserCard";

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="p-2 flex gap-4  flex-col md:flex-row ">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <div className="flex gap-4 justify-between flex-wrap">
            {["development", "cyber", "embedded"].map((type, index) => (
              <UserCard key={type} type={type} isOdd={index % 2 === 0} />
            ))}
          </div>
          {/* MIDDELCHART */}
          <div className="flex gap-4">
            {/*Line Chart */}
            <div className="w-full lg:w-[65%] h-[450px]"></div>
            {/* COUNT CHART */}
            <div className="w-full lg:w-[35%] h-[450px]">
              <CountChartContainer />
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
          {/* <Announcement /> */}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
