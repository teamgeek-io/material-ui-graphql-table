import React from "react";
import type { ElementType, ReactNode } from "react";
import type { DocumentNode } from "apollo-boost";
interface GenericDictionary {
    [key: string]: any;
}
export interface Action {
    title: string;
    onAction: (data: any) => void;
    icon: ElementType | ReactNode | (() => void);
}
interface Option {
    label: string;
    value: any;
}
declare type FieldType = "autocomplete" | "datetime" | "select" | "switch" | "editor" | "autocompletelist";
export interface AutocompleteProps {
    connectionName: string;
    labelPath?: string;
    query: DocumentNode;
    valuePath?: string;
    saveArg?: string;
}
export interface Field {
    name: string;
    type?: FieldType;
    schema?: {
        [key: string]: any;
    };
    label?: string;
    hidden?: boolean;
    readonly?: boolean;
    sortable?: boolean;
    sortKey?: string;
    multiline?: boolean;
    options?: Option[] | AutocompleteProps;
}
declare type AnyObject = Record<string, unknown>;
interface Props {
    title?: string;
    typeName: string;
    fields: Field[];
    query: DocumentNode;
    queryVariables?: AnyObject;
    connectionName: string;
    saveMutation?: DocumentNode;
    saveResultExtractor(result: GenericDictionary): void | Error | GenericDictionary;
    editDisabled?: boolean;
    deleteMutation?: DocumentNode;
    mutationVariables?: AnyObject | ((data: AnyObject) => AnyObject);
    searchVariable?: string;
    initialSearch?: string;
    sortVariable?: string;
    initialSort?: string;
    multiselect?: boolean;
    actions?: Action[];
    onSuccess?: (result: string) => void;
    onWarning?: () => void;
    onError?(message: string): void;
    onInfo?: () => void;
    onResult?(result: GenericDictionary): void;
    onAddClick?: () => void;
    onAdded?: (data: AnyObject) => void;
    onEditClick?: (data: AnyObject) => void;
    onEdited?: (data: AnyObject) => void;
    onDeleteClick?: (objects: AnyObject[]) => void;
    onDeleted?: (objects: AnyObject[]) => void;
}
declare const GraphqlTable: React.FC<Props>;
export default GraphqlTable;
