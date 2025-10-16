"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  console.log(user);

  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <SignIn.Root>
        <div className="card-wrapper shadow-2xl">
          <div className="card-content">
            <SignIn.Step
              name="start"
              className="p-12 rounded-md flex flex-col gap-4"
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/insa_logo.png"
                  alt="Med_Hist_Integration Logo"
                  width={100}
                  height={180}
                />
              </div>

              <div className="text-blue text-sm flex justify-center font-semibold font-serif">
                Sign in to your account
              </div>

              <Clerk.GlobalError className="text-sm text-danger" />

              {/* Username field */}
              <Clerk.Field name="identifier" className="flex flex-col gap-2">
                <Clerk.Label className="text-xs text-blue">
                  Username
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  className="p-1.5 rounded ring-1 ring-blue ring-opacity-45 outline-none bg-white"
                />
                <Clerk.FieldError className="text-xs text-red-900" />
              </Clerk.Field>

              {/* Password field */}
              <Clerk.Field name="password" className="flex flex-col gap-2">
                <Clerk.Label className="text-xs text-blue">
                  Password
                </Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  className="p-1.5 rounded ring-1 ring-blue ring-opacity-45 outline-none bg-ghostwhite"
                />
                <Clerk.FieldError className="text-xs text-danger break-words whitespace-normal" />
              </Clerk.Field>

              {/* Default Sign In button */}
              <SignIn.Action
                submit
                className="bg-white text-blue my-1 rounded-md text-sm p-[10px] hover:bg-blue hover:text-white hover:p-[10.5px] font-bold"
              >
                Sign In
              </SignIn.Action>

              {/* Divider */}
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-red"></div>
                <span className="px-2 text-xs text-red">or</span>
                <div className="flex-grow border-t border-red"></div>
              </div>

              {/* Correct implementation for Google Sign-In */}
              <Clerk.Connection
                name="google"
                className="group bg-logopink text-white p-2 px-6 rounded mt-2 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <Image
                  width={35}
                  height={22}
                  src="/google_icon.png"
                  alt="Google icon"
                  // 3. Add transition and group-hover classes to the image
                  className="transition-transform duration-200 group-hover:scale-150"
                />
                <p className="text-white font-medium">Sign in with Google</p>
              </Clerk.Connection>
            </SignIn.Step>
          </div>
        </div>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
