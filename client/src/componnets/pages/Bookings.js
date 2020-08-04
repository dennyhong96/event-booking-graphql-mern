import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import BookingList from "../bookings/BookingList";
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

  const handleCancel = async (bookingId) => {
    const cancelBody = {
      query: `
        mutation CancelBooking($bookingId: ID!){
          cancelBooking(bookingId:$bookingId){
            _id
            title
            description
            price
            date
            creator {
              email
            }
          }
        }
      `,
      variables: {
        bookingId,
      },
    };
    try {
      const res = await axios.post("/graphql", cancelBody, config);

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error(error.response);
    }
  };
  return (
    <Fragment>
      {loading && <Spinner />}
      <BookingList bookings={bookings} handleCancel={handleCancel} />
    </Fragment>
  );
};

export default Bookings;
