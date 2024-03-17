import {List, ListItem, DialogContentContainer} from 'monday-ui-react-core';

const TIMESPANS = [
    {
        label: "today",
        value: "TODAY"
    },
    {
        label: "yesterday",
        value: "YESTERDAY"
    },
    {
        label: "this week",
        value: "THIS_WEEK"
    },
    {
        label: "last week",
        value: "LAST_WEEK"
    },
    {
        label: "this month",
        value: "THIS_MONTH"
    },
    {
        label: "last month",
        value: "LAST_MONTH"
    },
    {
        label: "this quarter",
        value: "THIS_QUARTER"
    },
    {
        label: "last quarter",
        value: "LAST_QUARTER"
    },
    {
        label: "this year",
        value: "THIS_YEAR"
    },
    {
        label: "last year",
        value: "LAST_YEAR"
    },
    {
        label: "in the last 24 hours",
        value: "LAST_24_HOURS"
    },
    {
        label: "in the last 7 days",
        value: "LAST_7_DAYS"
    },
    {
        label: "in the last 30 days",
        value: "LAST_30_DAYS"
    }
]

export default function TimespanCombobox({setHover, value, setValue}) {
    function onClick(value) {
        setValue(value)
    }

    return <DialogContentContainer>
        <List className="insight-list" component={List.components.DIV}>
            {TIMESPANS.map((timespan) => {
                return <ListItem key={timespan.value}
                                 className="insight-list-item"
                                 onHover={() => setHover(timespan.label)}
                                 onClick={() => onClick(timespan)}
                                 selected={value?.value === timespan.value}>
                    {timespan.label}
                </ListItem>
            })}
        </List>
    </DialogContentContainer>
}