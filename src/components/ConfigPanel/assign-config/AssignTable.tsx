import React from "react";
import { Table } from "antd";
import {AssignItem} from "../../bpmnComponentTypes";


interface AssignTableProps {
  assignList: AssignItem[];
}

/*
 * 审核者列表
 */
const AssignTable: React.FC<AssignTableProps> = ({ assignList }) => {
  const columns = [
    {
      title: "用户类型",
      dataIndex: "typeName",
      key: "typeName",
      width: 130,
    },
    {
      title: "用户来自",
      dataIndex: "valueName",
      key: "valueName",
      width: 130,
    },
  ];

  return (
      <Table
          dataSource={assignList.map((item, index) => ({ ...item, key: index.toString() }))}
          columns={columns}
          pagination={false}
          bordered
      />
  );
}

export default AssignTable;
