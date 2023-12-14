import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { Modal } from "@mui/material";
import { PreviewDialogProps } from "@/types/ModalProps";
import { getFullURL } from "@/utilities/getFullURL";

export default function PreviewDialog({ open, handlePreviewClose, url }: PreviewDialogProps) {
    return (
        <Modal className="preview-dialog" open={open}>
            <div>
                <button className="absolute left-4 top-3 z-50 text-twitterWhite bg-twitterLightBlack transition-all duration-75 ease-in-out hover:text-twitterBlue hover:bg-hover icon-hoverable" onClick={handlePreviewClose}>
                    <AiOutlineClose />
                </button>
                <div className="image-wrapper">
                    <Image
                        src={url === "/assets/header.jpg" || url === "/assets/egg.jpg" ? url : getFullURL(url)}
                        alt=""
                        fill
                        priority={false}
                        className="block object-contain"
                    />
                </div>
            </div>
        </Modal>
    );
}
