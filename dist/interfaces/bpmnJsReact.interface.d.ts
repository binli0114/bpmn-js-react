import { IBpmnElement } from './bpmn.interface';
import { useBpmnJsReact } from '../hooks/bpmn.hook';

export type BpmnJsReactHandle = {
    saveXml: Function;
    saveXmlAsync: Function;
    importXml: Function;
    getModeler: Function;
    getCanvas: Function;
    zoomIn: Function;
    zoomOut: Function;
    zoomFit: Function;
    setColor: (elements: IBpmnElement[], color: {
        stroke?: string;
        fill?: string;
    } | object) => void;
    addMarker: (id: string, cssClass: string) => void;
    removeMarker: (id: string, cssClass: string) => void;
};
export type BpmnJsReactProps = {
    mode?: "view" | "edit";
    useBpmnJsReact?: ReturnType<typeof useBpmnJsReact>;
    xml?: any;
    height?: any;
    onLoading?: Function;
    onError?: Function;
    onShown?: Function;
    saveXml?: Function;
    click?: Function;
    dbclick?: Function;
    hover?: Function;
    out?: Function;
    mousedown?: Function;
    mouseup?: Function;
    zoomActions?: boolean;
};
