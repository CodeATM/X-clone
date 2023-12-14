import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../input";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import {MdOutlineCancel} from "react-icons/md";
import { checkUserExists, createUser } from "@/utilities/fetch";
import {useRouter} from 'next/navigation'

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      name: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username should be of minimum 3 characters length.")
        .max(20, "Username should be of maximum 20 characters length.")
        .matches(/^[a-zA-Z0-9_]{1,14}[a-zA-Z0-9]$/, "Username is invalid")
        .required("Username is required.")
        .test("checkUserExists", "User already exists.", async (value) => {
          if (value) {
            const response = await checkUserExists(value);
            if (response.success) return false;
          }
          return true;
        }),
      password: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      name: Yup.string().max(
        50,
        "Name should be of maximum 50 characters length."
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      const response = await createUser(JSON.stringify(values));
      if (!response.success) {
        // return setSnackbar({
        //     message: "Something went wrong. Please try again.",
        //     severity: "error",
        //     open: true,
        // });
        alert("try again later");
      }
      resetForm();
      // handleSignUpClose();
      router.push("/explore");
      alert("user ceated");
    },
  });
  return (
    <div
      className={
        isOpen
          ? "fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4 opacity-1 visible transition duration-300"
          : "opacity-0 hidden"
      }
    >
      <div className="absolute right-7 top-7 cursor-pointer">
        <MdOutlineCancel className="text-2xl" onClick={() => onClose()} />
      </div>
      <div className="w-[90%] md:w-[50%] xl:w-[26%]">
        <div className="bg-twitterLightGray px-8 py-10 flex flex-col">
          <div className="flex justify-center">
            <Image src="/x-icon.png" alt="" width={40} height={40} />
          </div>
          <h1 className="text-[1.5rem] font-[700] text-center p-4">
            Create an account
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
                id="name"
                type="text"
                label="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm tracking-wide">
                  {formik.errors.name}
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

            <button type="submit" className="btn btn-light w-full">
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

export default LoginModal;
