import React from "react";
interface Props {
    field: any;
    form: any;
    normalize?: (value: string) => string;
    [name: string]: any;
}
declare const TextField: React.FC<Props>;
export default TextField;
