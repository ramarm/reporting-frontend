import {MultiStepIndicator} from "monday-ui-react-core";

export default function Steps({steps}) {
    return <MultiStepIndicator className="ol-center vibe-bug-multi-step-indicator-lines"
                               dividerComponentClassName="insight-steps-divider"
                               size="compact"
                               steps={steps}/>
}