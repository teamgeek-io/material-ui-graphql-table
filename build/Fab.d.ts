import React from "react";
declare type FabAction = "add" | "delete";
interface Props {
    action: FabAction;
    onClick(action: FabAction): void;
}
declare const Fab: React.FC<Props>;
export default Fab;
