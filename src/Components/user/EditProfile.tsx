import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import * as yup from "yup";
import Image from "next/image";
import Input from "../input";
import { UserTypes } from "@/types/userTypes";
import { uploadFile } from "@/utilities/storages";
import { getFullURL } from "@/utilities/getFullURL";
import { editUser } from "@/utilities/fetch";
import CustomSnackbar from "../mics/CustomSnackbar";
import { SnackbarProps } from "@/types/snackbarProps";
import CircularLoading from "../mics/CircularLoading";
import { Avatar, TextField } from "@mui/material";

export default function EditProfile({ profile, refreshToken }: { profile: UserTypes; refreshToken: () => void }) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });
  const [isBlueOpen, setIsBlueOpen] = useState(false);
  const [blueInput, setBlueInput] = useState("");
  const [isBlueLoading, setIsBlueLoading] = useState(false);

  const headerUploadInputRef = useRef<HTMLInputElement>(null);
  const photoUploadInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const handleHeaderChange = (event: any) => {
    const file = event.target.files[0];
    setHeaderPreview(URL.createObjectURL(file));
    setHeaderFile(file);
  };
  const handleHeaderClick = () => {
    headerUploadInputRef.current?.click();
  };
  const handlePhotoChange = (event: any) => {
    const file = event.target.files[0];
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  };
  const handlePhotoClick = () => {
    photoUploadInputRef.current?.click();
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .max(50, "Name should be of maximum 50 characters length."),
    description: yup
      .string()
      .max(160, "Description should be of maximum 160 characters length."),
    location: yup
      .string()
      .max(30, "Location should be of maximum 30 characters length."),
    website: yup
      .string()
      .max(30, "Website should be of maximum 30 characters length."),
    photoUrl: yup.string(),
    headerUrl: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: profile.name ?? "",
      description: profile.description ?? "",
      location: profile.location ?? "",
      website: profile.website ?? "",
      headerUrl: profile.headerUrl ?? "",
      photoUrl: profile.photoUrl ?? "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log('hre edit 11')
        if (headerFile) {

          const path: string | void = await uploadFile(headerFile);
          if (!path) throw new Error("Header upload failed.");
          values.headerUrl = path;
        }
        if (photoFile) {
          const path: string | void = await uploadFile(photoFile);
          if (!path) throw new Error("Photo upload failed.");
          values.photoUrl = path;
        }
      const jsonValues = JSON.stringify(values);
      console.log('hre edit')
      const response = await editUser(jsonValues, profile.username);
      if (!response.success) {
        return setSnackbar({
          message:
            "Something went wrong while updating profile. Please try again.",
          severity: "error",
          open: true,
        });
      }
        setSnackbar({
          message: "Your profile has been updated successfully.",
          severity: "success",
          open: true,
        });
      refreshToken();
      queryClient.invalidateQueries(["users", profile.username]);
    },
  });

  // const handleBlueSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // if (blueInput === "") return;
  //   // setIsBlueLoading(true);
  //   // const checkResponse = await checkBlueFromServer(blueInput);
  //   // if (!checkResponse) {
  //   //   setIsBlueLoading(false);
  //   //   return setSnackbar({
  //   //     message: "Invalid blue code. Please try again.",
  //   //     severity: "error",
  //   //     open: true,
  //   //   });
  //   // }
  //   const response = await editUser(
  //     JSON.stringify({ isPremium: true }),
  //     profile.username
  //   );
  //   if (!response.success) {
  //     setIsBlueLoading(false);
  //     //   return setSnackbar({
  //     //     message:
  //     //       "Something went wrong while getting your blue. Please try again.",
  //     //     severity: "error",
  //     //     open: true,
  //     //   });
  //   }
  //   // setSnackbar({
  //   //   message: "You got your blue successfully. Congrats!",
  //   //   severity: "success",
  //   //   open: true,
  //   // });
  //   refreshToken();
  //   // queryClient.invalidateQueries(["users", profile.username] as const);
  // };

  return (
    <div className="edit-profile">
      <div className="w-[100%] h-52 relative">
        <div className="absolute -bottom-12 right-4">
          <button
            className="flex items-center text-sm font-bold gap-1 border-none bg-inherit cursor-pointer text-twitterBlack hover:text-twitterBlue hover:underline"
            onClick={() => setIsBlueOpen(true)}
          >
            Twitter Blue?{" "}
            <FaTwitter className="text-twitterBlue text-[1.2rem] transition-all ease-in-out hover:scale-110" />
          </button>
        </div>
        <Image
          alt=""
          src={
            headerPreview
              ? headerPreview
              : profile.headerUrl
              ? getFullURL(profile.headerUrl)
              : "/header.jpg"
          }
          fill
          className="object-cover"
        />
        <div>
          <button
            className="icon-hoverable absolute text-[1.2rem] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[rgba(0, 0, 0, 0.25)] hover:bg-[rgba(255, 255, 255, 0.25)]"
            onClick={handleHeaderClick}
          >
            <MdOutlineAddAPhoto />
          </button>
          <input
            ref={headerUploadInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleHeaderChange}
          />
        </div>
        <div className="absolute text-[1.5rem] -bottom-[70px] left-5 border-[4px] border-twitterWhite rounded-full object-cover">
        <Avatar
                        className="object-cover"
                        sx={{ width: 125, height: 125 }}
                        alt=""
                        src={
                            photoPreview ? photoPreview : profile.photoUrl ? getFullURL(profile.photoUrl) : "/X-icon.png"
                        }
                    />
          <div>
            <button
              className="icon-hoverable absolute text-[1.2rem] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[rgba(0, 0, 0, 0.25)] hover:bg-[rgba(255, 255, 255, 0.25)]"
              onClick={handlePhotoClick}
            >
              <MdOutlineAddAPhoto />
            </button>
            <input
              ref={photoUploadInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="mt-24 mx-8 mb-0">
          <h1 className="font-bold text-[1.33rem] pb-5 pl-3">Edit profile</h1>
          <div className="p-2 min-w-[20vw]">
            <Input
              id="name"
              label="Name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm tracking-wide">
                {formik.errors.name}
              </div>
            ) : null}
          </div>
          <div className="p-2 min-w-[20vw]">
            <Input
              id="description"
              label="Description"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm tracking-wide">
                {formik.errors.description}
              </div>
            ) : null}
          </div>
          <div className="p-2 min-w-[20vw]">
            <Input
              id="location"
              label="Location"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.location}
            />
            {formik.touched.location && formik.errors.location ? (
              <div className="text-red-500 text-sm tracking-wide">
                {formik.errors.location}
              </div>
            ) : null}
          </div>
          <div className="p-2 min-w-[20vw]">
            <Input
              id="website"
              label="Website"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.website}
            />
            {formik.touched.website && formik.errors.website ? (
              <div className="text-red-500 text-sm tracking-wide">
                {formik.errors.website}
              </div>
            ) : null}
          </div>
          {formik.isSubmitting ? (
            <CircularLoading/>
          ) : (
            <button
              className={`btn btn-dark float-right m-2 ${
                formik.isValid ? "" : "disabled"
              }`}
              disabled={!formik.isValid}
              type="submit"
            >
              Save
            </button>
          )}
        </div>
      </form>
      {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
      {/* {isBlueOpen && (
        <div className="html-modal-wrapper">
          <dialog open className="get-blue-modal">
            {profile.isPremium ? (
              <div className="blue-user">
                <Image
                  src="/assets/favicon.png"
                  alt=""
                  width={75}
                  height={75}
                />
                <h1>You have already got Blue status.</h1>
                <p>Thank you for participating.</p>
                <button
                  className="btn btn-white"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsBlueOpen(false);
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h1>
                  Want Twitter Blue? <FaTwitter />
                </h1>
                <p>
                  With Twitter Blue, you will have a little twitter bird next
                  you your name, thats it! Dive right in!
                </p>
                <p>
                  You can get the code from
                  <a
                    href="https://github.com/fatiharapoglu/twitter"
                    target="_blank"
                  >
                    {" "}
                    here{" "}
                  </a>
                  if you want.
                </p>
                {isBlueLoading ? (
                  <h1>Loading....</h1>
                ) : (
                  <form onSubmit={handleBlueSubmit}>
                    <input
                      type="text"
                      className="blue-input"
                      onChange={(e) => setBlueInput(e.target.value)}
                      value={blueInput}
                      placeholder="Enter your code"
                      autoFocus
                    />
                    <button className="btn btn-dark" type="submit">
                      Submit
                    </button>
                    <button
                      className="btn btn-white"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsBlueOpen(false);
                      }}
                    >
                      Close
                    </button>
                  </form>
                )}
              </>
            )}
          </dialog>
        </div>
      )} */}
    </div>
  );
}
