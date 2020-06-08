import React from "react";
import { SelectInputProps } from "@material-ui/core/Select/SelectInput";
declare type Option = {
    value: any;
    label: string;
};
interface Props extends SelectInputProps {
    field: any;
    form: any;
    label: string;
    options: Option[];
    empty: boolean;
    normalize(value: any): any;
}
declare const SelectField: React.FC<Props>;
export default SelectField;
