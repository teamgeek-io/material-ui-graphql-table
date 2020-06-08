import { DocumentNode } from "apollo-boost";
import React from "react";
import { OutlinedTextFieldProps } from "@material-ui/core/TextField";
interface Props extends OutlinedTextFieldProps {
    connectionName: string;
    field: {
        name: string;
        value: any;
    };
    form: {
        errors: {
            [key: string]: any;
        };
        touched: {
            [key: string]: any;
        };
        setFieldValue: (name: string, value: any) => void;
        setFieldTouched: (name: string, touched: boolean) => void;
    };
    query: DocumentNode;
    labelExtractor?(item: any): string;
    labelPath?: string;
    searchVariable?: string;
    valueExtractor?(item: any): any;
    valuePath?: string;
}
declare const AutocompleteField: React.FC<Props>;
export default AutocompleteField;
