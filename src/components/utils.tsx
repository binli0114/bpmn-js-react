import {
  getSelectTreeDepartList,
  getDepartInfoById,
  getPostList,
  getPostInfoById,
  getUserList,
  getUserInfoById,
  getRoleList,
  getRoleInfoById,
} from "./services";

interface BpmnInstance {
  modeling: {
    updateProperties: (element: any, properties: any) => void;
  };
  bpmnElement: any;
  moddle: {
    create: (type: string, attributes?: object) => any;
  };
}

export function updateElementExtensions(extensionList: any[], bpmnInstance: BpmnInstance): void {
  const { modeling, bpmnElement, moddle } = bpmnInstance;
  const list = extensionList.map(item => {
    const proto = moddle.create(item.$type, {}).__proto__;
    return Object.setPrototypeOf({ ...item }, proto);
  });

  const extensions = moddle.create("bpmn:ExtensionElements", { values: list });
  modeling.updateProperties(bpmnElement, { extensionElements: extensions });
}

interface ListenerOptions {
  event: string;
  id?: string;
  expression?: string;
  delegateExpression?: string;
  class?: string;
  listenerType: "expression" | "delegateExpression" | "class";
}

export function createListenerObject(options: ListenerOptions, isTask: boolean, bpmnInstances: BpmnInstance): any {
  const { moddle } = bpmnInstances;
  const listenerObj: any = {
    event: options.event,
    ...(isTask && { id: options.id })
  };

  switch (options.listenerType) {
    case "expression":
      listenerObj.expression = options.expression;
      break;
    case "delegateExpression":
      listenerObj.delegateExpression = options.delegateExpression;
      break;
    default:
      listenerObj.class = options.class;
  }

  return moddle.create(`flowable:${isTask ? "TaskListener" : "ExecutionListener"}`, listenerObj);
}

// Configuration data and utilities
interface AssignInfoType {
  name: string;
  getList?: () => Promise<any>;
  getInfoById?: (id: string) => Promise<any>;
}

export const assignInfo: Record<string, AssignInfoType> = {
  user: {
    name: "用户",
    getList: getUserList,
    getInfoById: getUserInfoById,
  },
  post: {
    name: "岗位",
    getList: getPostList,
    getInfoById: getPostInfoById,
  },
  depart: {
    name: "部门",
    getList: getSelectTreeDepartList,
    getInfoById: getDepartInfoById,
  },
  role: {
    name: "角色",
    getList: getRoleList,
    getInfoById: getRoleInfoById,
  },
  applyUserId: { name: "发起人" },
  previousExecutor: { name: "上一步执行人" },
  currentUserId: { name: "当前登录用户" },
  sql: { name: "sql脚本" },
  custom: { name: "自定义条件" },
};

export const pagination = (total: number) => ({
  total,
  pageSize: 10,
  size: "small",
  hideOnSinglePage: false,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "50", "100"],
  showQuickJumper: true,
  showTotal: () => `共${total}条`,
});

export function Type_Script_Is(element: any, type: string): boolean {
  const bo = getBusinessObject(element);
  return bo && typeof bo.$instanceOf === 'function' && bo.$instanceOf(type);
}

export function getBusinessObject(element: any): any {
  return (element && element.businessObject) || element;
}

export const defaultBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"  
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"  
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"  
targetNamespace="http://bpmn.io/schema/bpmn"  
id="Definitions_1"> 
     <bpmn:process id="Process_1" isExecutable="false"> 
          <bpmn:startEvent id="StartEvent_1"/> 
     </bpmn:process>
     <bpmndi:BPMNDiagram id="BPMNDiagram_1"> 
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"> 
                <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"> 
                    <dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/> 
                </bpmndi:BPMNShape>
          </bpmndi:BPMNPlane>
     </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
