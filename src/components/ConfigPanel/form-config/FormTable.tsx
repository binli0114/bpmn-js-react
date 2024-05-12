import React from "react";
import { Table, Checkbox } from "antd";
import {FieldItem, FormDataItem} from "../../bpmnComponentTypes";
// Define the type for the data items




// Define the type for the props
interface FormTableProps {
  data: FormDataItem[];
  onChangeProperty: (value: string, key: string, record: FieldItem, index: number) => void;
}


// FormTable component with props type
const FormTable: React.FC<FormTableProps> = ({ data = [], onChangeProperty }) => {
  const columns = [
    {
      title: "Form Name",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 100,
    },
    {
      title: "Form Id",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
  ];

  const expandedRowRender = (record: FormDataItem) => {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 137,
      },
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 138,
      },
      {
        title: "Readable",
        dataIndex: "readable",
        key: "readable",
        render: (value: boolean, record: FieldItem, index: number) => (
            <Checkbox
                onChange={(e) =>
                    onChangeProperty(e.target.checked.toString(), "readable", record, index)
                }
                checked={value}
            />
        ),
      },
      {
        title: "Writable",
        dataIndex: "writable",
        key: "writable",
        render: (value: boolean, record: FieldItem, index: number) => (
            <Checkbox
                onChange={(e) =>
                    onChangeProperty(e.target.checked.toString(), "writable", record, index)
                }
                checked={value}
            />
        ),
      },
    ];
    const data = record.fields ? record.fields.map((item) => ({ ...item, key: item.id })) : [];
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  return (
      <div className="form-table">
        <Table
            dataSource={data.map((item) => ({ ...item, key: item.id }))}
            columns={columns}
            pagination={false}
            expandedRowRender={expandedRowRender}
            bordered
        />
      </div>
  );
};

export default FormTable;
