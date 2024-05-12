import React, { useEffect, useState } from "react";
import { Table, Button, Input,  TableProps } from "antd";
import { getConditionExpress } from "../../services";
import {ExpressItem} from "../../bpmnComponentTypes";

interface ExpressTableProps {
  setExpress: (express: string) => void;
}

/*
 * 表达式列表
 */
const ExpressTable: React.FC<ExpressTableProps> = ({ setExpress }) => {
  const [dataSource, setDataSource] = useState<ExpressItem[]>([]);
  const [name, setName] = useState<string>("");
  const [pageSize, setPageSize] = useState<number|undefined>(10);
  const [pageNo, setPageNo] = useState<number|undefined>(1);
  const [orderBy, setOrderBy] = useState<string>("");
  const [, setTotal] = useState<number>(0);

  const updateDataSource = () => {
    //const params = { name, pageNo, pageSize, orderBy };
    getConditionExpress().then(data => {
      const { list, count } = data;
      setDataSource(
          list.map((item: { id: any }) => ({ ...item, key: item.id }))
      );
      setTotal(count);
    });
  };

  useEffect(() => {
    updateDataSource();
  }, [name, pageNo, pageSize, orderBy]);



  const handleTableChange: TableProps<ExpressItem>['onChange'] = (pagination, filters, sorter:any) => {
    setPageSize(pagination.pageSize);
    setPageNo(pagination.current);
    setOrderBy(
        sorter.field && sorter?.order ? `${sorter.field} ${sorter.order}` : ""
    );
  };

  // const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: ExpressItem[]) => {
  //   if (selectedRows.length > 0) {
  //     setExpress(selectedRows[0].express);
  //   }
  // };

  // const rowSelection = {
  //   type: "radio",
  //   onChange: onSelectChange,
  // };

  const columns: TableProps<ExpressItem>['columns'] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: true,
    },
    {
      title: "Expression",
      dataIndex: "express",
      key: "express",
      width: 200,
      sorter: true,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 200,
      sorter: true,
    },
  ];

  return (
      <div className="express-table">
        <div>
          <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
          />
          <Button type="primary" onClick={updateDataSource}>Search</Button>
          <Button onClick={() => setName("")}>Reset</Button>
        </div>
        <Table
            dataSource={dataSource}
            columns={columns}
            onChange={handleTableChange}
            //rowSelection={rowSelection}
            bordered
            //pagination={createPagination(total)}
        />
      </div>
  );
};

export default ExpressTable;
