const Announcement = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex item-center justify-between">
        <h1 className="text-xl font-semibold text-darkblue">Medical Tips</h1>
        <span className="text-xs text-darkblue">View All</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-fadedwhite rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-darkblue">Lorem ipsum</h2>
            <span className="text-xs text-darkblue bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="mt-1 text-sm text-darkblue">
            Drink Two Litters of Water every day
          </p>
        </div>

        <div className="bg-fadedwhite rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-darkblue">Lorem ipsum</h2>
            <span className="text-xs text-darkblue bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="mt-1 text-sm text-darkblue">Description...</p>
        </div>

        <div className="bg-fadedwhite rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-darkblue">Lorem ipsum</h2>
            <span className="text-xs text-darkblue bg-white rounded-md px-1 py-1">
              2025-01-01
            </span>
          </div>
          <p className="mt-1 text-sm text-darkblue">Description...</p>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
