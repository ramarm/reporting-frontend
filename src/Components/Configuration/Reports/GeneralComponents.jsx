import {Avatar, Col, Row, Space, Typography} from "antd";

const {Text} = Typography;

export function renderOption({picture, name, extra}) {
    const nameInitials = name.split(" ").map((word) => word[0]).join("");
    return <Row>
        <Col flex={"auto"}>
            <Space size={4}>
                {picture ? <Avatar size={20} src={picture}/> : <Avatar size={20}>{nameInitials}</Avatar>}
                <Text>{name}</Text>
            </Space>
        </Col>
        <Col>
            {extra}
        </Col>
    </Row>
}