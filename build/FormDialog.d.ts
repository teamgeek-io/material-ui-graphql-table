import React from "react";
import type { Field as FieldType } from ".";
interface GenericDictionary {
    [key: string]: any;
}
interface Props {
    title: string;
    description?: string;
    fields: FieldType[];
    data?: GenericDictionary;
    saveObject?(object: GenericDictionary): void | Promise<any>;
    open: boolean;
    onClose: () => void;
}
declare const FormDialog: React.FC<Props>;
export default FormDialog;
