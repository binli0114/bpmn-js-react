import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { getRoleList } from "../../../services";
import { pagination } from "../../../utils";

/*
 * 角色列表
 */
export default function RoleTable(props: {
  setSelectRole: any;
  selectRole?: never[] | undefined;
}) {
  const [dataSource, setDataSource] = useState([]);
  const [name, setName] = useState("");
  const [enname, setEnName] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [orderBy, setOrderBy] = useState("");
  const [total, setTotal] = useState(0);
  const { setSelectRole, selectRole = [] } = props;

  // 监听查询条件变化查询数据
  useEffect(() => {
    updateDataSource();
  }, [pageNo, pageSize, orderBy]);

  // 更新列表数据源
  function updateDataSource() {
    const param = {
      name,
      enname,
      pageNo,
      pageSize,
      orderBy,
    };
    getRoleList().then((data) => {
      const { list, count }:any = data;
      setDataSource(
        list.map((item: { id: any }) => ({ ...item, key: item.id }))
      );
      setTotal(count);
    });
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys: any) => {
    const list: never[] = [];
    for (const id of selectedRowKeys) {
      const arr = dataSource.filter((item) => item.id === id);
      if (arr.length) {
        list.push(arr[0]);
      }
    }

    //不在dataSource,但是在上次的选中行(selectUser)里的加到list里
    for (const user of selectRole) {
      if (!dataSource.filter((item) => item.id === user.id).length) {
        list.push(user);
      }
    }

    setSelectRole(list);
  };

  const rowSelection = {
    selectedRowKeys: selectRole.map((item) => item.id),
    onChange: onSelectChange,
  };

  // 监听表格页码或排序变化
  function handleTableChange(
    pagination: {
      pageSize: React.SetStateAction<number>;
      current: React.SetStateAction<number>;
    },
    filters: any,
    sorter: { field: string; order: string }
  ) {
    setPageSize(pagination.pageSize);
    setPageNo(pagination.current);
    setOrderBy(
      sorter.field && sorter.order ? sorter.field + " " + sorter.order : ""
    );
  }

  // 重置名称， 英文名查询条件
  function onReset() {
    setName("");
    setEnName("");
  }

  const columns = [
    {
      title: "名字",
      dataIndex: "name",
      key: "name",
      width: 258,
      sorter: true,
    },
    {
      title: "英文名",
      dataIndex: "enname",
      key: "enname",
      width: 258,
      sorter: true,
    },
  ];
  return (
    <div className="user-table">
      <div>
        <Input
          placeholder="名字"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="英文名"
          value={enname}
          onChange={(e) => setEnname(e.target.value)}
        />
        <Button type="primary" onClick={updateDataSource}>
          查询
        </Button>
        <Button onClick={onReset}>重置</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowSelection={rowSelection}
        onChange={handleTableChange}
        pagination={pagination(total)}
      />
    </div>
  );
}
