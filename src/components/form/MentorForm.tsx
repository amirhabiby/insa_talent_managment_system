"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputField from "../InputField";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
  useTransition,
  startTransition,
} from "react";
import { mentorSchema, MentorSchema } from "@/lib/formValidationSchema";
// import { useFormState } from "react-dom"; // <--- REMOVED: This is the old hook name
import { createMentor, updateMentor } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const MentorForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data: any;
  relatedData?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MentorSchema>({
    resolver: zodResolver(mentorSchema),
    // Added default values for update type to populate the form
    defaultValues:
      type === "update"
        ? {
            username: data?.username,
            email: data?.email,
            name: data?.name,
            surname: data?.lastName, // Assuming 'lastName' from data maps to 'surname' in schema
            phone: data?.phone,
            address: data?.address,
            bloodType: data?.bloodType,
            birthday: data?.birthday, // Ensure this is in a format compatible with date input
            sex: data?.sex,
            id: data?.id,
          }
        : {},
  });

  const [img, setImg] = useState<any>(
    data?.img ? { secure_url: data.img } : undefined
  ); // <--- MODIFIED: Initialize img with existing data for update

  // useTransition for managing pending state and wrapping the action
  const [isPending, transition] = useTransition(); // <--- NEW: Initialize useTransition

  const [state, formAction] = useActionState(
    type === "create" ? createMentor : updateMentor,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((formData) => {
    // Renamed 'data' to 'formData' for clarity with props.data
    // Wrap the formAction call in startTransition
    transition(() => {
      // <--- MODIFIED: Use the 'transition' function from useTransition
      formAction({ ...formData, img: img?.secure_url });
    });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Mentor has been ${type === "create" ? "created" : "updated"}!`); // Changed "Teacher" to "Mentor"
      setOpen(false);
      router.refresh();
    }
    if (state.error && state.message) {
      // Display specific error message if available
      toast.error(state.message);
    } else if (state.error) {
      // Generic error message
      toast.error("Something went wrong!");
    }
  }, [state, router, type, setOpen]);

  // console.log(subjects); // You might want to remove this if not needed

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {" "}
      {/* action prop is not needed when using onSubmit with react-hook-form */}
      <h1 className="text-xl font-semibold text-blue">
        {type === "create" ? "Create Mentor" : "Update Mentor"}
      </h1>
      <span className="text-xs font-medium text-blue">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username} // This defaultValue will be overridden by defaultValues in useForm if present
          register={register}
          error={errors.username}
          type={""} // Consider making type more specific if always string
        />

        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
          type="email"
        />

        {/* Conditionally render password field only for create, or if explicitly updating password */}
        {type === "create" && (
          <InputField
            label="Password"
            name="password"
            register={register}
            error={errors.password} // Ensure this maps to password error
            type="password"
          />
        )}
        {/* If you allow password updates, consider a separate 'newPassword' field */}
      </div>
      <span className="text-xs font-medium text-blue">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          type={""}
        />

        <InputField
          label="Last Name"
          name="surname" // Assuming this is the correct field name in schema
          defaultValue={data?.lastName} // Assuming 'lastName' from data
          register={register}
          error={errors.surname}
          type={""}
        />

        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
          type={""}
        />

        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address} // Corrected error prop
          type={""}
        />

        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
          type={""}
        />

        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday}
          register={register}
          error={errors.birthday}
          type="date"
        />

        {data &&
          type === "update" && ( // Only show ID for update type
            <InputField
              label="Id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id} // Ensure 'id' is part of your schema if you're validating it
              disabled // ID should typically not be editable
            />
          )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-blue">Sex</label>

          <select
            className="ring-[1.5px] ring-blue p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          {errors.sex?.message && (
            <p className="text-xs text-red-900">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        <CldUploadWidget
          uploadPreset="Talent"
          onSuccess={(result, { widget }) => {
            setImg(result?.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div className="flex flex-col gap-2">
                <div
                  className="text-xs text-blue flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/upload.png" alt="" width={20} height={20} />
                  <span>Upload a photo</span>
                </div>

                {img && (
                  <Image
                    className="rounded"
                    src={img?.secure_url}
                    alt=""
                    width={95}
                    height={100}
                  />
                )}
              </div>
            );
          }}
        </CldUploadWidget>
      </div>
      {state.error && (
        <span className="text-red-700 ">
          {state.message || "Something went wrong!"}
        </span> // <--- MODIFIED: Show specific message if available
      )}
      <button
        className="bg-blue text-white p-2 rounded-md"
        type="submit" // Ensure button is of type submit
        disabled={isPending} // <--- NEW: Disable button while the action is pending
      >
        {isPending
          ? type === "create"
            ? "Creating..."
            : "Updating..."
          : type === "create"
          ? "Create"
          : "Update"}
      </button>
    </form>
  );
};

export default MentorForm;
