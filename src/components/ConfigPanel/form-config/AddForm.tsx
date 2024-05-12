import React, { useState, useEffect, useImperativeHandle, forwardRef, ForwardedRef } from "react";
import { Form, Select } from "antd";
import { getFormList } from "../../services";
import {FieldItem, FormDataItem} from "../../bpmnComponentTypes";

const { Option } = Select;
const { useForm } = Form;


interface AddFormProps {
  selectForm: FormDataItem|undefined;
  setFormList: (formList: FormDataItem[]) => void;
}

const AddForm = forwardRef((props: AddFormProps, ref: ForwardedRef<any>) => {
  const { selectForm, setFormList } = props;
  const [form] = useForm();
  const [formList, setFormListState] = useState<FormDataItem[]>([]);

  useEffect(() => {
    getFormList().then((formList: FormDataItem[]) => {
      setFormListState(formList);
      setFormList(formList);
    });
  }, [setFormList]);

  useImperativeHandle(ref, () => ({
    validateFields: form.validateFields,
  }));

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
      <Form {...formItemLayout} form={form}>
        <Form.Item
            label="表单选择"
            name="id"
            rules={[{ required: true }]}
            initialValue={selectForm?.id ?? ""}
        >
          <Select>
            {formList.map((item: FormDataItem) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
  );
});

export default AddForm;
