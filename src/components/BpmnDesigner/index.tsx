import React, { useEffect, useState } from "react";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "./bpmn-designer.less";
import Modeler from "bpmn-js/lib/Modeler";
import { defaultBpmnXml }  from "../../utils/bpmn.utils";
import flowableModdleDescriptor from "./flow.json";


export default function index(props:any) {
    const { xml, type, modelId } = props;
    const [bpmnInstance, setBpmnInstance] = useState({});

    //an async function to read file content from diagramXML;
    const readXmlFile = async (filename:string)=>{
        try {
            return await readFile(filename, "utf8");
        } catch (err) {
            console.error(`Error reading file from disk: ${err}`);
        }
    }

    useEffect(() => {
        const bpmnModeler = new Modeler({
            container: "#flowCanvas",
            moddleExtensions: {
                flowable: flowableModdleDescriptor, //添加flowable前缀
            },
        });


        // 注册bpmn实例
        const instance = {
            modeler: bpmnModeler,
            modeling: bpmnModeler.get("modeling"),
            moddle: bpmnModeler.get("moddle"),
            eventBus: bpmnModeler.get("eventBus"),
            bpmnFactory: bpmnModeler.get("bpmnFactory"),
            elementRegistry: bpmnModeler.get("elementRegistry"),
            replace: bpmnModeler.get("replace"),
            selection: bpmnModeler.get("selection"),
        };

        setBpmnInstance(instance);
        getActiveElement(instance);

        bpmnModeler.importXML(defaultBpmnXml);

        // 修改节点hover时的背景色
        const container: Element = document.getElementsByClassName("djs-container")[0];
        container.style.setProperty(
            "--shape-drop-allowed-fill-color",
            "transparent"
        );


    }, []);

    function getActiveElement(instance:any) {
        const { modeler } = instance;
        // 初始第一个选中元素 bpmn:Process
        initFormOnChanged(null, instance);
        modeler.on("import.done", (e:any) => {
            initFormOnChanged(null, instance);
        });
        // 监听选择事件，修改当前激活的元素以及表单
        modeler.on("selection.changed", ({ newSelection }: { newSelection: any[] }) => {
            initFormOnChanged(newSelection[0] || null, instance);
        });
    }

    function initFormOnChanged(element:any, instance:any) {
        let activatedElement = element;
        const elementRegistry = instance.modeler.get("elementRegistry");
        if (!activatedElement) {
            activatedElement =
                elementRegistry.find((el:any) => el.type === "bpmn:Process") ||
                elementRegistry.find((el:any) => el.type === "bpmn:Collaboration");
        }
        if (!activatedElement) return;
        // console.log(`
        //           ----------
        //   select element changed:
        //             id:  ${activatedElement.id}
        //           type:  ${activatedElement.businessObject.$type}
        //           ----------
        //           `);
        console.log("businessObject: ", activatedElement.businessObject);
        setBpmnInstance({ bpmnElement: activatedElement, ...instance });
    }

    return (
        <div className="bpmn-designer">
            <div>
                <div id="flowCanvas" className="flow-canvas"></div>
            </div>

        </div>
    );
}
