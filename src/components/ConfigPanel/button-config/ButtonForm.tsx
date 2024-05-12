import React, { forwardRef, useImperativeHandle } from "react";
import { Select, Form, Input, InputNumber, FormInstance } from "antd";

const { Option } = Select;
const { useForm } = Form;

interface ButtonFormProps {
    record: {
        name?: string;
        code?: string;
        sort?: number;
        isHide?: string;
    };
}

interface ButtonFormMethods {
    validateFields: () => Promise<any>;
}

/*
 * 添加按钮表单
 */
const ButtonForm = forwardRef<ButtonFormMethods, ButtonFormProps>(({ record }, ref) => {
    const [form] = useForm();

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
                label="Name"
                name="name"
                initialValue={record.name || ""}
                rules={[{ required: true, message: "Name can not be empty" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Code"
                name="code"
                initialValue={record.code || ""}
                rules={[{ required: true, message: "Code can not be empty" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Sort"
                name="sort"
                initialValue={record.sort || 0}
                rules={[{ required: true, message: "Sort can not be empty" }]}
            >
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item
                label="IsHidden"
                name="isHide"
                initialValue={record.isHide || "0"}
                rules={[{ required: true, message: "Is hidden field can not be empty" }]}
            >
                <Select>
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                </Select>
            </Form.Item>
        </Form>
    );
});

export default ButtonForm;
