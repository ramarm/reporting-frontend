import React from "react";
import {Flex} from "monday-ui-react-core";
import "./Toolbar.css";


export default function ToolbarPlugin({toolbarPlugins, containerSelector}) {
    return <Flex gap={Flex.gaps.XS} id="toolbar-container" wrap={true} style={{
        position: "sticky",
        top: 0,
        backgroundColor: "white"
    }}>
        {toolbarPlugins.map((plugin, index) => {
            return (React.cloneElement(plugin, {key: index, containerSelector: containerSelector}))
        })}
    </Flex>
}

