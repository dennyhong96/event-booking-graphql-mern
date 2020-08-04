import React from "react";

import EventItem from "./EventItem";
import "./EventList.css";

const EventList = ({ events, onViewDetail }) => {
  return (
    <ul className="events__list">
      {events.length
        ? events.map((event) => (
            <EventItem
              key={event._id}
              className="events__list-item"
              eventId={event._id}
              title={event.title}
              price={event.price}
              userId={event.creator._id}
              date={event.date}
              onDetail={onViewDetail}
            />
          ))
        : null}
    </ul>
  );
};

export default EventList;
