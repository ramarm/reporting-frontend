import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Avatar, Button, Select, Space, Typography} from "antd";
import {useRef, useState} from "react";
import useOutsideClick from "./SpotnikEditor/Plugins/Toolbar/ClickOutsideHook.js";
import InsightsLogo from "../../insights.svg";

const {Text} = Typography;

const FUNCTIONS = [
    {
        value: "SUM",
        label: "Sum of column"
    },
    {
        value: "AVERAGE",
        label: "Average of column"
    },
    {
        value: "MAX",
        label: "Maximum of column"
    },
    {
        value: "MIN",
        label: "Minimum of column"
    },
    {
        value: "COUNT_ITEMS",
        label: "Count items"
    },
    {
        value: "COUNT_CREATED",
        label: "Count created items"
    },
    {
        value: "COUNT_CHANGED",
        label: "Count changed items"
    }
]

export default function InsightsPlugin() {
    const [editor] = useLexicalComposerContext();
    const ref = useRef();
    const [visible, setVisible] = useState(false);

    useOutsideClick(ref, () => {
        console.log("here");
        handleCancel();
    });

    function handleCancel() {
        setVisible(false);
    }

    function insertInsights() {
        console.log("Insert insights")
        // editor.update(() => {
        //     const selection = $getSelection();
        //     const hasElementNode = selection.getNodes().map(getClosestElementNode).some((node) => node);
        //     const nodesToInsert = [];
        //     if (!hasElementNode) {
        //         nodesToInsert.push($createDivParagraphNode());
        //     }
        //     nodesToInsert.push($createImageNode({
        //         src: imageUrl,
        //         width: width,
        //         height: height
        //     }));
        //     $insertNodes(nodesToInsert);
        // });
        handleCancel();
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
                    <Select placeholder="Select an insight"
                            suffixIcon={null}
                            variant="borderless"
                            options={FUNCTIONS}
                            onMouseDown={(e) => e.preventDefault()}
                    />
                </div>
            )}
        </div>
    )
}