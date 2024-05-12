import { BpmnModeler as IBpmnModeler } from '../../types/bpmn-js/lib/Modeler';
import { ImportXMLResult, ModdleElement, SaveXMLOptions, SaveXMLResult } from '../../types/bpmn-js/lib/BaseViewer';

export type BpmnJsReactHook = () => {
    bpmnModeler: ReturnType<typeof IBpmnModeler>;
    setBpmnModeler: React.Dispatch<React.SetStateAction<ReturnType<typeof IBpmnModeler>>>;
    importXml: (xml: string, bpmnDiagram?: ModdleElement | string) => Promise<ImportXMLResult>;
    saveXml: (options?: SaveXMLOptions) => Promise<SaveXMLResult>;
    getElementById: (id: string) => any;
    zoomIn: (step?: number) => void;
    zoomOut: (step?: number) => void;
    zoomFit: () => void;
    setStyle: () => void;
    setColor: (elements: any, color: any) => void;
    addMarker: (id: string, cssClass: string) => void;
    removeMarker: (id: string, cssClass: string) => void;
    getCanvas: () => any;
    getAttribute: (id: string, attr: string) => any;
    setAttribute: (id: string, attr: string, value: any) => void;
    getElements: () => any;
    getBusinessObject: (id: string) => any;
    getIncoming: (id: string) => any;
    getOutgoing: (id: string) => any;
};
export declare const useBpmnJsReact: BpmnJsReactHook;
