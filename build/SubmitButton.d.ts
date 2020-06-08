import React from "react";
import { Props as ButtonProps } from "./Button";
interface Props extends ButtonProps {
    [name: string]: any;
}
declare const SubmitButton: React.FC<Props>;
export default SubmitButton;
