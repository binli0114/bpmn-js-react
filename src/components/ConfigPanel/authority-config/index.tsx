import React, { useState, useEffect } from "react";
import { Input, Radio, Modal } from "antd";
import SelectUser from "../common/select-user";
import SelectRole from "../common/select-role";
import { getRoleInfoById, getUserInfoById } from "../../services";
import {BpmnInstance, ConfigProps, User, Role} from "../../bpmnComponentTypes";
/**
 * 权限设置
 */

export default function AuthorityConfig({ bpmnInstance }: ConfigProps) {

  const [selectUser, setSelectUser] = useState<User[]>([]);
  const [selectRole, setSelectRole] = useState<Role[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [role, setRole] = useState<Role[]>([]);
  const [authorityType, setAuthorityType] = useState<string>("all");
  const [selectUserVisible, setSelectUserVisible] = useState<boolean>(false);
  const [selectRoleVisible, setSelectRoleVisible] = useState<boolean>(false);
  const { modeling, bpmnElement = {} } = bpmnInstance;

  async function updateUserInfo(str:string) {
    const list = str.split(",");
    const arr:User[] = [];
    if (list[0].length) {
      for (const id of list) {
        console.log(`id:${id}`);
        await getUserInfoById().then((data) => {
          arr.push(data);
        });
      }
    }
    setUser(arr);
  }

  // 根据角色id获取角色信息
  async function updateRoleInfo(str:string) {
    const list = str.split(",");
    const arr:Role[] = [];
    if (list[0].length) {
      for (const id of list) {
        console.log(`id:${id}`);
        await getRoleInfoById().then((data) => {
          arr.push(data);
        });
      }
    }
    setRole(arr);
  }
  // 读取已有配置
  useEffect(() => {
    const busObj = bpmnElement.businessObject;
    if (busObj) {
      const candidateStarterGroups = busObj.candidateStarterGroups || "";
      const candidateStarterUsers = busObj.candidateStarterUsers || "";
      updateUserInfo(candidateStarterUsers);
      updateRoleInfo(candidateStarterGroups);

      if (candidateStarterGroups.length || candidateStarterUsers.length) {
        setAuthorityType("assign");
      }
    }
  }, [bpmnElement.businessObject]);

  // 根据用户id获取用户信息


  //添加用户
  function selectUserModalOk() {
    setSelectUserVisible(false);
    setUser(selectUser);
    modeling.updateProperties(bpmnElement, {
      "flowable:candidateStarterUsers": selectUser
        .map((item) => item.id)
        .join(","),
    });
  }

  //添加角色
  function selectRoleModalOk() {
    setSelectRoleVisible(false);
    setRole(selectRole);
    modeling.updateProperties(bpmnElement, {
      "flowable:candidateStarterGroups": selectRole
        .map((item) => item.id)
        .join(","),
    });
  }

  // 显示用户、角色名称
  function showName(list: Array<User | Role>) {
    let str = "";
    for (const item of list) {
      str += item.name + ",";
    }
    return str.substring(0, str.length - 1);
  }

  // 打开添加用户对话框
  function openAddUserModal() {
    setSelectUserVisible(true);
    setSelectUser(user);
  }

  // 打开添加角色对话框
  function openAddRoleModal() {
    setSelectRoleVisible(true);
    setSelectRole(role);
  }

  //允许启动选择所有成员时要清空选择的用户和角色信息
  function onChangeType(e:any) {
    setAuthorityType(e.target.value);
    setRole([]);
    setUser([]);
    setSelectRole([]);
    setSelectUser([]);
    modeling.updateProperties(bpmnElement, {
      "flowable:candidateStarterGroups": "",
      "flowable:candidateStarterUsers": "",
    });
  }

  return (
    <>
      <div className="base-form">
        <div>
          <span>Launch</span>
          <Radio.Group
            onChange={onChangeType}
            value={authorityType}
            style={{ marginTop: 5 }}
          >
            <Radio value="all">All</Radio>
            <Radio value="assign">Assignee</Radio>
          </Radio.Group>
        </div>
        {authorityType === "assign" && (
          <>
            <div>
              <span>Add User</span>
              <Input.Search
                placeholder="Please select"
                onSearch={openAddUserModal}
                enterButton
                style={{ width: 376, textAlign: "left" }}
                value={showName(user)}
              />
            </div>
            <div>
              <span>Add Role</span>
              <Input.Search
                placeholder="Please select"
                onSearch={openAddRoleModal}
                enterButton
                style={{ width: 376, textAlign: "left" }}
                value={showName(role)}
              />
            </div>
          </>
        )}
      </div>
      <Modal
        title="Please select user"
        width={1000}
        open={selectUserVisible}
        onOk={selectUserModalOk}
        onCancel={() => setSelectUserVisible(false)}
        bodyStyle={{ padding: 10 }}
        destroyOnClose
      >
        <SelectUser setSelectUser={setSelectUser} selectUser={selectUser} />
      </Modal>
      <Modal
        title="Please select role"
        width={788}
        open={selectRoleVisible}
        onOk={selectRoleModalOk}
        onCancel={() => setSelectRoleVisible(false)}
        bodyStyle={{ padding: 10 }}
        destroyOnClose
      >
        <SelectRole setSelectRole={setSelectRole} selectRole={selectRole} />
      </Modal>
    </>
  );
}
