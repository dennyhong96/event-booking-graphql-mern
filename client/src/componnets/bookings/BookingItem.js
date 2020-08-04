import React from "react";

import "./BookingItem.css";

const BookingItem = ({ booking, onCancel }) => {
  return (
    <li className="booking__item">
      <div className="booking__item-data">
        {booking.event.title} - {console.log(booking.createdAt)}
        {new Date(Number(booking.createdAt)).toLocaleDateString()}
      </div>
      <div className="booking__item-actions">
        <button className="btn" onClick={() => onCancel(booking._id)}>
          Cancel
        </button>
      </div>
    </li>
  );
};

export default BookingItem;
