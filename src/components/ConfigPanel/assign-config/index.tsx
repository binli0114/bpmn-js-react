import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import SelectAssignTable from "./SelectAssignTable";
import AssignTable from "./AssignTable";
import { assignInfo, updateElementExtensions } from "../../utils";
import {AssignItem, BpmnInstance, AssignInfoType} from "../../bpmnComponentTypes"


interface Props {
  bpmnInstance: BpmnInstance;
}

/**
 * 审核者配置
 */
const AssignConfig: React.FC<Props> = ({ bpmnInstance }) => {
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [assignList, setAssignList] = useState<AssignItem[]>([]);
  const [assignAttr, setAssignAttr] = useState<AssignItem[]>([]);
  const [otherAttr, setOtherAttr] = useState<AssignItem[]>([]);
  const { bpmnElement } = bpmnInstance;

  useEffect(() => {
    const busObj = bpmnElement?.businessObject;
    if (busObj?.extensionElements?.values) {
      const other: any[] = [];
      const assign = busObj.extensionElements.values.filter((ex) => {
        if (ex.$type.indexOf("Assignee") !== -1) {
          return true;
        }
        other.push(ex);
        return false;
      });
      setOtherAttr(other);
      updateAssign(assign);
    }
  }, [bpmnElement?.businessObject]);

  // todo: Properties `type`, `value` and `sort` does not exist on type `AssignInfoType`
  // it's the demo code; we will finalise the service later;
  async function updateAssign(assign: AssignInfoType[]) {
    const list: AssignItem[] = [];
    // for (const item of assign) {
    //   const { type, value = "", sort } = item;
    //   if (assignInfo[type] && assignInfo[type].getInfoById) {
    //     const { getInfoById, name } = assignInfo[type];
    //     const details = ["applyUserId", "previousExecutor", "currentUserId"].includes(type)
    //       ? { typeName: name, valueName: name, type, sort }
    //       : await getInfoById("1").then((data:any) => ({
    //           typeName: name,
    //           valueName: data.name,
    //           type,
    //           sort,
    //           detail: [data]
    //         }));
    //
    //     list.push(details);
    //   }
    // }
    setAssignAttr(list);
  }

  function handSelectModalOk() {
    const arr: any[] = [];
    assignList.forEach((item) => {
      if (item.value || ["applyUserId", "previousExecutor", "currentUserId"].includes(item.type)) {
        const newItem = { ...item };
        delete newItem.typeName;
        delete newItem.valueName;
        delete newItem.detail;
        const object = bpmnInstance.moddle.create("flowable:Assignee", {
          ...newItem,
          condition: 0,
          operationType: 0,
        });
        arr.push(object);
      }
    });
    updateElementExtensions([...otherAttr, ...arr], bpmnInstance);
    setAssignAttr(assignList);
    setSelectModalVisible(false);
  }

  function openModal() {
    setSelectModalVisible(true);
    setAssignList([...assignAttr]);
  }

  return (
    <>
      <div className="config-btn">
        <Button type="primary" onClick={openModal} style={{ width: 80 }}>
          分配人员
        </Button>
      </div>
      <AssignTable assignList={assignAttr} />
      <Modal
        title="节点人员设置"
        open={selectModalVisible}
        onOk={handSelectModalOk}
        onCancel={() => setSelectModalVisible(false)}
        width={1000}
        destroyOnClose
      >
        <SelectAssignTable
          assignList={assignList}
          setAssignList={setAssignList}
        />
      </Modal>
    </>
  );
}

export default AssignConfig;
