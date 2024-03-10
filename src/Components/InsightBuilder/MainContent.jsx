import {Flex} from "monday-ui-react-core";
import FunctionChooser from "./functionChooser.jsx";
import {FUNCTIONS} from "./insightsFunctions.js";

export default function MainContent({insightData, setInsight}) {
    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function);

    if (!chosenFunction) {
        return <FunctionChooser insightData={insightData} setInsight={setInsight}/>
    }

    return <Flex gap={Flex.gaps.SMALL}>
        <span>Now configure</span>
    </Flex>
}