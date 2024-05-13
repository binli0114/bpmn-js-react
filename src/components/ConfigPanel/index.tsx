import React, { useState, useEffect } from "react";
import { CollapseProps, Flex, Input, Space } from "antd";
import { Collapse } from "antd";
import {InfoCircleFilled} from "@ant-design/icons";
import BaseConfig from "./base-config";
import AssignConfig from "./assign-config";
import FormConfig from "./form-config";
import ButtonConfig from "./button-config";
import AuthorityConfig from "./authority-config";
import ConditionConfig from "./condition-config";
import CountersignConfig from './countersign-config';
const { Panel } = Collapse;
interface ConfigPanelProps {
    bpmnInstance:any
}
const ConfigPanel: React.FC<ConfigPanelProps> = (props) => {

    const { bpmnInstance } = props;
    const [type, setType] = useState("Process");
    const { bpmnElement = {} } = bpmnInstance;

    useEffect(() => {
        if (bpmnElement.businessObject) {
            setType(bpmnElement.businessObject.$type.slice(5));
        }
    }, [bpmnElement.businessObject]);
    const header = (title:string) => (
        <>
            {title}
            <InfoCircleFilled />
        </>
    );
  return (
    <aside className={"config-panel"}>
      <Collapse
          accordion
          bordered={false}
          defaultActiveKey={["1"]}
          expandIconPosition="start"
      >
          <Panel header={header("Basic Information")} key="1">
              <BaseConfig bpmnInstance={bpmnInstance} />
          </Panel>
          {["UserTask"].includes(type) && (
              <Panel header={header("Reviewers")} key="2">
                  <AssignConfig bpmnInstance={bpmnInstance} />
              </Panel>
          )}
          {["UserTask"].includes(type) && (
              <Panel header={header("Button setting")} key="4">
                  <ButtonConfig bpmnInstance={bpmnInstance} />
              </Panel>
          )}
          {["StartEvent", "UserTask"].includes(type) && (
              <Panel header={header("Form setting")} key="3">
                  <FormConfig bpmnInstance={bpmnInstance} />
              </Panel>
          )}
          {["Process"].includes(type) && (
              <Panel header={header("Permission Setting")} key="10">
                  <AuthorityConfig bpmnInstance={bpmnInstance} />
              </Panel>
          )}
          {["SequenceFlow"].includes(type) && (
              <Panel header={header("Condition Setting")} key="6">
                  <ConditionConfig bpmnInstance={bpmnInstance} />
              </Panel>
          )}
          {["UserTask"].includes(type) && (
              <Panel header={header("Counter Sign Setting")} key="9">
                  <CountersignConfig bpmnInstance={bpmnInstance} />
              </Panel>
          )}
      </Collapse>
    </aside>
  );
};

export default ConfigPanel;
