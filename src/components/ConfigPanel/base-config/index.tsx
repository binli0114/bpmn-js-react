import React, { useState, useEffect } from "react";
import { Input, message } from "antd";

interface baseInfoType{
  id?:string,
  name?:string,
  documentation?:string
}
export default function BaseConfig(props: any) {
  const { bpmnInstance } = props;
  const [baseInfo, setBaseInfo] = useState<baseInfoType>();
  const {
    modeling,
    bpmnElement = {},
    elementRegistry,
    bpmnFactory,
  } = bpmnInstance;
  // 读取已有配置
  useEffect(() => {
    if (bpmnElement.businessObject) {
      const { id, name, documentation = [] } = bpmnElement.businessObject;

      if (bpmnElement.businessObject.$type.slice(5) === "Process") {
        // 初始化id和name
        let initId = id ? id : "Process_" + new Date().getTime();
        let initName =
          name || window.hasChangeName ? name : "Process_" + new Date().getTime();

        // 如果是导入流程，id和name需要重新设置
        if (window.fromLocalFile) {
          initId = "Process_" + new Date().getTime();
          initName = "Process_" + new Date().getTime();
        }

        if (!id || window.fromLocalFile) {
          modeling.updateProperties(bpmnElement, {
            id: initId,
          });
        }
        if (!name || window.fromLocalFile) {
          modeling.updateProperties(bpmnElement, { name: initName });
        }
        setBaseInfo({
          id: initId,
          name: initName,
          documentation: documentation[0] && documentation[0].text,
        });
        window.fromLocalFile = false;
      } else {
        setBaseInfo({
          id: id,
          name: name,
          documentation: documentation[0] && documentation[0].text,
        });
      }
    }
  }, [bpmnElement.businessObject]);

  // 改变配置信息
  const baseInfoChange = (value: string, key: string) => {
    if(baseInfo) {
      setBaseInfo({...baseInfo, [key]: value});
    } else{
      setBaseInfo({[key]: value});
    }
    const attrObj = Object.create(null);
    attrObj[key] = value;
    switch (key) {
      case "id":
        if (value) {
          modeling.updateProperties(bpmnElement, {
            id: value,
          });
        }
        break;
      case "name":
        window.hasChangeName = true;
        console.log("baseInfoChange", window.hasChangeName);
        modeling.updateProperties(bpmnElement, attrObj);
        break;
      case "documentation":
        const element = elementRegistry.get(baseInfo?.id);
        const documentation = bpmnFactory.create("bpmn:Documentation", {
          text: value,
        });
        modeling.updateProperties(element, {
          documentation: [documentation],
        });
        break;
    }
  };

  return (
      <div className="base-form">
        <div>
          <span>ID</span>
          <Input
              value={baseInfo?.id}
              onChange={(e) => baseInfoChange(e.target.value, "id")}
          />
        </div>
        <div>
          <span>Name</span>
          <Input
              value={baseInfo?.name}
              onChange={(e) => baseInfoChange(e.target.value, "name")}
          />
        </div>
        <div>
          <span>Description</span>
          <Input.TextArea
              value={baseInfo?.documentation}
              onChange={(e) => baseInfoChange(e.target.value, "documentation")}
          />
        </div>
      </div>
  );
}
