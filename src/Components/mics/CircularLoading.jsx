import { CircularProgress } from "@mui/material";

export default function CircularLoading() {
    return (
        <div className="flex justify-center items-center my-3 mx-2">
            <CircularProgress size={30} />
        </div>
    );
}