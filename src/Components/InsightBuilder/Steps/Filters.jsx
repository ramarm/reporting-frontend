import {Button, Flex, IconButton} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import {Add, Delete} from "monday-ui-react-core/icons";
import ColumnCombobox from "../Chosers/Column.jsx";
import ChooseDialog from "../Chosers/ChooseDialog.jsx";

function Filter({filter, updateFilter, addFilter, removeFilter, isFirst, isLast, isEdit}) {
    return <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.SMALL} wrap={true}>
        <Heading type={Heading.types.H4}>
            {isFirst ? "Where" : "And"}
        </Heading>
        <ChooseDialog value={filter.column}
                      setValue={(value) => updateFilter("column", value)}
                      placeholder="column"
                      component={ColumnCombobox}
                      childProps={{
                          extraColumns: [{title: "Group", id: "__GROUP__", type: "group"}],
                          columnTypes: ["status", "people", "date", "dropdown", "date"]
                      }}/>
        <Heading type={Heading.types.H4}>
            condition
        </Heading>
        <Heading type={Heading.types.H4}>
            value
        </Heading>
        {isEdit && <IconButton icon={Delete} onClick={removeFilter}/>}
        {isEdit && isLast && <IconButton icon={Add} onClick={addFilter}/>}
    </Flex>
}

export default function Filters({setInsight, filters, currentStep}) {
    const isEdit = currentStep.key === "filter";

    function updateFilter(index, key, value) {
        const newFilters = [...filters];
        newFilters[index][key] = value;
        setInsight("filters", newFilters);
    }

    function addFilter() {
        setInsight("filters", [...filters, {
            column: undefined,
            condition: undefined,
            value: undefined
        }]);
    }

    function removeFilter(index) {
        const newFilters = [...filters];
        newFilters.splice(index, 1);
        setInsight("filters", newFilters);
    }

    if (filters.length === 0 && isEdit) {
        return <Button leftIcon={Add}
                       kind={Button.kinds.TERTIARY}
                       onClick={addFilter}>Add filter</Button>;
    }

    return filters.map((filter, index) => <Filter key={index}
                                                  filter={filter}
                                                  updateFilter={(key, value) => updateFilter(index, key, value)}
                                                  addFilter={addFilter}
                                                  removeFilter={() => removeFilter(index)}
                                                  isFirst={index === 0}
                                                  isLast={index === filters.length - 1}
                                                  isEdit={isEdit}/>);
}