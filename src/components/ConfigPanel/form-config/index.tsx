import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Radio, Divider, Button, Modal, Input, Checkbox } from "antd";
import { updateElementExtensions } from "../../utils";
import AddForm from "./AddForm";
import FormTable from "./FormTable";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {BpmnInstance, FieldItem, FormDataItem} from "../../bpmnComponentTypes";


interface ExtensionElement {
  $type: string;
  readable?: string;
  writable?: string;
}




interface Props {
  bpmnInstance: BpmnInstance;
}

/**
 * 表单设置
 */
const FormConfig: React.FC<Props> = ({ bpmnInstance }) => {
  const { bpmnElement = {}, modeling } = bpmnInstance;
  const [formType, setFormType] = useState<string>("1");
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [formProperty, setFormProperty] = useState<FormDataItem[]>([]);
  const [eventListener, setEventListener] = useState<ExtensionElement[]>([]);
  const [selectForm, setSelectForm] = useState<FormDataItem|null>();
  const [extFormUrl, setExtFormUrl] = useState<string>("");
  const [extFormReadable, setExtFormReadable] = useState<boolean>(false);

  const formRef = useRef<any>(null);
  const [formList,setFormList] = useState<FormDataItem[]>([]);


  // 读取表单数据
  useEffect(() => {
    const busObj = bpmnElement.businessObject;
    if (busObj) {
      const { formKey, $attrs = {}, formType, formReadOnly } = busObj;
      if (formType) {
        setFormType(formType.toString() === "2" ? "2" : "1");

        // Reading external form properties
        setExtFormUrl($attrs["flowable:outFormKey"] || "");
        setExtFormReadable(!!formReadOnly);

        // Reading dynamic form properties
        const listeners: ExtensionElement[] = [];
        const properties = (busObj.extensionElements?.values || []).filter((ex: ExtensionElement) => {
          if (ex.$type.includes("FormProperty")) {
            return true;
          } else {
            listeners.push(ex);
            return false;
          }
        }).map((item: any) => ({
          ...item,
          readable: item.readable === "true",
          writable: item.writable === "true"
        }));

        setEventListener(listeners);
        setFormProperty(properties);
        setSelectForm({
          id: formKey || "",
          name: $attrs["flowable:formName"] || "",
          version: $attrs["flowable:formVersion"] || "",
          fields: properties,
        });
      } else {
        // Resetting all properties when there's no formType
        setFormType("1");
        setEventListener([]);
        setFormProperty([]);
        setSelectForm(null);
        setExtFormUrl("");
        setExtFormReadable(false);
      }
    }
  }, [bpmnElement.businessObject]);

  // 保存表单
  const handAddModalOk = () => {
    // @ts-ignore
    formRef?.current?.validateFields()
      .then((values:any) => {
        const form = formList.filter((item:FormDataItem) => item.id === values.id)[0];

        // 更新列表
        setSelectForm(form);

        //更新bpmn数据
        modeling.updateProperties(bpmnElement, {
          "flowable:formKey": form.id,
          "flowable:formType": form.type,
          "flowable:formName": form.name,
          "flowable:formVersion": form.version,
        });

        // 更新扩展属性
        const property = [];
        for (const field of form.fields||[]) {
          property.push(
            bpmnInstance.moddle.create("flowable:FormProperty", field)
          );
        }
        setFormProperty(property);
        updateElementExtensions([...property, ...eventListener], bpmnInstance);

        setAddModalVisible(false);
      })
      .catch((error:any) => {
        console.log(error);
      });
  };

  // 改变表单字段的可读/可写属性
  function onChangeProperty(value: string, key: string, record: FieldItem, index: number): void {
    if (selectForm && selectForm.fields) {
      // Safely check if fields and index are valid
      if (selectForm.fields[index] && key in selectForm.fields[index]) {
        selectForm.fields[index][key] = value;
        setSelectForm({ ...selectForm }); // Using spread operator to trigger update correctly

        // Update bpmn data
        const updatedFormProperty = formProperty.map((item) => {
          if (item.id === record.id) {
            return { ...item, [key]: value }; // Ensure immutability
          }
          return item;
        });

        setFormProperty(updatedFormProperty);
        updateElementExtensions([...updatedFormProperty, ...eventListener], bpmnInstance);
      }
    }
  }
  // 删除表单
  function handDeleteModalOk() {
    // 删除列表
    setSelectForm(null);
    setDeleteModalVisible(false);

    // 删除bpmn数据
    modeling.updateProperties(bpmnElement, {
      "flowable:formKey": null,
      "flowable:formType": "",
      "flowable:formName": "",
      "flowable:formVersion": "",
    });
    //删除扩展属性
    setFormProperty([]);
    updateElementExtensions([...eventListener], bpmnInstance);
  }

  // 设置外部表单地址
  function onChangeExtUrl(e:any) {
    const value = e.target.value;
    setExtFormUrl(value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formType": 2,
      "flowable:outFormKey": value,
    });
  }

  // 设置外部表单只读
  function onChangeExtReadable(e:any) {
    const value = e.target.checked;
    setExtFormReadable(value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formReadOnly": value,
    });
  }

  // 改变表单类型
  function changeFormType(e:any) {
    setFormType(e.target.value);
    modeling.updateProperties(bpmnElement, {
      "flowable:formType": e.target.value,
    });
  }

  return (
    <>
      <Radio.Group onChange={changeFormType} value={formType}>
        <Radio value="1">Dynamic Form</Radio>
        <Radio value="2">Third party Form</Radio>
      </Radio.Group>
      <Divider />
      {formType.toString() === "1" && (
        <>
          <div className="config-btn">
            <Button
              type="primary"
              onClick={() => setAddModalVisible(true)}
              disabled={!selectForm?.id} // Using optional chaining to safely access `id`
            >
              Add
            </Button>
            <Button
              type="primary"
              onClick={() => setAddModalVisible(true)}
              disabled={!selectForm?.id} // Assuming you meant to disable if there is no id
            >
              Edit
            </Button>
            <Button
              type="primary"
              onClick={() => setDeleteModalVisible(true)}
              disabled={!selectForm?.id} // Disables if there's no id, ensuring there is something to delete
            >
              Remove
            </Button>
          </div>
          <FormTable
            data={selectForm?.id ? [selectForm] : []}
            onChangeProperty={onChangeProperty}
          />
        </>
      )}
      {formType.toString() === "2" && (
        <div className="base-form">
          <div>
            <span>Form URL</span>
            <Input value={extFormUrl} onChange={onChangeExtUrl} />
          </div>
          <div>
            <span style={{ marginLeft: -16 }}>ReadOnly</span>
            <Checkbox
              onChange={onChangeExtReadable}
              checked={extFormReadable}
              style={{ lineHeight: "32px" }}
            >
              Check this box to prevent form modification.
            </Checkbox>
          </div>
        </div>
      )}
      <Modal
        title="Select a Dynamic Form"
        open={addModalVisible}
        onOk={handAddModalOk}
        onCancel={() => setAddModalVisible(false)}
        destroyOnClose
      >
        <AddForm
            ref={formRef}
            setFormList={(newList) => setFormList(newList)}  // Ensure newList adheres to FormDataItem[]
            selectForm={selectForm ? selectForm : undefined}  // Ensure selectForm is of type FormDataItem or undefined
        />
      </Modal>
      <Modal
        title="Warning"
        open={deleteModalVisible}
        onOk={handDeleteModalOk}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <ExclamationCircleFilled />
        Are you sure to remove the form？
      </Modal>
    </>
  );
}

export default FormConfig;
