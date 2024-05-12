import { default as React } from '../../../../types/react';
import { AssignItem } from '../../../../../bpmnComponentTypes';

export default function SelectAssignTable(props: {
    assignList: AssignItem[];
    setAssignList: React.Dispatch<React.SetStateAction<AssignItem[]>>;
}): import("react/jsx-runtime").JSX.Element;
