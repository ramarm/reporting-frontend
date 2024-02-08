import {CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, REDO_COMMAND, UNDO_COMMAND, } from "lexical";
import {useEffect, useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {mergeRegister} from "@lexical/utils";
import {Button, Space} from "antd";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {RedoOutlined, UndoOutlined} from "@ant-design/icons";


export default function UndoRedoPlugin() {
    const [editor] = useLexicalComposerContext()
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const options = [
        {
            tooltip: "Undo",
            icon: <UndoOutlined />,
            command: UNDO_COMMAND,
            disabled: !canUndo
        },
        {
            tooltip: "Redo",
            icon: <RedoOutlined />,
            command: REDO_COMMAND,
            disabled: !canRedo
        }
    ]

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            )
        );
    });

    return (
        <Space>
            <HistoryPlugin/>
            {options.map((option, index) => {
                return (
                    <Button key={index} className="toolbar-button"
                            type="text"
                            icon={option.icon}
                            disabled={option.disabled || !editor.isEditable()}
                            onClick={() => {
                                editor.dispatchCommand(option.command, undefined);
                            }}/>
                )
            })}
        </Space>
    )
}