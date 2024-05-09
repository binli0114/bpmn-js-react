import React,{useState, useEffect} from "react";
import {CollapseProps, Flex, Input, Space} from 'antd';
import { Collapse } from 'antd';
const { Panel } = Collapse;
interface ConfigPanelProps {
    element: any;
    updateElementName: (newName: string) => void;
}
const ConfigPanel: React.FC<ConfigPanelProps> = ({ element,updateElementName }) => {
    const currentElement = element;
    const [items,setItems] = useState<CollapseProps['items']>([]);
    useEffect(() => {
        if(!currentElement) return;
        const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

        const items: CollapseProps['items'] = [
            {
                key: '1',
                label: 'Basic Information',
                children:
                <Space direction={"vertical"}>
                    <Space>ID<Input defaultValue={currentElement.id} /></Space>
                    <Space>Name<Input defaultValue={currentElement.businessObject.name} onChange={(e) => updateElementName(e.target.value)}/></Space>
                </Space>,

            },
            {
                key: '2',
                label: 'This is panel header 2',
                children: <p>{text}</p>,
            }
        ];
        setItems(items);
    }, [currentElement]);


    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    return <Collapse style={{width:400}} items={items} defaultActiveKey={['1']} onChange={onChange} />;
};

export default ConfigPanel;
