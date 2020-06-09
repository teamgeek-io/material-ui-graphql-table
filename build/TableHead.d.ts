import React from "react";
import type { Action, Field } from ".";
interface Props {
    fields: Field[];
    sort?: string;
    onSortChange?(sortValue: string): void;
    selectedObjects?: {
        [key: string]: any;
    }[];
    selectionDisabled?: boolean;
    onToggleSelection?: () => void;
    actionsHidden?: boolean;
    actions?: Action[];
}
declare const TableHead: React.FC<Props>;
export default TableHead;
