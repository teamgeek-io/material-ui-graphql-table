import React from "react";
interface Props {
    title?: string;
    message: string;
    onConfirm(): Promise<any> | void;
    open?: boolean;
    onClose: () => void;
}
declare const ConfirmationDialog: React.FC<Props>;
export default ConfirmationDialog;
