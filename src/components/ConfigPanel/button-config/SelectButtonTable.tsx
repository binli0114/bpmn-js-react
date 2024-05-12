import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { pagination as createPagination } from "../../utils";
import { getButtonList } from "../../services";
import {ButtonItem} from "../../bpmnComponentTypes";


interface SelectButtonTableProps {
  selectButton: (selectedButtons: ButtonItem[]) => void;
  buttonList: ButtonItem[];
}

interface TableParams {
  pageSize: number;
  pageNo: number;
  listenerType?: number;
  orderBy?: string;
}

/*
 * 选择按钮列表
 */
const SelectButtonTable: React.FC<SelectButtonTableProps> = ({ selectButton, buttonList }) => {
  const [dataSource, setDataSource] = useState<ButtonItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    updateDataSource();
  }, []);

  useEffect(() => {
    const obj: { [key: string]: boolean } = {};
    for (const item of buttonList) {
      obj[item.id] = true;
    }
    setSelectedRowKeys(Object.keys(obj));
  }, [buttonList]);

  // 更新列表数据源
  function updateDataSource() {
    getButtonList().then((data) => {
      const { list, count } = data;
      setDataSource(
        list.map((item: { id: any }) => ({ ...item, key: item.id }))
      );
      setTotal(count);
    });
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys: string[]) => {
    const list = dataSource.filter(item => selectedRowKeys.includes(item.id));
    setSelectedRowKeys(selectedRowKeys);
    selectButton(list);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 监听表格页码或排序变化
  function handleTableChange(pagination: any, filters: any, sorter: any) {
    console.log(`pageSize: ${pagination.pageSize}`);
    console.log(`filter:${filters}`);
    console.log(`sort:${sorter}`);
    // const param: TableParams = {
    //   pageSize: pagination.pageSize,
    //   pageNo: pagination.current,
    //   orderBy: sorter.field && sorter.order ? `${sorter.field} ${sorter.order}` : "",
    // };
    updateDataSource();
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      sorter: true,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 100,
      sorter: true,
    },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "sort",
      width: 100,
      sorter: true,
    },
  ];

  return (
      <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          //rowSelection={rowSelection}
          onChange={handleTableChange}

      />
  );
};

export default SelectButtonTable;
