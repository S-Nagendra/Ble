import React, { useState } from "react";
import {
    View
} from "react-native";
import CalendarModule from "./CalendarModule";
import CreateEvent from "./CreateEvent";
import Dialog from "./Dialog";
import { Touchable } from "./Touchable";

const Calendar = (props) => {
    const [eventDialog, setEventDialog] = useState(false);

    const createEvent = function (title, location, startDate, endDate) {
        let event = {
            title,
            location,
            startDate,
            endDate
        }
        const allDay = true;
        CalendarModule.createCalendarEvent(event, allDay);
    };

    return (
        <View style={{ flex: 1 }}>
            {eventDialog &&
                <Dialog visible={eventDialog}>
                    <CreateEvent
                        hideDialog={() => setEventDialog(false)}
                        eventHandler={({ title, location, startDate, endDate }) => {
                            setEventDialog(false);
                            createEvent(title, location, startDate, endDate);
                        }}
                    />
                </Dialog>
            }
            <Touchable
                title="Create Event"
                onPress={() => setEventDialog(true)}
            />
        </View>
    )
}

export default Calendar;