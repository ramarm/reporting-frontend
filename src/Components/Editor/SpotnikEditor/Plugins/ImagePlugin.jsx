import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Button, Input, InputNumber, Space, Tabs, Tooltip, Upload} from "antd";
import {useRef, useState} from "react";
import useOutsideClick from "./Toolbar/ClickOutsideHook";
import {$getSelection, $insertNodes} from "lexical";
import {BiImageAdd} from "react-icons/bi";
import {$createImageNode} from "../Nodes/ImageNode.jsx";
import {InfoCircleTwoTone, UploadOutlined} from "@ant-design/icons";
import {getClosestElementNode} from "./KeyboardPlugin";
import {$createDivParagraphNode} from "../Nodes/DivParagraphNode.jsx";
import {v4 as uuid} from "uuid";

function UrlTab({setImageUrl}) {
    return (
        <Input placeholder="Public url"
               onChange={(e) => setImageUrl(e.target.value)}/>
    )
}

function UploadTab({setImageUrl, uploadImage}) {
    async function makeCustomRequest({file, onSuccess}) {
        const res = await uploadImage({file})
        setImageUrl(res)
        onSuccess()
    }

    return (
        <Upload customRequest={makeCustomRequest}
                accept={".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp"}>
            <Button icon={<UploadOutlined/>}>Upload photo</Button>
        </Upload>
    )
}

export default function ImagePlugin() {
    const [editor] = useLexicalComposerContext()
    const ref = useRef();
    const [visible, setVisible] = useState(false)
    const [imageUrl, setImageUrl] = useState(null);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    const tabs = [
        {
            key: "upload",
            label: "Upload",
            children: <UploadTab setImageUrl={setImageUrl} uploadImage={uploadImage}/>
        },
        {
            key: "url",
            label: "From the internet",
            children: <UrlTab setImageUrl={setImageUrl}/>
        }
    ]

    useOutsideClick(ref, () => {
        handleCancel();
    });

    function handleCancel() {
        setVisible(false);
        setImageUrl(null);
        setWidth(null);
        setHeight(null);
    }

    async function uploadImage({file}) {
        const fileKey = encodeURIComponent(`${uuid()}-${file.name}`);
        const url = `https://storage.googleapis.com/upload/storage/v1/b/${import.meta.env.VITE_PHOTOS_BUCKET}/o?uploadType=media&name=${fileKey}`;

        const response = await fetch(url, {
            method: "POST",
            body: file,
            headers: {
                "Content-Type": file.type
            }
        });
        if (response.status === 200) {
            return `https://storage.googleapis.com/${import.meta.env.VITE_PHOTOS_BUCKET}/${fileKey}`;
        } else {
            return false;
        }
    }

    function insertImage() {
        editor.update(() => {
            const selection = $getSelection();
            const hasElementNode = selection.getNodes().map(getClosestElementNode).some((node) => node);
            const nodesToInsert = [];
            if (!hasElementNode) {
                nodesToInsert.push($createDivParagraphNode());
            }
            nodesToInsert.push($createImageNode({
                src: imageUrl,
                width: width,
                height: height
            }));
            $insertNodes(nodesToInsert);
        });
        handleCancel();
    }

    return (
        <div ref={ref}>
            <Tooltip title="Insert image" placement="bottom">
                <Button className={"toolbar-button"}
                        type="text"
                        disabled={!editor.isEditable()}
                        icon={<BiImageAdd/>}
                        onClick={() => setVisible(!visible)}/>
            </Tooltip>
            {visible && (
                <div className="toolbar-float">
                    <Space direction="vertical">
                        <Tabs defaultActiveKey="upload"
                              items={tabs}/>
                        <Space>
                            <InputNumber placeholder="Width" min={1} onChange={setWidth}/>
                            <InputNumber placeholder="Height" min={1} onChange={setHeight}/>
                            <Tooltip title="We recommend setting only one of the ratio fields to save the image ratio">
                                <InfoCircleTwoTone/>
                            </Tooltip>
                        </Space>
                        <Space>
                            <Button type="primary"
                                    onClick={() => insertImage()}>
                                Insert
                            </Button>
                            <Button type="primary"
                                    onClick={handleCancel}
                                    danger>
                                Cancel
                            </Button>
                        </Space>
                    </Space>
                </div>
            )}
        </div>
    )
}