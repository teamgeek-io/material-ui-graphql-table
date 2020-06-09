import React from "react";
import type { Action, Field } from ".";
interface GenericDictionary {
    [key: string]: any;
}
interface Props {
    result: GenericDictionary;
    connectionName: string;
    fields: Field[];
    sort?: string;
    onSortChange?: (sortValue: string) => void;
    selectedObjects?: GenericDictionary[];
    objectsDeleting?: GenericDictionary[];
    onSelect?(values: GenericDictionary): void;
    onToggleSelection?: () => void;
    onEdit?: (object: any) => void;
    editable?: boolean;
    actions?: Action[];
}
declare const ResultTable: React.FC<Props>;
export default ResultTable;
