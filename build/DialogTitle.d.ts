import React, { ReactNode } from "react";
interface Props {
    children: ReactNode;
    onClose: () => void;
    [name: string]: any;
}
declare const DialogTitle: React.FC<Props>;
export default DialogTitle;
