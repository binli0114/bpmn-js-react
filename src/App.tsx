import { useEffect, useState } from "react";
import "./App.css";

import BpmnJsReact from "./lib/BpmnJsReact";
import { useBpmnJsReact } from "./hooks/bpmn.hook";
import BpmnDesigner from "./components/BpmnDesigner";

import { Spin } from "antd";

function App() {
  const [data, setData] = useState<string>("");
  const [currentType, setCurrentType] = useState<string>("add");
  const [spinning, setSpinning] = useState<boolean>(true);
  const [elements, setElements] = useState<any>([]);

  const bpmnReactJs = useBpmnJsReact();
  useEffect(() => {
    if (currentType === "add") {
      setSpinning(false);
    } else {
      setData("");
      setSpinning(false);
    }
  }, []);
  return (
    <Spin spinning={spinning}>
      <div style={{ width: "100%", height: "92vh" }}>
        {/*<BpmnJsReact*/}
        {/*    mode="edit"*/}
        {/*    useBpmnJsReact={bpmnReactJs}*/}
        {/*    click={(e: any) => setElements([e.element])}*/}
        {/*></BpmnJsReact>*/}
        <BpmnDesigner xml={data} type={currentType} />
      </div>
    </Spin>
  );
}

export default App;
