import {Avatar, Dropdown, Space, Typography} from "antd";
import {CopyOutlined, DeleteOutlined, EllipsisOutlined, UserSwitchOutlined} from "@ant-design/icons";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {changeOwner, deleteReport} from "../../../Queries/reporting.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";

const {Text} = Typography;
export default function ReportExtra({report}) {
    const queryClient = useQueryClient();
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    const {mutate: changeOwnerMutation} = useMutation({
        mutationFn: () => changeOwner({reportId: report.id}),
        onSuccess: (newOwner) => {
            queryClient.setQueryData(["reports"], (oldData) => {
                return oldData.map((oldReport) => {
                    if (oldReport.id === report.id) {
                        report.owner = newOwner;
                    }
                    return oldReport;
                });
            });
        }
    });

    const {mutate: deleteReportMutation} = useMutation({
        mutationFn: () => deleteReport({reportId: report.id}),
        onSuccess: () => {
            queryClient.setQueryData(["reports"], (oldData) => {
                return oldData.filter((oldReport) => oldReport.id !== report.id);
            });
        }
    });

    return <Space size="middle" style={{height: "22px"}}>
        <Space size="small">
            <Text>Owner:</Text>
            <Avatar size={22}
                    src="https://files.monday.com/use1/photos/45249584/thumb/45249584-user_photo_initials_2023_07_03_12_47_49.png?1688388469"/>
            <Text style={{maxWidth: "5vw"}} ellipsis={{
                tooltip: true
            }}>{report.owner}</Text>
        </Space>
        <Dropdown onClick={(e) => e.stopPropagation()}
                  menu={{
                      items: [
                          {
                              key: "take_ownership",
                              icon: <UserSwitchOutlined/>,
                              label: <Text>Take ownership</Text>,
                              disabled: report.owner === context.user.id,
                              onClick: ({domEvent: e}) => {
                                  e.stopPropagation();
                                  changeOwnerMutation();
                              }
                          },
                          {
                              key: "clone",
                              icon: <CopyOutlined/>,
                              label: <Text>Duplicate</Text>,
                              onClick: ({domEvent: e}) => {
                                  e.stopPropagation();
                              }
                          },
                          {
                              key: "delete",
                              icon: <DeleteOutlined/>,
                              label: <Text>Delete</Text>,
                              onClick: ({domEvent: e}) => {
                                  e.stopPropagation();
                                  deleteReportMutation();
                              }
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