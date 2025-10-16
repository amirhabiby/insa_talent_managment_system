import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table: "mentor" | "talent" | "result" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: string | number;
};

type DeletableTable = "mentor";

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  // let relatedData = {};

  // if (type !== "delete") {
  //   switch (table) {
  //     case "subject":
  //       const subjectTeachers = await prisma.teacher.findMany({
  //         select: { id: true, name: true, surname: true },
  //       });
  //       relatedData = { teachers: subjectTeachers };
  //       break;

  //     case "teacher":
  //       const teacherSubjects = await prisma.subject.findMany({
  //         select: { id: true, name: true },
  //       });
  //       relatedData = { subjects: teacherSubjects };
  //       break;

  //     default:
  //       break;
  //   }
  // }

  return (
    <div className="">
      <FormModal table={table} type={type} data={data} id={id} />
    </div>
  );
};

export default FormContainer;
