import SpotnikEditor from "./SpotnikEditor/Editor.jsx";
import ReportingPlugin from "./ReportingPlugin.jsx";
import UndoRedoPlugin from "./SpotnikEditor/Plugins/UndoRedoPlugin.jsx";
import {Divider} from "antd";
import FontsPlugin from "./SpotnikEditor/Plugins/FontPlugin.jsx";
import FontSizePlugin from "./SpotnikEditor/Plugins/FontSizePlugin.jsx";
import ColorPlugin from "./SpotnikEditor/Plugins/ColorPlugin.jsx";
import {FontColorsOutlined, HighlightOutlined} from "@ant-design/icons";
import StylePlugin from "./SpotnikEditor/Plugins/StylePlugin.jsx";
import DirectionPlugin from "./SpotnikEditor/Plugins/DirectionPlugin.jsx";
import AlignPlugin from "./SpotnikEditor/Plugins/AlignPlugin.jsx";
import BlockPlugin from "./SpotnikEditor/Plugins/BlockPlugin.jsx";
import ImagePlugin from "./SpotnikEditor/Plugins/ImagePlugin.jsx";
import EmojiPlugin from "./SpotnikEditor/Plugins/EmojiPlugin.jsx";
import InsightsPlugin from "./InsightsPlugin/InsightsPlugin.jsx";
import LinkPlugin from "./SpotnikEditor/Plugins/LinkPlugin.jsx";
import InsightsPlugin2 from "./InsightsPlugin2/InsightsPlugin.jsx";

export default function ReportingEditor({initialValue, disabled, onChange}) {
    const parser = new DOMParser();
    const initialDom = parser.parseFromString(initialValue, "text/html");

    return <SpotnikEditor initialDom={initialDom}
                          disabled={disabled}
                          innerEditor={<ReportingPlugin onChange={onChange} toolbarPlugins/>}
                          toolbarPlugins={[
                              <InsightsPlugin key="insights"/>,
                              <InsightsPlugin2 key="insights2"/>,
                              <UndoRedoPlugin key="undo-redo"/>,
                              <Divider key="div1" type={"vertical"}/>,
                              <FontsPlugin key="fonts"/>,
                              <FontSizePlugin key="font-size"/>,
                              <ColorPlugin key="font-color" buttonIcon={<FontColorsOutlined/>}
                                           targetStyle="color"/>,
                              <ColorPlugin key="highlight-color" buttonIcon={<HighlightOutlined/>}
                                           targetStyle="background-color"/>,
                              <Divider key="div2" type={"vertical"}/>,
                              <StylePlugin key="style"/>,
                              <Divider key="div3" type={"vertical"}/>,
                              <DirectionPlugin key="dir"/>,
                              <Divider key="div4" type={"vertical"}/>,
                              <AlignPlugin key="align"/>,
                              <Divider key="div5" type={"vertical"}/>,
                              <BlockPlugin key="block"/>,
                              <Divider key="div6" type={"vertical"}/>,
                              <LinkPlugin key="link"/>,
                              <ImagePlugin key="image"/>,
                              <EmojiPlugin key="emoji"/>
                          ]}
    />
}