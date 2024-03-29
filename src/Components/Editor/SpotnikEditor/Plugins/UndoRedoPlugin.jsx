import {CAN_REDO_COMMAND, CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL, REDO_COMMAND, UNDO_COMMAND,} from "lexical";
import {useEffect, useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {mergeRegister} from "@lexical/utils";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {IconButton} from "monday-ui-react-core";
import {Undo, Redo} from "monday-ui-react-core/icons";


export default function UndoRedoPlugin() {
    const [editor] = useLexicalComposerContext()
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const options = [
        {
            tooltip: "Undo",
            icon: Undo,
            command: UNDO_COMMAND,
            disabled: !canUndo
        },
        {
            tooltip: "Redo",
            icon: Redo,
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

    return [
        <HistoryPlugin key="history-plugin"/>,
        ...options.map((option, index) => {
            return (
                <IconButton key={index} size={IconButton.sizes.SMALL}
                        icon={option.icon}
                        disabled={option.disabled || !editor.isEditable()}
                        onClick={() => {
                            editor.dispatchCommand(option.command, undefined);
                        }}/>
            )
        })
    ]
}