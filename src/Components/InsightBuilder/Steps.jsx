import {MultiStepIndicator} from "monday-ui-react-core";

export default function Steps({insightData}) {
    const steps = [
        {
            key: "function",
            titleText: "Function"
        },
        {
            key: "configure",
            titleText: "Configure"
        },
        {
            key: "filter",
            titleText: "Filter"
        },
        {
            key: "breakdown",
            titleText: "Breakdown"
        },
        {
            key: "preview",
            titleText: "Preview"
        }
    ]

    return <MultiStepIndicator className="vibe-bug-multi-step-indicator-lines"
                               dividerComponentClassName="insight-steps-divider"
                               size="compact"
                               steps={steps}/>
}