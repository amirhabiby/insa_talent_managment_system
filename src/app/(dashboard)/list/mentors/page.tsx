import Image from "next/image";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";

import {
  PrismaClient,
  User,
  Mentor,
  Talent,
  Prisma,
  Application,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import FormModal from "@/components/FormModal";

import { ITEM_PER_PAGE } from "@/lib/setting";
import { getUserRole } from "@/lib/role";
import FormContainer from "@/components/FormContainer";

type MentorList = Mentor & { applications: Application[] };

const MentorListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { role } = await getUserRole();

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Mentor ID",
      accessor: "mentorId",
      className: "hidden md:table-cell",
    },
    {
      header: "Applications",
      accessor: "aplication",
      className: "hidden md:table-cell",
    },
    {
      header: "Department",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },

    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: MentorList) => (
    <tr
      key={item.id}
      className="border-b border-blue even:bg-white text-sm hover:cursor-pointer hover:bg-white"
    >
      <td className="flex item-center gap-4 p-4">
        <Image
          src={"/avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-blue">{item.name}</h3>
          <p className="text-xs text-blue ">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-blue">{item.name}</td>
      <td className="hidden md:table-cell text-blue">
        {item.applications.map((app: { id: any }) => app.id).join(", ") ||
          "N/A"}
      </td>
      {/* <td className="hidden md:table-cell text-darkblue">
        {item.classes.map((classItem) => classItem.name).join()}
      </td> */}
      <td className="hidden md:table-cell text-blue">{item.phone}</td>
      <td className="hidden md:table-cell text-blue">{item.address}</td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue">
              <Image src="/view_sign.png" alt="" width={20} height={20} />
            </button>
          </Link>
          {true && ( // role === "admin"
            // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-fadedwhite">
            //   <Image src="/delete_sign.png" alt="" width={30} height={30} />
            // </button>
            <FormContainer table="mentor" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const resolvedSearchParams = await searchParams;
  const { page, ...queryParams } = resolvedSearchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  //To protect our query params
  const query: Prisma.MentorWhereInput = {};

  // filterObject
  // this block will only run when there is a query parameter other than page...
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // case "classId":
          //   query.lessons = {
          //     some: {
          //       classId: parseInt(value),
          //     },
          //   };
          //   break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
        }
      }
    }
  }

  // console.log(query);
  const [data, count] = await prisma.$transaction([
    prisma.mentor.findMany({
      where: query,
      include: {
        department: true,
        applications: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.mentor.count({ where: query }),
  ]);

  // console.log(count);  I will run these once debug finished

  // console.log(data);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between w-full">
        <h1 className="hidden md:block text-lg font-semibold text-blue">
          All Mentors
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-fadedwhite">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>

            {true && ( // role === "admin"
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-fadedwhite">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormContainer table="mentor" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default MentorListPage;
