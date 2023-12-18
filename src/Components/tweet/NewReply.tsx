import { useState } from "react";
import { TextField, Avatar } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegImage, FaRegSmile } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Link from "next/link";

import CircularLoading from "../mics/CircularLoading";
import { createReply } from "@/utilities/fetch";
import Uploader from "../mics/uploader";
import { getFullURL } from "@/utilities/getFullURL";
import { uploadFile } from "@/utilities/storages";
import { UserTypes } from "@/types/userTypes";
import { TweetProps } from "@/types/TweetProps";
import ProgressCircle from "../mics/ProcesssCircle";

export default function NewReply({ token, tweet }: { token: UserTypes; tweet: TweetProps }) {
    const [showPicker, setShowPicker] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [count, setCount] = useState(0);

    const queryClient = useQueryClient();

    const queryKey = ["tweets", tweet.author.username, tweet._id];
    console.log(tweet._id)

    const mutation = useMutation({
        mutationFn: (reply: string) => createReply(reply, tweet.author.username, tweet._id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
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
            .max(280, "Reply text should be of maximum 280 characters length.")
            .required("Reply text can't be empty."),
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
            resetForm();
            setShowDropzone(false);
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
        <div className="w-full flex p-4 norder-b-[1px] border-borderColor border-t-none pt-12 relative gap-4">
            <Avatar
                className="avatar cursor-pointer"
                sx={{ width: 50, height: 50 }}
                alt=""
                src={token.photoUrl ? getFullURL(token.photoUrl) : "/assets/egg.jpg"}
            />
            <form onSubmit={formik.handleSubmit} className="w-full">
                <div className="input">
                    <TextField
                        placeholder="Tweet your reply"
                        multiline
                        minRows={1}
                        variant="standard"
                        fullWidth
                        name="text"
                        inputProps = {{style: {color: 'white',}}}
                        value={formik.values.text}
                        onChange={customHandleChange}
                        error={formik.touched.text && Boolean(formik.errors.text)}
                        helperText={formik.touched.text && formik.errors.text}
                        hiddenLabel
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
                        Reply
                    </button>
                </div>
                {showPicker && (
                    <div className="static z-[9999]">
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji: any) => {
                                formik.setFieldValue("text", formik.values.text + emoji.native);
                                setShowPicker(false);
                            }}
                            previewPosition="none"
                        />
                    </div>
                )}
                {showDropzone && <Uploader handlePhotoChange={handlePhotoChange} />}
                {
                    <Link className="absolute top-2 font-[300] text-twitterMuted text-[0.9rem] tracking-[0.5px]" href={`/${tweet.author.username}`}>
                        Replying to <span className="font-normal text-twitterDarkBlue hover:underline">@{tweet.author.username}</span>
                    </Link>
                }
            </form>
        </div>
    );
}
