import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Dialog, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";
import * as yup from "yup";
import Image from "next/image";

import { SignUpDialogProps } from "@/types/ModalProps";
import { checkUserExists, createUser } from "@/utilities/fetch";
import CircularLoading from "../mics/CircularLoading";
import CustomSnackbar from "../mics/CustomSnackbar";
import { SnackbarProps } from "@/types/snackbarProps";

export default function SignUpDialog({ open, handleSignUpClose }: SignUpDialogProps) {
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const router = useRouter();

    const validationSchema = yup.object({
        username: yup
            .string()
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
        password: yup
            .string()
            .min(8, "Password should be of minimum 8 characters length.")
            .max(100, "Password should be of maximum 100 characters length.")
            .required("Password is required."),
        name: yup.string().max(50, "Name should be of maximum 50 characters length."),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            name: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const response = await createUser(JSON.stringify(values));
            if (!response.success) {
                return setSnackbar({
                    message: "Something went wrong. Please try again.",
                    severity: "error",
                    open: true,
                });
            }
            resetForm();
            handleSignUpClose();
            router.push("/explore");
        },
    });

    return (
        <Dialog className="dialog" open={open} onClose={handleSignUpClose}>
            <Image className="m-auto pt-4" src="/X-icon.png" alt="" width={40} height={40} />
            <DialogTitle className="text-[1.75rem] font-bold text-twitterBlack text-center p-4">Create your account</DialogTitle>
            <form className="w-full flex flex-col" onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <div className="input-group">
                        <div className="p-2 min-w-[20vw]">
                            <div className="pb-3 text-twitterGray">Your login information</div>
                            <TextField
                                required
                                fullWidth
                                name="username"
                                label="Username"
                                placeholder="username"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                }}
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                error={Boolean(formik.errors.username)}
                                helperText={formik.errors.username}
                                autoFocus
                            />
                        </div>
                        <div className="p-2 min-w-[20vw]">
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={Boolean(formik.errors.password)}
                                helperText={formik.errors.password}
                            />
                        </div>
                        <div className="p-2 min-w-[20vw]">
                            <div className="pb-3 text-twitterGray">Your public name</div>
                            <TextField
                                fullWidth
                                name="name"
                                label="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>
                    </div>
                </DialogContent>
                {formik.isSubmitting ? (
                    <CircularLoading />
                ) : (
                    <button
                        className={`btn w-[75%] m-auto mb-12 text-twitterWhite bg-twitterBlack hover:bg-twitterLightBlack hover:text-twitterWhite ${formik.isValid ? "" : "disabled"}`}
                        type="submit"
                        disabled={!formik.isValid}
                    >
                        Create
                    </button>
                )}
            </form>
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}
        </Dialog>
    );
}
