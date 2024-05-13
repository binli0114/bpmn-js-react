import React, { useState, useEffect } from "react";
import { Select, Radio, InputNumber, RadioChangeEvent } from "antd";
import {ConfigProps} from "../../bpmnComponentTypes";
const { Option } = Select;

/**
 * 会签设置
 */
const CountersignConfig: React.FC<ConfigProps> = ({ bpmnInstance }) => {
  const [type, setType] = useState<number>(0);
  const [passType, setPassType] = useState<string>("all");
  const [rate, setRate] = useState<string>("100");
  const [instance, setInstance] = useState<any>(null);
  const { modeling, bpmnElement = {}, moddle } = bpmnInstance;

  function createInstance(type: number) {
    const attr = {
      "flowable:collection": "${mutiInstanceHandler.getList(execution)}",
      "flowable:elementVariable": "assignee",
      rate: 50,
      ...(type === 2 && { isSequential: true }),
    };
    const obj = moddle!.create("bpmn:MultiInstanceLoopCharacteristics", attr);
    setInstance(obj);
    modeling!.updateProperties(bpmnElement, {
      loopCharacteristics: obj,
    });
    return obj;
  }

  useEffect(() => {
    const busObj = bpmnElement.businessObject;
    if (busObj?.loopCharacteristics) {
      const { isSequential, completionCondition = {} } = busObj.loopCharacteristics;
      setType(isSequential ? 2 : 1);
      if (completionCondition.body) {
        const body = completionCondition.body;
        const index:number = body.indexOf("=");
        const num:number = parseFloat(body.substring(index + 1, body.length - 2)) * 100;
        setRate(num.toString());
        setPassType(num === 100 ? "all" : "rate");
        createInstance(type);
      }
    } else {
      setType(0);
    }
  }, [bpmnElement.businessObject]);



  function onChangeType(value: number) {
    setType(value);
    if (value === 0) {
      modeling!.updateProperties(bpmnElement, {
        loopCharacteristics: null,
        "flowable:assignee": "",
      });
    } else {
      createInstance(value);
    }
  }

  function onChangePassType(e: RadioChangeEvent) {
    setPassType(e.target.value);
    setRate("100");
    const body = "${nrOfCompletedInstances/nrOfInstances &gt;= 1 }";
    const completionCondition = moddle!.create("bpmn:FormalExpression", { body });
    modeling!.updateModdleProperties(bpmnElement, instance, {
      completionCondition,
    });
  }

  function onChangeRate(value: number|null) {
    if(value) {
      const rateValue = value.toString();
      setRate(rateValue);
      const body = "${nrOfCompletedInstances/nrOfInstances &gt;= " + parseFloat(rateValue) / 100 + " }";
      const completionCondition = moddle!.create("bpmn:FormalExpression", {body});
      modeling!.updateModdleProperties(bpmnElement, instance, {
        completionCondition,
      });
    }
  }

  return (
    <div className="base-form">
      <div>
        <span>Types</span>
        <Select<number> style={{ width: "100%" }} onChange={onChangeType} value={type}>
          <Option value={0}>No approval required</Option>
          <Option value={1}>Co-sign</Option>
          <Option value={2}>All sign</Option>
        </Select>
      </div>
      {type !== 0 && (
        <>
          <div>
            <span style={{ marginLeft: -15 }}>Done Condition</span>
            <Radio.Group onChange={onChangePassType} value={passType} style={{ marginTop: 5 }}>
              <Radio value="all">All approval</Radio>
              <Radio value="rate">Percentage approval</Radio>
            </Radio.Group>
          </div>
          <div>
            <InputNumber
              min={1}
              max={100}
              value={parseInt(rate, 10)}
              onChange={onChangeRate}
              style={{ marginLeft: 86, width: 150 }}
              disabled={passType === "all"}
            />
            <span style={{ marginLeft: -68 }}>%</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CountersignConfig;
