import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegImage, FaRegSmile } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { TextField, Avatar } from "@mui/material";
import CircularLoading from "../mics/CircularLoading";
import { createTweet } from "@/utilities/fetch";
import { NewTweetProps } from "@/types/TweetProps";
import Uploader from "../mics/uploader";
import { getFullURL } from "@/utilities/getFullURL";
import { uploadFile } from "@/utilities/storages";
import Image from "next/image";
import ProgressCircle from "../mics/ProcesssCircle";

export default function NewTweet({ token, handleSubmit }: NewTweetProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);

  const queryClient = useQueryClient();

  const mutation = useMutation({
      mutationFn: createTweet,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tweets"] });
      },
      onError: (error) => console.log(error),
  });

  console.log(mutation)

  const handlePhotoChange = (file: File) => {
      setPhotoFile(file);
  };

  const validationSchema = yup.object({
      text: yup
          .string()
          .max(280, "Tweet text should be of maximum 280 characters length.")
          .required("Tweet text can't be empty."),
  });

  const formik = useFormik({
      initialValues: {
          text: "",
          authorId: token.id,
          photoUrl: "",
      },
      validationSchema: validationSchema,
      onSubmit: async (values, { resetForm }) => {
          if (photoFile) {
              const path: string | void = await uploadFile(photoFile);
              if (!path) throw new Error("Error uploading image.");
              values.photoUrl = path;
              setPhotoFile(null);
          }
          mutation.mutate(JSON.stringify(values));
          console.log(values)
          resetForm();
          setCount(0);
          setShowDropzone(false);
          if (handleSubmit) handleSubmit();
      },
  });

  const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCount(e.target.value.length);
      formik.handleChange(e);
  };

  if (formik.isSubmitting) {
      return <CircularLoading />;
  }

  return (
    <div className="flex p-4 border-b-[1px] border-borderColor">
    <Avatar
        className="avatar div-link"
        sx={{ width: 50, height: 50 }}
        alt=""
        src={token.photoUrl ? getFullURL(token.photoUrl) : "X-icon.png"}
    />
    <form onSubmit={formik.handleSubmit} className = 'w-full -mt-1 pl-4 ' >
        <div className="py-1 px-0 text-[1.25rem] placeholder:text-white text-white">
                    <TextField
                        placeholder="What's happening?"
                        multiline
                        hiddenLabel
                        minRows={3}
                        variant="standard"
                        fullWidth
                        name="text"
                        inputProps = {{style: {color: 'white',}}}
                        value={formik.values.text}
                        onChange={customHandleChange}
                        error={formik.touched.text && Boolean(formik.errors.text)}
                        helperText={formik.touched.text && formik.errors.text}
                    />
        </div>
        <div className="flex items-center gap-4 text-[1.25rem] text-twitterBlue pt-4 border-t-[1px] border-borderColor">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setShowDropzone(true);
                }}
                className="icon-hoverable"
            >
                <FaRegImage />
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setShowPicker(!showPicker);
                }}
                className="icon-hoverable"
            >
                <FaRegSmile />
            </button>
            <ProgressCircle maxChars={280} count={count} />
            <button className={`btn ${formik.isValid ? "" : "disabled"}`} disabled={!formik.isValid} type="submit">
                Tweet
            </button>
        </div>
        {showPicker && (
            <div className="emoji-picker">
                <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                        formik.setFieldValue("text", formik.values.text + emoji.native);
                        setShowPicker(false);
                        setCount(count + emoji.native.length);
                    }}
                    previewPosition="none"
                />
            </div>
        )}
        {showDropzone && <Uploader handlePhotoChange={handlePhotoChange} />}
    </form>
</div>
  );
}
