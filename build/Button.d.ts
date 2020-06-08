import React, { ReactNode } from "react";
import { ButtonProps } from "@material-ui/core/Button";
export interface Props extends ButtonProps {
    children?: ReactNode;
    rootClassName?: string;
    wrapperClassName?: string;
    loading?: boolean;
}
declare const Button: React.FC<Props>;
export default Button;
