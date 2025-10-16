// src\components\FormModal.tsx
"use client";

import { deleteMentor } from "@/lib/action";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, JSX, SetStateAction, useEffect, useState } from "react";
import { useActionState } from "react";

import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

interface FormState {
  success: boolean;
  error: boolean;
  message: string;
}

type DeleteActionFunction = (
  prevState: FormState,
  formData: FormData
) => Promise<FormState>;

const deleteActionMap: { mentor: DeleteActionFunction } = {
  mentor: deleteMentor,
};

const MentorForm = dynamic(() => import("./form/MentorForm"), {
  loading: () => <h1 className="text-blue">Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any // Add relatedData parameter here
  ) => JSX.Element;
} = {
  mentor: (
    setOpen,
    type,
    data,
    relatedData // Add relatedData to the arguments here
  ) => (
    <MentorForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData} // Pass relatedData here
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const bgColor =
    type === "create" || type === "delete" ? "bg-white" : "bg-blue";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const actionToUse =
      type === "delete" && table === "mentor"
        ? deleteActionMap.mentor
        : async (
            prevState: FormState,
            formData: FormData
          ): Promise<FormState> => {
            console.warn(
              `Attempted to use delete action for table '${table}' (type: ${type}) but no handler is defined.`
            );
            return {
              success: false,
              error: true,
              message: "No delete handler for this table/type.",
            };
          };

    const [state, formAction] = useActionState(actionToUse, {
      success: false,
      error: false,
      message: "",
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
      if (state.error && state.message) {
        toast.error(`Error deleting ${table}: ${state.message}`);
      }
    }, [state, router, table, setOpen]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="hidden" name="id" value={id} />
        <span className="text-red-950">
          This action will permanently delete all data from {table}. Are you
          sure you want to proceed?{" "}
        </span>
        <button className="bg-red-950 text-white py-2 px-12 rounded-md border-none self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table] ? (
        forms[table](setOpen, type, data, relatedData) // Pass relatedData here
      ) : (
        <span className="text-red-500">
          Form for &quot;{table}&quot; not found!
        </span>
      )
    ) : (
      "form not found"
    );
  };

  return (
    <>
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Image
          src={`/${type}.png`}
          alt=""
          width={type === "delete" ? 31 : 16}
          height={type === "delete" ? 31 : 16}
        />
      </button>
      {open && (
        <div
          className={`w-screen h-screen absolute left-0 top-0 ${
            type === "delete" ? "bg-red-950/50" : "bg-blue/50"
          }  z-50 flex items-center justify-center`}
        >
          <div className="bg-fadedwhite p-4 rounded relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
