import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        // visible: [],
      },

      {
        icon: "/mentor_icon.png",
        label: "Mentors",
        href: "/list/mentors",
        // visible: [],
      },

      {
        icon: "/softwaredev_icon.png",
        label: "Development",
        href: "/list/development",
        // visible: [],
      },

      {
        icon: "/cyber_icon.png",
        label: "CyberSecurity",
        href: "/list/cybersecurity",
        // visible: [],
      },

      {
        icon: "/Embeded_icon.png",
        label: "Embedded Systems",
        href: "/list/embededsystems",
        // visible: [],
      },

      {
        icon: "/aerospace_icon.jpg",
        label: "Aerospace",
        href: "/list/embededsystems",
        // visible: [],
      },

      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        // visible: [],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        // visible: [],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        // visible: [],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        // visible: [],
      },
    ],
  },
];

// It's part of the Dashboard layout
const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;

  return (
    <div className="mt-3 text-sm  ">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-3" key={i.title}>
          <span className="hidden lg:block text-black font-light my-1">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (true) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-black py-0.5 rounded-sm hover:bg-whitehover md:pl-2"
                >
                  <Image src={item.icon} alt="" width={19} height={19} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
