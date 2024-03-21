import {Flex} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import ChooseDialog from "../Dropdowns/ChooseDialog.jsx";
import ColumnCombobox from "../Dropdowns/Column.jsx";
import ValueCombobox from "../Dropdowns/Value.jsx";
import TimespanCombobox from "../Dropdowns/Timespan.jsx";

export default function Configuration({chosenFunction, insightData, setInsight}) {
    const partsComponents = {
        text: ({key, part}) => <Heading key={key}
                                        type={Heading.types.H2}
                                        weight={Heading.weights.LIGHT}>
            {part.text}
        </Heading>,
        column: ({key, part}) => <ChooseDialog key={key}
                                               value={insightData.column}
                                               setValue={(value) => setInsight("column", value)}
                                               placeholder="column"
                                               component={ColumnCombobox}
                                               childProps={part.props}/>,
        value: ({key}) => <ChooseDialog key={key}
                                        value={insightData.value}
                                        setValue={(value) => setInsight("value", value)}
                                        placeholder="value"
                                        component={ValueCombobox}
                                        childProps={{
                                            selectedColumn: insightData.column
                                        }}/>,
        timespan: ({key}) => <ChooseDialog key={key}
                                           value={insightData.timespan}
                                           setValue={(value) => setInsight("timespan", value)}
                                           placeholder="in time"
                                           component={TimespanCombobox}/>
    }

    return <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.SMALL} wrap={true}>
        {chosenFunction.parts.map((part, index) => {
            return partsComponents[part.type]({key: index, part})
        })}
    </Flex>
}