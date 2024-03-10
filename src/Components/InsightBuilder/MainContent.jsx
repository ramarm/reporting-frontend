import {Flex} from "monday-ui-react-core";
import {FUNCTIONS} from "./insightsFunctions.js";
import {Heading} from "monday-ui-react-core/next";
import ChooseDialog from "./Chosers/ChooseDialog.jsx";
import FunctionCombobox from "./Chosers/Function.jsx";

export default function MainContent({insightData, setInsight}) {
    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function);

    const partsComponents = {
        text: ({key, part}) => <Heading key={key} type={Heading.types.H1}>
            {part.text}
        </Heading>
    }

    if (!chosenFunction) {
        return <ChooseDialog insightData={insightData}
                             setInsight={setInsight}
                             type="function"
                             placeholder="Choose function"
                             component={FunctionCombobox}/>
    }

    return <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.SMALL} wrap={true}>
        {chosenFunction.parts.map((part, index) => {
            return partsComponents[part.type]({key: index, part})
        })}
    </Flex>
}