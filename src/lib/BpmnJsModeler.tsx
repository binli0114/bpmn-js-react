import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// import BpmnJSModeler from "bpmn-js/dist/bpmn-modeler.production.min.js";
//@ts-ignore
import BpmnModeler, { BpmnModeler as IBpmnModeler } from "bpmn-js/lib/Modeler";

import { defaultBpmnXml } from "../utils/bpmn.utils";
import ZoomActions from "../components/ZoomActions";
import {
  BpmnJsReactHandle,
  BpmnJsReactProps,
} from "../interfaces/bpmnJsReact.interface";
import ConfigPanel from "../components/ConfigPanel";

const BpmnJsModeler: ForwardRefRenderFunction<
  BpmnJsReactHandle,
  BpmnJsReactProps
> = (
  {
    useBpmnJsReact,
    xml = defaultBpmnXml,
    height = 500,
    zoomActions = true,
    onLoading = () => {},
    onError = () => {},
    onShown = () => {},
    click = () => {},
    dbclick = () => {},
    ...props
  }: BpmnJsReactProps,
  ref
) => {
  const containerRef = useRef(null);
  const [bpmnEditor, setBpmnEditor] =
    useState<ReturnType<typeof IBpmnModeler>>(null);
  const [selectedElement, setSelectedElement] = useState();
  useEffect(() => {
    const container: any = containerRef.current;
    const newModeler = new BpmnModeler({ container });
    useBpmnJsReact?.setBpmnModeler(newModeler);
    setBpmnEditor(newModeler);

    return () => bpmnEditor?.destroy();
  }, []);

  useEffect(() => {
    bpmnEditor?.importXML(xml);

    bpmnEditor?.on("import.done", (event: any) => {
      const { error, warning } = event;

      if (error) {
        return onError(error);
      }

      zoomFit();

      onShown(warning);
    });

    // bpmnEditor?.on("element.click", onClick);
    // Define the function

    bpmnEditor?.on("element.click", (e: any) => {
      setSelectedElement(e.element);
      console.log("🚀element:", e.element);
      click(e);
      // getConvas().addMarker(e.element.id, "test");
    });
  }, [bpmnEditor, xml]);

  const getConvas = () => {
    return bpmnEditor?.get("canvas");
  };

  useImperativeHandle(
    ref,
    () => ({
      saveXml(result: any, options = { format: false }) {
        bpmnEditor.saveXML(options, result);
      },
      async saveXmlAsync(result: any, options = { format: false }) {
        return await bpmnEditor.saveXML(options, result);
      },
      importXml(xml: string) {
        bpmnEditor?.importXML(xml);
      },
      getModeler() {
        return bpmnEditor;
      },
      getCanvas() {
        return bpmnEditor.get("canvas");
      },
      zoomIn(step = 0.1) {
        bpmnEditor.get("zoomScroll").stepZoom(step);
      },
      zoomOut(step = 0.1) {
        bpmnEditor.get("zoomScroll").stepZoom(-step);
      },
      zoomFit() {
        bpmnEditor.get("canvas").zoom("fit-viewport");
      },
      setColor(elements: any, color: any) {
        bpmnEditor.get("modeling").setColor(elements, color);
      },
      addMarker(id: string, cssClass: string) {
        bpmnEditor.get("canvas").addMarker(id, cssClass);
      },
      removeMarker(id: string, cssClass: string) {
        bpmnEditor.get("canvas").removeMarker(id, cssClass);
      },
    }),
    [bpmnEditor]
  );

  const zoomIn = () => {
    bpmnEditor.get("zoomScroll").stepZoom(0.1);
  };

  const zoomOut = () => {
    bpmnEditor.get("zoomScroll").stepZoom(-0.1);
  };

  const zoomFit = () => {
    bpmnEditor.get("canvas").zoom("fit-viewport");
  };

  // const saveXml = () => {
  //   alert("hi");
  // };

  // useEffect(() => {
  //   bpmnEditor?.importXML(xml);
  // }, [xml, bpmnEditor]);
  const updateElementName = (newName: string) => {
    if (selectedElement) {
      selectedElement.label = newName;
      setSelectedElement({ ...selectedElement });
    }
  };
  return (
    <>
      <div
        className="bpmn-wrapper"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <div
          className="bpmn-js-react-editor-container"
          ref={containerRef}
          style={{ height, width: "800" }}
        ></div>
        <ConfigPanel
          element={selectedElement}
          updateElementName={updateElementName}
        />
        <div className="actions-wrapper">
          {zoomActions && (
            <ZoomActions
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              zoomFit={zoomFit}
            ></ZoomActions>
          )}
        </div>
      </div>
    </>
  );
};

export default forwardRef(BpmnJsModeler);
