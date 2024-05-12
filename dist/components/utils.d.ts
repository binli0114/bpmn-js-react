import { AssignInfoType, BpmnInstance, ListenerOptions } from '../../types/bpmnComponentTypes';

export declare function updateElementExtensions(extensionList: any[], bpmnInstance: BpmnInstance): void;
export declare function createListenerObject(options: ListenerOptions, isTask: boolean, bpmnInstances: BpmnInstance): any;
export declare const assignInfo: Record<string, AssignInfoType>;
export declare const pagination: (total: number) => {
    total: number;
    pageSize: number;
    size: string;
    hideOnSinglePage: boolean;
    showSizeChanger: boolean;
    pageSizeOptions: string[];
    showQuickJumper: boolean;
    showTotal: () => string;
};
export declare function Type_Script_Is(element: any, type: string): boolean;
export declare function getBusinessObject(element: any): any;
export declare const defaultBpmnXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"  \nxmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\"  \nxmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\"  \nxmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\"  \ntargetNamespace=\"http://bpmn.io/schema/bpmn\"  \nid=\"Definitions_1\"> \n     <bpmn:process id=\"Process_1\" isExecutable=\"false\"> \n          <bpmn:startEvent id=\"StartEvent_1\"/> \n     </bpmn:process>\n     <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\"> \n          <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\"> \n                <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\"> \n                    <dc:Bounds height=\"36.0\" width=\"36.0\" x=\"173.0\" y=\"102.0\"/> \n                </bpmndi:BPMNShape>\n          </bpmndi:BPMNPlane>\n     </bpmndi:BPMNDiagram>\n</bpmn:definitions>";
