export interface BpmnInstance {
    modeling: {
        updateProperties: (element: any, properties: any) => void;
    };
    bpmnElement: {
        businessObject?: {
            extensionElements?: {
                values: any[];
            };
        };
    };
    moddle: {
        create: (type: string, attributes?: object) => any;
    };
}

export interface ListenerOptions {
    event: string;
    id?: string;
    expression?: string;
    delegateExpression?: string;
    class?: string;
    listenerType: "expression" | "delegateExpression" | "class";
}

export interface AssignInfoType {
    name: string;
    getList?: () => Promise<any>;
    getInfoById?: (id: string|number) => Promise<any>;
}

export interface Position{
    name:string,
    id:string,
    code:string
}
export interface Role {
    name: string,
    id: string
}
export interface Company {
    name: string;
}

export interface Office {
    name: string;
}

export interface User {
    id: string;
    loginName: string;
    name: string;
    company: Company;
    office: Office;
}

export interface UserListResponse {
    list: User[];
    count: number;
}

export interface RoleListResponse{
    list: Role[];
    count: number
}

export interface PositionListResponse{
    list: Position[];
    count: number
}

export interface AssignItem {
    typeName?: string;
    valueName?: string;
    type: string;
    sort: number;
    value?: string;
    detail?: any[];// Assuming valueName is a string
}
