import {Avatar, Dropdown, Space, Typography} from "antd";
import {CopyOutlined, DeleteOutlined, EllipsisOutlined, UserSwitchOutlined} from "@ant-design/icons";

const {Text} = Typography;
export default function ReportExtra({owner}) {
    return <Space size="middle" style={{height: "22px"}}>
        <Space size="small">
            <Text>Owner:</Text>
            <Avatar size={22}
                    src="https://files.monday.com/use1/photos/45249584/thumb/45249584-user_photo_initials_2023_07_03_12_47_49.png?1688388469"/>
            <Text style={{maxWidth: "5vw"}} ellipsis={{
                tooltip: true
            }}>{owner}</Text>
        </Space>
        <Dropdown menu={{
            items: [
                {
                    key: "take_ownership",
                    icon: <UserSwitchOutlined/>,
                    label: <Text>Take ownership</Text>
                },
                {
                    key: "clone",
                    icon: <CopyOutlined/>,
                    label: <Text>Duplicate</Text>
                },
                {
                    key: "delete",
                    icon: <DeleteOutlined/>,
                    label: <Text>Delete</Text>
                }
            ]
        }}>
            <EllipsisOutlined style={{
                fontSize: "26px",
                transform: "rotate(90deg)"
            }}/>
        </Dropdown>
    </Space>
}