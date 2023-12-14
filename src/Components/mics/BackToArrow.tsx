import Link from "next/link";

import { FaArrowLeft } from "react-icons/fa";

export default function BackToArrow({ title, url }: { title: string; url: string }) {
    return (
        <div className="p-4 flex iems-center gap-4 border-b-[1px] border-borderColor sticky z-50 top-0 bg-backgroundPrimary opacity-90">
            <Link className="icon-hoverable" href={url}>
                <FaArrowLeft />
            </Link>
            <div className="flex flex-col gap-1">
                <span className="text-[1.33rem]font-bold">{title}</span>
            </div>
        </div>
    );
}