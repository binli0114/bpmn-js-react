import { ElementRef, useRef, useState } from "react";
import "./App.css";
import BpmnJsReact, { BpmnJsReactHandle } from "./lib/BpmnJsReact";
import { defaultBpmnXml } from "./utils/bpmn.utils";

// import { Stack, ActionIcon, MantineProvider, Button } from "@mantine/core";
// import { IconZoomIn, IconZoomOut } from "@tabler/icons";

function App() {

  const ref = useRef<BpmnJsReactHandle>(null);

  return (
    <div className="App">
      <BpmnJsReact mode="edit" ref={ref}></BpmnJsReact>
      <button
        onClick={() => {
          console.log(
            ref.current?.saveXml((err: any, xml: string) => console.log(xml))
          );
        }}
      >
        save
      </button>
      <br />

      <BpmnJsReact xml={defaultBpmnXml} zoomActions={false}></BpmnJsReact>
    </div>
  );
}

export default App;
