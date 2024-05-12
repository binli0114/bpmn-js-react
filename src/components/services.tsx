/*
 * 调用后端接口
 */

import { defaultBpmnXml } from "../utils/bpmn.utils.js";
import {Position, Role, RoleListResponse, UserListResponse, PositionListResponse, User, Company} from "./bpmnComponentTypes";

// 获取xml数据
function getXmlData():Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(defaultBpmnXml), 1000);
  });
}

/*顶部操作按钮接口*/
// 保存并发布
function saveBpmnXml():Promise<void> {
  return new Promise<void>((resolve) => {
    resolve();
  });
}

// 保存草稿
function saveBpmnXmlDraft():Promise<void> {
  return new Promise<void>((resolve) => {
    resolve();
  });
}

/*右侧属性面板接口*/
// 获取常用监听器列表
function getListenerList():Promise<any> {
  const data = [
    {
      name: "end",
      event: "end",
      id: "1",
      listenerType: "1",
      valueType: "expression",
      implement: "测试测试",
    },
    {
      name: "start",
      event: "start",
      id: "2",
      listenerType: "1",
      valueType: "class",
      implement: "测试测试2",
    },
  ];
  return new Promise((resolve):void => {
    resolve({ list: data, count: 30 });
  });
}

// 获取表单列表
function getFormList():Promise<any> {
  const data = [
    {
      name: "工单申请",
      version: "3",
      id: "1",
      type: 1,
      fields: [
        {
          id: "111",
          name: "单行文本",
          readable: true,
          writable: false,
        },
        {
          id: "1112",
          name: "单行文本2",
          readable: true,
          writable: true,
        },
      ],
    },
    {
      name: "工单申请2",
      version: "3",
      id: "2",
      type: 1,
      fields: [
        {
          id: "111",
          name: "单行文本3",
          readable: true,
          writable: false,
        },
        {
          id: "1112",
          name: "单行文本4",
          readable: true,
          writable: true,
        },
      ],
    },
  ];
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取按钮列表
function getButtonList():Promise<any> {
  const data = [
    {
      id: "1406831300197498882",
      name: "派单",
      code: "_flow_assign",
      sort: 1,
    },
    {
      id: "1406832507825700866",
      name: "接单",
      code: "_flow_receive",
      sort: 2,
    },
  ];
  return new Promise((resolve):void => {
    resolve({ list: data, count: 2 });
  });
}

// 获取用户列表
function getUserList(): Promise<UserListResponse> {
  const data: User[] = [
    {
      id: "11",
      loginName: "Admin",
      name: "Lily",
      company: {
        name: "xx公司",
      },
      office: {
        name: "开发一部",
      },
    },
    {
      id: "22",
      loginName: "Admin",
      name: "Alice",
      company: {
        name: "xx公司",
      },
      office: {
        name: "开发二部",
      },
    },
  ];

  return new Promise<UserListResponse>((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

// 根据用户id获取用户信息
function getUserInfoById():Promise<User> {
  const data = {
    id: "11",
    loginName: "Admin",
    name: "Lily",
    company: {
      name: "xx公司",
    },
    office: {
      name: "开发一部",
    },
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取角色列表
function getRoleList():Promise<RoleListResponse> {
  const data = [
    {
      id: "11",
      name: "System Administrator",
    },
    {
      id: "22",
      name: "System Administrator2"
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

// 根据角色id获取角色信息
function getRoleInfoById(): Promise<Role> {
  const data = {
    id: "11",
    name: "System Admin",
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取岗位列表
function getPostList():Promise<PositionListResponse> {
  const data = [
    {
      id: "11",
      name: "CEO",
      code: "aa",
    },
    {
      id: "22",
      name: "CTO",
      code: "bb",
    },
  ];
  return new Promise((resolve) => {
    resolve({ list: data, count: 30 });
  });
}

// 根据id获取岗位信息
function getPostInfoById():Promise<Position> {
  const data = {
    id: "22",
    name: "部长",
    code: "bb",
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取部门列表
function getDepartList():Promise<any> {
  const data = {
    name: "xx公司",
    id: "2343",
    children: [
      {
        name: "开发一部",
        id: "2323",
      },
      {
        name: "开发二部",
        id: "23123",
      },
    ],
  };
  return new Promise((resolve):void => {
    resolve(data);
  });
}

// 获取部门列表（侧边选择项）
function getSideTreeDepartList():Promise<any> {
  const data = [
    {
      title: "xx公司",
      key: "com_2323",
      children: [
        {
          title: "开发一部",
          key: "off_2323_1",
        },
        {
          title: "开发二部",
          key: "off_2323_2",
        },
      ],
    },
  ];

  return new Promise((resolve):void => {
    resolve(data);
  });
}

// 获取部门列表(下拉树)
function getSelectTreeDepartList():Promise<any> {
  const data = [
    {
      title: "xx公司",
      value: "com_2323",
      children: [
        {
          title: "开发一部",
          value: "off_2323_1",
        },
        {
          title: "开发二部",
          value: "off_2323_2",
        },
      ],
    },
  ];

  return new Promise((resolve):void => {
    resolve(data);
  });
}

// 根据id获取部门信息
function getDepartInfoById():Promise<any> {
  const data = {
    name: "开发一部",
    id: "2323",
  };
  return new Promise((resolve) => {
    resolve(data);
  });
}

// 获取流转条件表单字段
function getConditionField():Promise<any> {
  const data = [
    {
      name: "字段1",
      id: "2323",
    },
    {
      name: "字段2",
      id: "23232",
    },
  ];
  return new Promise((resolve):void => {
    resolve(data);
  });
}

// 获取流程表达式
function getConditionExpress():Promise<any> {
  const data = [
    {
      name: "不同意",
      id: "2323",
      express: "${disagree}",
      note: "备注信息",
    },
    {
      name: "同意",
      id: "23232",
      express: "${agree}",
      note: "备注信息2",
    },
  ];
  return new Promise((resolve):void => {
    resolve({ list: data, count: 30 });
  });
}



export {
  getListenerList,
  getFormList,
  saveBpmnXml,
  saveBpmnXmlDraft,
  getButtonList,
  getSelectTreeDepartList,
  getSideTreeDepartList,
  getUserList,
  getUserInfoById,
  getRoleInfoById,
  getRoleList,
  getDepartInfoById,
  getPostInfoById,
  getPostList,
  getConditionField,
  getConditionExpress,
  getXmlData,
};
