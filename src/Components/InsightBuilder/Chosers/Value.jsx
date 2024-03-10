import {Text, List, ListItem, DialogContentContainer, Loader} from 'monday-ui-react-core';
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns, getBoardUsers} from "../../../Queries/monday.js";
import {useEffect, useState} from "react";

export default function ValueCombobox({setHover, value, setValue, selectedColumnId}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [options, setOptions] = useState([]);

    const {data: column, isLoading: isLoadingColumn} = useQuery({
        queryKey: ["column", selectedColumnId],
        queryFn: () => getBoardColumns({boardId, columnIds: [selectedColumnId]}),
        enabled: !!selectedColumnId
    });

    const {data: subscribers, isLoading: isLoadingSubscribers} = useQuery({
        queryKey: ["subscribers", boardId],
        queryFn: () => getBoardUsers({boardId})
    });

    useEffect(() => {
        if (column?.length > 0 && subscribers) {
            const tempOptions = [{label: "anything", value: "__ANYTHING__"}];
            const columnType = column[0].type;
            if (columnType === "people") {
                tempOptions.push(...subscribers.map((subscriber) => ({
                    label: subscriber.name,
                    value: subscriber.id
                })));
            }
            if (columnType === "status") {
                const columnSettings = JSON.parse(column[0].settings_str);
                Object.keys(columnSettings.labels).forEach((key) => {
                    const index = Number(key);
                    let label = columnSettings?.labels[index];
                    if (label === "") {
                        if (index === 5) {
                            label = "(Default)";
                        } else {
                            return;
                        }
                    }
                    tempOptions.push({label: label, value: index});
                });
                if (!Object.keys(columnSettings.labels).includes("5")) {
                    tempOptions.push({label: "(Default)", value: 5});
                }
            }
            setOptions(tempOptions);
        }
    }, [column, subscribers]);

    function isLoading() {
        return isLoadingColumn || isLoadingSubscribers;
    }

    function onClick(value) {
        setValue(value);
    }

    return <DialogContentContainer>
        {!selectedColumnId
            ? <Text type={Text.types.TEXT2} style={{padding: "5px 15px"}}>Select column first</Text>
            : isLoading()
                ? <Loader size={Loader.sizes.SMALL}/>
                : <List className="insight-list" component={List.components.DIV}>
                    {options.map((option) => {
                        return <ListItem key={option.value}
                                         className="insight-list-item"
                                         onHover={() => setHover(option.label)}
                                         onClick={() => onClick(option)}
                                         selected={value?.value === option.value}>
                            {option.label}
                        </ListItem>
                    })}
                </List>}
    </DialogContentContainer>
}