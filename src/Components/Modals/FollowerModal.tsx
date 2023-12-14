import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../input";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import {MdOutlineCancel} from "react-icons/md";
import { logIn } from "@/utilities/fetch";
import {useRouter} from 'next/navigation'

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SignupModal = ({ isOpen, onClose }: Props) => {

  return (
    <div
      className={
        isOpen
          ? "fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4 opacity-1 visible transition duration-300"
          : "opacity-0 hidden"
      }
    >
      <div className="absolute right-7 top-7 cursor-pointer">
        <MdOutlineCancel className = 'text-2xl' onClick={() => onClose()}/>
      </div>

      <div className="w-[90%] md:w-[50%] xl:w-[26%]">
        <div className="bg-twitterLightGray px-8 py-10 flex flex-col">
          <div className="flex justify-center">
            <Image src="/x-icon.png" alt="" width={40} height={40} />
          </div>
          <h1 className="text-[1.5rem] font-[700] text-center p-4">
            Sign in to your account
          </h1>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            <div className="">
              <Input
                id="username"
                label="username"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-500 text-sm tracking-wide">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>

            <div className="">
              <Input
                id="password"
                // name="email"
                type="password"
                label="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm tracking-wide">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              className="btn btn-light w-full bg-white text-black"
            >
              Submit
            </button>
            <div className="text-center flex gap-x-1 items-center justify-center cursor-pointer">
              <FcGoogle className="text-[1.5rem]" />
              <p className="text-sm font-[300] tracking-wider">
                Create an account with google
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
