import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { getRoleList } from "../../../services";
import { pagination } from "../../../utils";
import {Role, RoleListResponse} from "../../../bpmnComponentTypes";

interface RoleDataRecordType extends Role{
  "key":string,
}
export default function RoleTable(props: {
  setSelectRole: any;
  selectRole?: any[] ;
}) {
  const [dataSource, setDataSource] = useState<RoleDataRecordType[]>([]);
  const [name, setName] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const { setSelectRole, selectRole = [] } = props;

  // 监听查询条件变化查询数据
  useEffect(() => {
    updateDataSource();
  }, [pageNo, pageSize, orderBy]);

  // 更新列表数据源
  function updateDataSource() {
    getRoleList().then((data:RoleListResponse) => {
      const { list, count }:RoleListResponse = data;
      setDataSource(
        list.map((item: Role) => ({ ...item, key: item.id }))
      );
      setTotal(count);
    });
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys: any) => {
    const list: RoleDataRecordType[] = [];
    for (const id of selectedRowKeys) {
      const arr = dataSource.filter((item:RoleDataRecordType) => item.id === id);
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
  //todo: the handleTableChange signature doesn't align with `onChange`
  //come back to review and fix it
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
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 258,
      sorter: true,
    }
  ];
  return (
    <div className="user-table">
      <div>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button type="primary" onClick={updateDataSource}>
          Search
        </Button>
        <Button onClick={onReset}>Reset</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowSelection={rowSelection}
        // onChange={handleTableChange}
        // pagination={pagination(total)}
      />
    </div>
  );
}
