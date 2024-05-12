import React, { useEffect, useState } from "react";
import { Table, Button, Select, Input } from "antd";
import {ConditionFieldItem} from "../../bpmnComponentTypes";
import {getConditionField} from "../../services";
const { Option } = Select;



interface FieldOption {
  id: string;
  name: string;
}

interface FieldTableProps {
  fieldList: ConditionFieldItem[];
  setFieldList: (fieldList: ConditionFieldItem[]) => void;
}

/*
 * 表单字段列表
 */
const FieldTable: React.FC<FieldTableProps> = ({ fieldList, setFieldList }) => {
  const [fieldOption, setFieldOption] = useState<FieldOption[]>([]);

  // 获取字段选项
  useEffect(() => {
    getConditionField().then((data: FieldOption[]) => setFieldOption(data));
  }, []);

  // 字段改变
  const onChange = (value: string, index: number, key: keyof ConditionFieldItem) => {
    const updatedFields = [...fieldList];
    updatedFields[index][key] = value;
    setFieldList(updatedFields);
  };

  // 删除
  const deleteField = (index: number) => {
    const updatedFields = [...fieldList];
    updatedFields.splice(index, 1);
    setFieldList(updatedFields);
  };

  const columns = [
    {
      title: "Field Name",
      dataIndex: "field",
      key: "field",
      width: 100,
      render: (rowValue: string, record: ConditionFieldItem, index: number) => (
          <Select
              style={{ width: 90 }}
              value={rowValue}
              onChange={(value: string) => onChange(value, index, "field")}
          >
            {fieldOption.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
            ))}
          </Select>
      ),
    },
    {
      title: "Condition",
      dataIndex: "compare",
      key: "compare",
      width: 100,
      render: (rowValue: string, record: ConditionFieldItem, index: number) => (
          <Select
              style={{ width: 90 }}
              value={rowValue}
              onChange={(value: string) => onChange(value, index, "compare")}
          >
            <Option value="<">Less than</Option>
            <Option value=">">Greater than</Option>
            <Option value="<=">Less than or equal</Option>
            <Option value="=">Equal</Option>
            <Option value=">=">Greater than or equal</Option>
          </Select>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 100,
      render: (rowValue: string, record: ConditionFieldItem, index: number) => (
          <Input
              value={rowValue}
              style={{ width: 90 }}
              onChange={(e) => onChange(e.target.value, index, "value")}
          />
      ),
    },
    {
      title: "Logic",
      dataIndex: "logic",
      key: "logic",
      width: 80,
      render: (rowValue: string, record: ConditionFieldItem, index: number) => (
          <Select
              style={{ width: 70 }}
              value={rowValue}
              onChange={(value: string) => onChange(value, index, "logic")}
          >
            <Option value="and">且</Option>
            <Option value="or">或</Option>
          </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 60,
      render: (value: any, record: ConditionFieldItem, index: number) => (
          <div className="table-btn" style={{ width: 50 }}>
            <Button type="link" onClick={() => deleteField(index)}>
              删除
            </Button>
          </div>
      ),
    },
  ];

  return (
      <Table
          dataSource={fieldList.map((item, index) => ({ ...item, key: index.toString() }))}
          columns={columns}
          pagination={false}
          bordered
      />
  );
};

export default FieldTable;
