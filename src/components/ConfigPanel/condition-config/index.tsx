import React, { useState, useEffect } from "react";
import { Radio, Divider, Button, Modal, Input } from "antd";
import { updateElementExtensions } from "../../utils";
import FieldTable from "./FieldTable";
import ExpressTable from "./ExpressTable";
import {ConfigProps, ConditionFieldItem} from "../../bpmnComponentTypes";


/*
 * 流转条件
 */
const ConditionConfig: React.FC<ConfigProps> = ({ bpmnInstance }: ConfigProps) => {
  const [type, setType] = useState<number>(0);
  const [fieldList, setFieldList] = useState<ConditionFieldItem[]>([]);
  const [otherList, setOtherList] = useState<any[]>([]);
  const [express, setExpress] = useState<string>("");
  const [selectModalVisible, setSelectModalVisible] = useState<boolean>(false);

  const { bpmnElement = {}, modeling, moddle } = bpmnInstance;

  useEffect(() => {
    if (bpmnElement.businessObject) {
      const busObj = bpmnElement.businessObject;

      if (busObj.conditionExpression) {
        setType(0);
        setExpress(busObj.conditionExpression.body);
      }

      const other: any[] = [];
      const list = busObj.extensionElements?.values.filter((ex) => {
        if (ex.$type.includes("Condition")) {
          return true;
        }
        other.push(ex);
        return false;
      }) || [];
      setOtherList(other);
      setFieldList(list as ConditionFieldItem[]);
    }
  }, [bpmnElement.businessObject]);

  useEffect(() => {
    const list = fieldList.map((item, index) => ({
      ...item,
      sort: index
    }));
    updateElementExtensions([...list, ...otherList], bpmnInstance);
  }, [fieldList, otherList, bpmnInstance]);

  const addField = () => {
    const newFields = [...fieldList, { field: "", compare: "<", value: "", logic: "and" }];
    setFieldList(newFields);
  };

  const handSelectModalOk = () => {
    setSelectModalVisible(false);
    if (modeling && moddle) {
      const conditionExpression = moddle.create("bpmn:FormalExpression", { body: express });
      modeling.updateProperties(bpmnElement, { conditionExpression });
    }
  };

  return (
      <>
        <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
          <Radio value={0}>Field</Radio>
          <Radio value={1}>Expression</Radio>
        </Radio.Group>
        <Divider />
        {type === 0 && (
            <>
              <Button type="primary" onClick={addField}>Add</Button>
              <FieldTable fieldList={fieldList} setFieldList={setFieldList} />
            </>
        )}
        {type === 1 && (
            <Input.Search
                placeholder="Please select"
                onSearch={() => setSelectModalVisible(true)}
                enterButton
                value={express}
            />
        )}
        <Modal
            title="Select Expression"
            open={selectModalVisible}
            onOk={handSelectModalOk}
            onCancel={() => setSelectModalVisible(false)}
            destroyOnClose
        >
          <ExpressTable setExpress={setExpress} />
        </Modal>
      </>
  );
};

export default ConditionConfig;
