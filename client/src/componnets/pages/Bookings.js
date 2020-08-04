import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import Spinner from "../spinner/Spinner";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      const fetchBookingsBody = {
        query: `
            query {
              bookings {
                _id
                event {
                  title
                  _id
                }
                user {
                  email
                  _id
                }
                createdAt
                updatedAt
              }
            }
          `,
      };
      try {
        setLoading(true);
        const bookingsRes = await axios.post(
          "/graphql",
          fetchBookingsBody,
          config
        );
        setBookings(bookingsRes.data.data.bookings);
        setLoading(false);
      } catch (error) {
        console.error(error.response);
        setLoading(false);
      }
    })();
  }, []);
  return (
    <Fragment>
      {loading && <Spinner />}
      <ul>
        {bookings.length
          ? bookings.map((booking) => (
              <li key={booking._id}>
                {booking.event.title} - {console.log(booking.createdAt)}
                {new Date(Number(booking.createdAt)).toLocaleDateString()}
              </li>
            ))
          : null}
      </ul>
    </Fragment>
  );
};

export default Bookings;
