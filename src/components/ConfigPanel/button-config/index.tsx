import React, { useState, useRef, useEffect, RefObject } from "react";
import { Button, Modal } from "antd";
import ButtonForm from "./ButtonForm";
import SelectButtonTable from "./SelectButtonTable";
import ButtonTable from "./ButtonTable";
import { updateElementExtensions } from "../../utils";
import {BpmnInstance, ButtonItem, FormDataItem} from "../../bpmnComponentTypes";


interface ExtensionValue {
    $type: string;
    id?: string;
    name?: string;
    code?: string;
    isHide?: string;
    next?: string;
}


interface ButtonConfigProps {
    bpmnInstance: BpmnInstance;
}

export default function ButtonConfig({ bpmnInstance }: ButtonConfigProps) {
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
    const [selectModalVisible, setSelectModalVisible] = useState<boolean>(false);
    const [otherList, setOtherList] = useState<ExtensionValue[]>([]);
    const [buttonList, setButtonList] = useState<ButtonItem[]>([]);
    const [buttonIndex, setButtonIndex] = useState<number>(-1);
    const [record, setRecord] = useState<ButtonItem | {}>({});
    const [selectedRow, setSelectedRow] = useState<ButtonItem[]>([]);
    const formRef: RefObject<any> = useRef(null);
    const { bpmnElement = {} } = bpmnInstance;

    useEffect(() => {
        if (bpmnElement.businessObject?.extensionElements) {
            const busObj = bpmnElement.businessObject;
            const other: ExtensionValue[] = [];
            const list = busObj.extensionElements?.values.filter((ex) => {
                if (ex.$type.includes("Button")) {
                    return true;
                }
                other.push(ex);
                return false;
            });
            setButtonList(list as ButtonItem[]);
            setOtherList(other);
        }
    }, [bpmnElement.businessObject]);

    // Delete button
    const deleteButton = (index: number): void => {
        const newButtonList = [...buttonList];
        newButtonList.splice(index, 1);
        setButtonList(newButtonList);
        updateElementExtensions([...newButtonList, ...otherList], bpmnInstance);
    };

    // Save button handler
    const handAddModalOk = async (): Promise<void> => {
        if (formRef.current) {
            try {
                const values = await formRef.current.validateFields();
                const object = bpmnInstance.moddle.create(`flowable:Button`, {
                    ...values,
                    next: "0",
                });
                const newList = [...buttonList];
                if (buttonIndex === -1) {
                    newList.push(object);
                } else {
                    newList.splice(buttonIndex, 1, object);
                }
                setButtonList(newList);
                updateElementExtensions([...newList, ...otherList], bpmnInstance);
                setAddModalVisible(false);
                setButtonIndex(-1);
                setRecord({});
                formRef.current.resetFields();
            } catch (error) {
                console.error('Failed to validate fields:', error);
            }
        }
    };

    // Select button handler
    const handSelectModalOk = (): void => {
        selectedRow.forEach(item => {
            if (!buttonList.some(btn => btn.id === item.id)) {
                const object = bpmnInstance.moddle.create("flowable:Button", {
                    ...item,
                    isHide: "0",
                    next: "0",
                });
                buttonList.push(object);
            }
        });
        setButtonList([...buttonList]);
        updateElementExtensions([...buttonList, ...otherList], bpmnInstance);
        setSelectModalVisible(false);
    };

    // Inject selected row data
    const selectButton = (selectedRow: ButtonItem[]): void => {
        setSelectedRow(selectedRow);
    };

    // Edit button form
    const editButton = (record: ButtonItem, index: number): void => {
        setAddModalVisible(true);
        setRecord(record);
        setButtonIndex(index);
    };

    const handAddModalCancel=()=>{
        setRecord({});
        setAddModalVisible(false);
    }

    return (
        <>
            <div className="config-btn">
                <Button
                    type="primary"
                    onClick={() => setSelectModalVisible(true)}
                    style={{ width: 80 }}
                >
                    Select Button
                </Button>
                <Button
                    type="primary"
                    onClick={() => setAddModalVisible(true)}
                    style={{ width: 80 }}
                >
                    Add Button
                </Button>
            </div>
            <ButtonTable
                editButton={editButton}
                buttonList={buttonList}
                deleteButton={deleteButton}
            />
            <Modal
                title="Select Button"
                open={selectModalVisible}
                onOk={handSelectModalOk}
                onCancel={() => setSelectModalVisible(false)}
                destroyOnClose
            >
                <SelectButtonTable
                    selectButton={selectButton}
                    buttonList={buttonList}
                />
            </Modal>
            <Modal
                title="Add Button"
                open={addModalVisible}
                onOk={handAddModalOk}
                onCancel={handAddModalCancel}
            >
                <ButtonForm ref={formRef} record={record as ButtonItem} key={Math.random() * 10} />
            </Modal>
        </>
    );
}
