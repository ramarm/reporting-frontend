import React from "react";
import {Space} from "antd";
import "./Toolbar.css";


export default function ToolbarPlugin({toolbarPlugins}) {
    return (
        <Space id="toolbar-container">
            {toolbarPlugins.map((plugin, index) => {
                return (React.cloneElement(plugin, {key: index}))
            })}
        </Space>
    );
}

