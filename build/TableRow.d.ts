import React from "react";
import type { Action, Field } from ".";
interface Props {
    data: {
        [key: string]: any;
    };
    fields: Field[];
    selected?: boolean;
    onSelect?(selected: {
        [key: string]: any;
    }): void;
    onEdit?(editing: {
        [key: string]: any;
    }): void;
    editable?: boolean;
    deleting?: boolean;
    actions?: Action[];
}
declare const TableRow: React.FC<Props>;
export default TableRow;
