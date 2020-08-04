import React, { useContext } from "react";

import AuthContext from "../../context/authContext";
import "./EventItem.css";

const EventItem = ({ eventId, title, price, userId: authUserId }) => {
  const { userId } = useContext(AuthContext);

  console.log(userId, authUserId);

  return (
    <li key={eventId} className="events__list-item">
      <div className="">
        <h1>{title}</h1>
        <h2>${price}</h2>
      </div>
      <div>
        {userId !== authUserId ? (
          <button className="btn">View Details</button>
        ) : (
          <p>Your the owner of the event</p>
        )}
      </div>
    </li>
  );
};

export default EventItem;
