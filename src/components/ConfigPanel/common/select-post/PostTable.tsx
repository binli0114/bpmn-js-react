import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { getPostList } from "../../../services";
import { pagination } from "../../../utils";
import {PositionListResponse, Position} from "../../../bpmnComponentTypes";

interface positionDataType extends Position{
  "key":string,
}
export default function PostTable(props: {
  setSelectPost: any;
  selectPost?: any[];
}) {
  const [dataSource, setDataSource] = useState<positionDataType[]>([]);
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const { setSelectPost, selectPost = [] } = props;

  // 监听查询条件变化查询数据
  useEffect(() => {
    updateDataSource();
  }, [pageNo, pageSize, orderBy]);

  // 更新列表数据源
  function updateDataSource() {
    const param = {
      name,
      code,
      pageNo,
      pageSize,
      orderBy,
    };
    getPostList().then((data:PositionListResponse) => {
      const { list, count }: PositionListResponse = data;
      setDataSource(
        list.map((item:Position) => ({ ...item, key: item.id }))
      );
      setTotal(count);
    });
  }

  // 监听选择行
  const onSelectChange = (selectedRowKeys: any) => {
    const list: positionDataType[] = [];
    for (const id of selectedRowKeys) {
      const arr = dataSource.filter((item) => item.id === id);
      if (arr.length) {
        list.push(arr[0]);
      }
    }

    //不在dataSource,但是在上次的选中行(selectUser)里的加到list里
    for (const user of selectPost) {
      if (!dataSource.filter((item:positionDataType) => item.id === user.id).length) {
        list.push(user);
      }
    }
    setSelectPost(list);
  };

  const rowSelection = {
    selectedRowKeys: selectPost.map((item) => item.id),
    onChange: onSelectChange,
  };

  // 监听表格页码或排序变化
  //todo: the handleTableChange signature doesn't align with `onChange`
  //come back to review and fix it
  function handleTableChange(
    pagination: {
      pageSize: number;
      current: number;
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
    setCode("");
  }

  const columns = [
    {
      title: "岗位名称",
      dataIndex: "name",
      key: "name",
      width: 258,
      sorter: true,
    },
    {
      title: "岗位编码",
      dataIndex: "code",
      key: "code",
      width: 258,
      sorter: true,
    },
  ];
  return (
    <div className="user-table">
      <div>
        <Input
          placeholder="岗位名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="岗位编码"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
        // onChange={handleTableChange}
        // pagination={pagination(total)}
      />
    </div>
  );
}
