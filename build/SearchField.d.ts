import React from "react";
import { StandardTextFieldProps } from "@material-ui/core/TextField";
interface Props extends StandardTextFieldProps {
    value?: string;
    onSearchValueChange?(value: string): void;
    debounceWait?: number;
    onSearch?(value: string): void;
}
declare const SearchField: React.FC<Props>;
export default SearchField;
