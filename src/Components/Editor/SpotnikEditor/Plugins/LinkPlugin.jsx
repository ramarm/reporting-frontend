import {$getSelection, $isRangeSelection} from "lexical";
import {$isLinkNode, toggleLink} from "@lexical/link";
import {useRef, useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Button, Form, Input, Space} from "antd";
import {GoLink, GoUnlink} from "react-icons/go";
import useOutsideClick from "./Toolbar/ClickOutsideHook";


function isLinkNode(node) {
    if (Array.isArray(node)) {
        return node.map(isLinkNode).some((x) => x);
    }
    if (!node) {
        return false;
    }
    if ($isLinkNode(node)) {
        return true;
    }
    return isLinkNode(node.getParent())
}

export default function LinkPlugin() {
    const [editor] = useLexicalComposerContext()
    const [form] = Form.useForm();
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    const [isLink, setIsLink] = useState(false);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                setIsLink(isLinkNode(selection.getNodes()));
            }
        });
    })

    useOutsideClick(ref, () => {
        setVisible(false);
        form.resetFields();
    });

    function handleOpenButton() {
        if (visible) {
            form.resetFields();
        } else {
            const selectedText = getSelection().toString();
            form.setFieldValue("text", selectedText);
        }
        setVisible(!visible);
    }

    function handleLinkDelete() {
        editor.update(() => {
            toggleLink(null);
        });
    }

    function handleLinkInsert(values) {
        editor.update(() => {
            const selection = $getSelection();
            if (selection) {
                if ($isRangeSelection(selection)) {
                    if (values.text) {
                        selection.insertRawText(values.text);
                    } else {
                        selection.insertRawText(values.link);
                    }
                }
            }
            if ((!values.link.startsWith("http://") && !values.link.startsWith("https://"))) {
                values.link = "https://" + values.link;
            }
            toggleLink(values.link);
        });
        setVisible(false);
        form.resetFields();
    }


    return (
        <div ref={ref}>
            {isLink ? <Button className={"toolbar-button"}
                              type="text"
                              disabled={!editor.isEditable()}
                              icon={<GoUnlink/>}
                              onClick={handleLinkDelete}/>
                : <Button className={"toolbar-button"}
                          type="text"
                          disabled={!editor.isEditable()}
                          icon={<GoLink/>}
                          onClick={handleOpenButton}/>}
            {visible && (
                <div className="toolbar-float">
                    <Form form={form}
                          onFinish={handleLinkInsert}
                          requiredMark={false}>
                        <Form.Item name="link"
                                   label="Link"
                                   rules={[
                                       {
                                           required: true,
                                           message: "Link must be filled"
                                       }
                                   ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="text"
                                   label="Text">
                            <Input/>
                        </Form.Item>
                        <Space>
                            <Button type="primary"
                                    htmlType="submit">Insert</Button>
                            <Button type="primary"
                                    htmlType={"button"}
                                    onClick={handleOpenButton}
                                    danger>Cancel</Button>
                        </Space>
                    </Form>
                </div>
            )}
        </div>
    )
}