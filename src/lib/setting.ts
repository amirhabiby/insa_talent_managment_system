export const ITEM_PER_PAGE = 9;

type RouteAccessMap = {
  [key: string]: string[]; // route path to array of roles
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/talent(.*)": ["talent"],
  "/list/mentors": ["admin", "mentor"],
  "/list/cybersecurity": ["admin", "mentor"],
  "/list/embedded": ["admin", "mentor"],
  "/list/aerospace": ["admin", "mentor"],
  "/list/softwaredevelopment": ["admin", "mentor"],
  "/list/announcements": ["admin", "mentor", "talent"],
};
