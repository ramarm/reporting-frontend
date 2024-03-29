import {Text, List, ListItem, DialogContentContainer, Loader, Flex, Search} from 'monday-ui-react-core';
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns, getBoardUsers} from "../../../Queries/monday.js";
import {useEffect, useState} from "react";

export default function ValueCombobox({setHover, value, setValue, selectedColumn}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [options, setOptions] = useState([]);
    const [search, setSearch] = useState("")

    const {data: column, isLoading: isLoadingColumn} = useQuery({
        queryKey: ["column", selectedColumn?.value],
        queryFn: () => getBoardColumns({boardId, columnIds: [selectedColumn?.value]}),
        enabled: ["status", "dropdown"].includes(selectedColumn?.type)
    });

    const {data: subscribers, isLoading: isLoadingSubscribers} = useQuery({
        queryKey: ["subscribers", boardId],
        queryFn: () => getBoardUsers({boardId}),
        enabled: selectedColumn?.type === "people"
    });


    const optionsGeneratorMapping = {
        people: generatePeopleOptions,
        status: generateStatusOptions
    }

    function generatePeopleOptions() {
        return subscribers.map((subscriber) => ({
            label: subscriber.name,
            value: {id: subscriber.id},
        }));
    }

    function generateStatusOptions() {
        const tempOptions = [];
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
            tempOptions.push({
                label: label,
                value: {index: index}
            });
        });
        if (!Object.keys(columnSettings.labels).includes("5")) {
            tempOptions.push({label: "(Default)", value: {index: 5}});
        }
        return tempOptions;
    }

    useEffect(() => {
        if ((["status"].includes(selectedColumn?.type) && column)
            || (["people"].includes(selectedColumn?.type) && subscribers)) {
            const tempOptions = [{label: "Anything", value: "__ANYTHING__"}];
            setOptions(tempOptions.concat(optionsGeneratorMapping[selectedColumn.type]()));
        }
    }, [column, subscribers]);

    function isLoading() {
        return isLoadingColumn || isLoadingSubscribers;
    }

    function onClick(value) {
        setValue(value);
    }

    function generateList() {
        if (options.length === 0) {
            return <Text type={Text.types.TEXT1} style={{padding: "5px 15px"}}>No values</Text>;
        }

        return <Flex gap={Flex.gaps.XS} direction={Flex.directions.COLUMN}>
            <Search size={Search.sizes.SMALL}
                    placeholder="Search"
                    debounceRate={100}
                    value={search}
                    onChange={setSearch}/>
            <List className="insight-list" component={List.components.DIV} style={{width: 200}}>
                {options
                    .filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
                    .map((option) => {
                        return <ListItem key={option.label}
                                         className="insight-list-item"
                                         onHover={() => setHover(option.label)}
                                         onClick={() => onClick(option)}
                                         selected={value?.value === option.value}>
                            {option.label}
                        </ListItem>
                    })}
            </List>
        </Flex>
    }

    return <DialogContentContainer>
        {!selectedColumn
            ? <Text type={Text.types.TEXT1} style={{padding: "5px 15px"}}>Select column first</Text>
            : isLoading()
                ? <Loader size={Loader.sizes.SMALL}/>
                : generateList()}
    </DialogContentContainer>
}