import React from "react";

import BookingItem from "./BookingItem";
import "./BookingList.css";

const BookingList = ({ bookings, handleCancel }) => {
  return (
    <ul className="booking__list">
      {!!bookings.length &&
        bookings.map((booking) => (
          <BookingItem
            key={booking._id}
            booking={booking}
            onCancel={handleCancel}
          />
        ))}
    </ul>
  );
};

export default BookingList;
