import React from "react";
import {Flex} from "monday-ui-react-core";
import "./Toolbar.css";


export default function ToolbarPlugin({toolbarPlugins}) {
    return <Flex gap={Flex.gaps.XS} id="toolbar-container">
        {toolbarPlugins.map((plugin, index) => {
            return (React.cloneElement(plugin, {key: index}))
        })}
    </Flex>
}

