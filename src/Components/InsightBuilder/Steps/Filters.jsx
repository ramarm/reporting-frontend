import {Button, Flex, IconButton} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import {Add, Delete} from "monday-ui-react-core/icons";
import ColumnCombobox from "../Dropdowns/Column.jsx";
import ChooseDialog from "../Dropdowns/ChooseDialog.jsx";
import ConditionCombobox from "../Dropdowns/Condition.jsx";
import FilterValueCombobox from "../Dropdowns/FilterValue.jsx";
import {useState} from "react";
import {FUNCTIONS} from "../insightsFunctions.jsx";

function Filter({filter, updateFilter, addFilter, removeFilter, isFirst, isLast, isFilterStep}) {
    return <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.SMALL} wrap={true}>
        <Heading type={Heading.types.H1}
                 weight={Heading.weights.LIGHT}>
            {isFirst ? "Where" : "and"}
        </Heading>
        <ChooseDialog value={filter.column}
                      setValue={(value) => updateFilter("column", value)}
                      placeholder="column"
                      component={ColumnCombobox}
                      childProps={{
                          extraColumns: [{title: "Group", id: "__GROUP__", type: "group"}],
                          columnTypes: ["status", "people", "date", "dropdown", "date"]
                      }}/>
        <ChooseDialog value={filter.condition}
                      setValue={(value) => updateFilter("condition", value)}
                      placeholder="condition"
                      component={ConditionCombobox}
                      childProps={{
                          columnType: filter.column?.type
                      }}/>
        <ChooseDialog value={filter.value}
                      setValue={(value) => updateFilter("value", value)}
                      placeholder="value"
                      component={FilterValueCombobox}
                      childProps={{
                          selectedColumn: filter.column
                      }}/>
        <IconButton icon={Delete} onClick={removeFilter}/>
        {(isFilterStep && isLast) && <IconButton icon={Add} onClick={addFilter}/>}
    </Flex>
}

function Breakdown({breakdown, setBreakdown, removeBreakdown}) {
    return <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.SMALL} wrap={true}>
        <Heading type={Heading.types.H1}
                 weight={Heading.weights.LIGHT}>
            and break it down by
        </Heading>
        <ChooseDialog value={breakdown}
                      setValue={setBreakdown}
                      placeholder="column"
                      component={ColumnCombobox}
                      childProps={{
                          extraColumns: [{title: "Group", id: "__GROUP__", type: "group"}],
                          columnTypes: ["status", "people", "dropdown"]
                      }}/>
        <IconButton icon={Delete} onClick={removeBreakdown}/>
    </Flex>
}

export default function Filters({insightData, setInsight, currentStep}) {
    const [hasBreakdown, setHasBreakdown] = useState(insightData.breakdown !== undefined);

    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);
    const filters = insightData.filters;
    const isFilterStep = currentStep.key === "filter";

    function updateFilter(index, key, value) {
        const newFilters = [...filters];
        if (key === "column") {
            newFilters[index] = {"column": value}
        } else {
            newFilters[index][key] = value;
        }
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

    function setBreakdown(value) {
        setInsight("breakdown", value);
    }

    function removeBreakdown() {
        setInsight("breakdown", undefined);
        setHasBreakdown(false);
    }

    return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.XS}>
        {filters.map((filter, index) => <Filter key={index}
                                                filter={filter}
                                                updateFilter={(key, value) => updateFilter(index, key, value)}
                                                addFilter={addFilter}
                                                removeFilter={() => removeFilter(index)}
                                                isFirst={index === 0}
                                                isLast={index === filters.length - 1}
                                                isFilterStep={isFilterStep}/>)}
        {((isFilterStep && hasBreakdown) || (!isFilterStep && insightData.breakdown)) &&
            <Breakdown breakdown={insightData.breakdown}
                       setBreakdown={setBreakdown}
                       removeBreakdown={removeBreakdown}/>}
        {isFilterStep && <Flex gap={Flex.gaps.SMALL}>
            {chosenFunction.supportsFilter && filters.length === 0 && <Button leftIcon={Add}
                                                                              kind={Button.kinds.TERTIARY}
                                                                              onClick={addFilter}>
                Add filter
            </Button>}
            {chosenFunction.supportsBreakdown && !hasBreakdown && <Button leftIcon={Add}
                                                                          kind={Button.kinds.TERTIARY}
                                                                          onClick={() => setHasBreakdown(true)}>
                Add breakdown
            </Button>}
        </Flex>}
    </Flex>
}