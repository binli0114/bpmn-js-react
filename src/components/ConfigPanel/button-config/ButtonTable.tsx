import React from "react";
import { Table, Button } from "antd";
import {ButtonItem} from "../../bpmnComponentTypes";

interface ButtonTableProps {
  editButton: (record: ButtonItem, index: number) => void;
  deleteButton: (index: number) => void;
  buttonList: ButtonItem[];
}

/*
 * 按钮列表
 */
const ButtonTable: React.FC<ButtonTableProps> = ({ editButton, deleteButton, buttonList }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 80,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 80,
    },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "sort",
      width: 80,
    },
    {
      title: "Is hidden",
      dataIndex: "isHide",
      key: "isHide",
      width: 80,
      render: (value: string) => <span>{value === "0" ? "No" : "Yes"}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (value: any, record: ButtonItem, index: number) => (
          <div className="table-btn">
            <Button type="link" onClick={() => editButton(record, index)}>
              Edit
            </Button>
            <Button
                type="link"
                style={{ marginLeft: 10 }}
                onClick={() => deleteButton(index)}
            >
              Remove
            </Button>
          </div>
      ),
    },
  ];

  return (
      <Table
          dataSource={buttonList.map((item, index) => ({ ...item, key: index.toString() }))}
          columns={columns}
          pagination={false}
          bordered
      />
  );
}

export default ButtonTable;
