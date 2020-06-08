import React from "react";
declare type Props = {
    autoFocus?: boolean;
    disabled?: boolean;
    field: {
        [key: string]: any;
    };
    form: {
        [key: string]: any;
    };
    format?: "html" | "markdown";
    label?: string;
    placeholder?: string;
};
declare const RichTextField: (props: Props) => React.ReactNode;
export default RichTextField;
