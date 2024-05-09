import React, { useState, useEffect } from "react";
import { Input,message } from "antd";

/**
 *基本设置
 */
export default function BaseConfig(props: any) {
  const [baseInfo, setBaseInfo] = useState({});

  // 读取已有配置
  useEffect(() => {

  }, []);

  // 改变配置信息
  const baseInfoChange = (value: string, key: string) => {
    setBaseInfo({ ...baseInfo, [key]: value });
    const attrObj = Object.create(null);
    attrObj[key] = value;
    switch (key) {
      case "id":

        break;
      case "name":

        break;
      case "documentation":
        break;
    }
  };

  return (
    <div className="base-form">
      <div>
        <span>ID</span>
        <Input
          value="dummyId"
          onChange={(e) => baseInfoChange(e.target.value, "id")}
        />
      </div>
      <div>
        <span>Name</span>
        <Input
          value="dummyName"
          onChange={(e) => baseInfoChange(e.target.value, "name")}
        />
      </div>

    </div>
  );
}
