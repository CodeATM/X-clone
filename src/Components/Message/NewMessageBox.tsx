import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import { FaPaperPlane, FaRegImage, FaRegSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import * as yup from "yup";

import CircularLoading from "../mics/CircularLoading";
import Uploader from "../mics/uploader";
import { createMessage } from "@/utilities/fetch";
import { uploadFile } from "@/utilities/storages";
import { MessageFormProps } from "@/types/Messagesprops";

export default function NewMessageBox({ messagedUsername, token, setFreshMessages, freshMessages }: MessageFormProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [showDropzone, setShowDropzone] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createMessage,
        onMutate: () => {
            const newMessage = {
                photoUrl: formik.values.photoUrl,
                text: formik.values.text,
                createdAt: Date.now(),
                sender: {
                    username: formik.values.sender,
                },
                recipient: {
                    username: formik.values.recipient,
                },
                id: Math.floor(Math.random() * 1000000).toString(),
            };
            setFreshMessages([...freshMessages, newMessage]);
            formik.resetForm();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["messages", token.username] });
        },
        onError: (error) => console.log(error),
    });

    const handlePhotoChange = (file: File) => {
        setPhotoFile(file);
    };

    const validationSchema = yup.object({
        text: yup
            .string()
            .max(280, "Message text should be of maximum 280 characters length.")
            .required("Message text can't be empty."),
    });

    const formik = useFormik({
        initialValues: {
            sender: token.username,
            recipient: messagedUsername ? messagedUsername : token.username, // if messagedUsername is null, then the user is messaging themselves
            text: "",
            photoUrl: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (photoFile) {
                const path: string | void = await uploadFile(photoFile);
                if (!path) throw new Error("Error uploading image.");
                values.photoUrl = path;
                setPhotoFile(null);
            }
            mutation.mutate(JSON.stringify(values));
            setShowDropzone(false);
        },
    });

    return (
        <div className="p-3 relative">
            <form className="new-message-form" onSubmit={formik.handleSubmit}>
                <div className="inline">
                    <TextField
                        placeholder="Start a new message"
                        hiddenLabel
                        variant="outlined"
                        name="text"
                        sx={{ width: "65%" }}
                        value={formik.values.text}
                        onChange={formik.handleChange}
                        error={formik.touched.text && Boolean(formik.errors.text)}
                    />
                </div>
                {formik.isSubmitting ? (
                    <CircularLoading />
                ) : (
                    <button
                        type="submit"
                        className={`btn w-auto border-none text-twitterBlue inline-flex translate-[10px, 50px] btn-white transition-none text-[1rem] ${formik.isValid ? "" : "opacity-50 cursor-not-allowed filter "}`}
                        disabled={!formik.isValid}
                    >
                        <FaPaperPlane />
                    </button>
                )}
            </form>
            <div className="border-none justify-end mr-40">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDropzone(true);
                    }}
                    className="transition-none text-[1rem]"
                >
                    <FaRegImage />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowPicker(!showPicker);
                    }}
                    className="transition-none text-[1rem]"
                >
                    <FaRegSmile />
                </button>
            </div>
            {showPicker && (
                <div className="flex justify-center">
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                            formik.setFieldValue("text", formik.values.text + emoji.native);
                            setShowPicker(false);
                        }}
                        previewPosition="none"
                        onClickOutside={() => setShowPicker(false)}
                    />
                </div>
            )}
            {showDropzone && <Uploader handlePhotoChange={handlePhotoChange} />}
        </div>
    );
}
