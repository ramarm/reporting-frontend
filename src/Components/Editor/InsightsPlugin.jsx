import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Avatar, Button, Space, Typography} from "antd";
import {useRef, useState} from "react";
import useOutsideClick from "./SpotnikEditor/Plugins/Toolbar/ClickOutsideHook.js";
import InsightsLogo from "../../insights.svg";

const {Text} = Typography;

export default function InsightsPlugin() {
    const [editor] = useLexicalComposerContext();
    const ref = useRef();
    const [visible, setVisible] = useState(false);

    useOutsideClick(ref, () => {
        handleCancel();
    });

    function handleCancel() {
        setVisible(false);
    }


    return (
        <div ref={ref}>
            <Button className={"toolbar-button"}
                    type="primary"
                    onClick={() => {
                        if (editor.isEditable()) {
                            setVisible(!visible)
                        }
                    }}>
                <Space>
                    <Avatar shape="square" src={InsightsLogo} size={24}/>
                    <Text style={{color: "white"}}>Add Insight</Text>
                </Space>
            </Button>
            {visible && (
                <div className="toolbar-float" style={{textAlign: "left", minWidth: "500px"}}>
                    <h1>Here you will build your insight</h1>
                </div>
            )}
        </div>
    )
}