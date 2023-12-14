import { CircularProgress } from "@mui/material";

export default function ProgressCircle({ maxChars, count }: { maxChars: number; count: number }) {
    const progress = (count / maxChars) * 100;

    return (
        <div className="flex ml-auto items-center gap-2">
            {count > 0 && (
                <span className={`text-[0.75rem] ${count > maxChars ? "text-red-500" : ""}`}>{`${count} / ${maxChars}`}</span>
            )}
            <CircularProgress
                variant="determinate"
                value={progress >= 100 ? 100 : progress}
                color={progress > 100 ? "error" : "inherit"}
                size={20}
                thickness={5}
            />
        </div>
    );
}
