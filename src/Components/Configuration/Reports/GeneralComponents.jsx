import {Avatar, Space, Typography} from "antd";

const {Text} = Typography;

export function renderOption({picture, name}) {
    const nameInitials = name.split(" ").map((word) => word[0]).join("");
    return <Space size={4}>
        {picture ? <Avatar size={20} src={picture}/> : <Avatar size={20}>{nameInitials}</Avatar>}
        <Text>{name}</Text>
    </Space>
}