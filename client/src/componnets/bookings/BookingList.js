import React from "react";

import BookingItem from "./BookingItem";
import "./BookingList.css";

const BookingList = ({ bookings }) => {
  return (
    <ul className="booking__list">
      {!!bookings.length &&
        bookings.map((booking) => (
          <BookingItem key={booking._id} booking={booking} />
        ))}
    </ul>
  );
};

export default BookingList;
