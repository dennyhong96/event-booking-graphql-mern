import React, { Fragment, useState, useContext, useEffect } from "react";
import axios from "axios";

import Spinner from "../spinner/Spinner";
import EventList from "../events/EventList";
import AuthContext from "../../context/authContext";
import Modal from "../Modal/Modal";
import Backdrop from "../Modal/Backdrop";
import "./Events.css";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const Events = () => {
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [creating, toggleCreating] = useState(false);
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    date: "",
    description: "",
  });
  const { title, price, date, description } = formData;

  useEffect(() => {
    (async () => {
      const fetchEventsBody = {
        query: `
          query {
            events {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }
        `,
      };
      try {
        setLoading(true);
        const eventsRes = await axios.post("/graphql", fetchEventsBody, config);
        setEvents(eventsRes.data.data.events);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error.response);
      }
    })();
  }, []);

  const handleViewDetail = (eventId) => {
    setSelectedEvent(events.find((event) => event._id === eventId));
  };

  const bookEventHandler = async () => {
    if (token) {
      const bookEventBody = {
        query: `
          mutation {
            bookEvent(eventId:"${selectedEvent._id}"){
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
        const res = await axios.post("/graphql", bookEventBody, config);
        console.log(res.data);
      } catch (error) {
        console.error(error.response);
      }
    }
    setSelectedEvent(null);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (title && price && date && description) {
      console.log(formData);
      const body = {
        query: `
          mutation {
            createEvent(eventInput:{title:"${title}",description:"${description}",price:${price},date:"${date}"}){
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }
        `,
      };

      try {
        const res = await axios.post("/graphql", body, config);
        setEvents((prev) => [res.data.data.createEvent, ...prev]);
        console.log(res);
        toggleCreating(false);
      } catch (error) {
        console.error(error.response);
      }
    }
  };

  return (
    <Fragment>
      {token && (
        <div className="events-control">
          <p className="events-control__msg">Share your events.</p>
          <button className="btn" onClick={() => toggleCreating(true)}>
            Add Event
          </button>
        </div>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <EventList events={events} onViewDetail={handleViewDetail} />
      )}
      {creating && (
        <Fragment>
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={() => toggleCreating(false)}
            onSubmit={handleSubmit}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={price}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </form>
          </Modal>
          <Backdrop />
        </Fragment>
      )}
      {selectedEvent && (
        <Fragment>
          <Modal
            title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={() => setSelectedEvent(null)}
            onSubmit={bookEventHandler}
            confirmText={token ? "Book" : "Confirm"}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>{new Date(selectedEvent.date).toLocaleDateString()}</h2>
            <p>{selectedEvent.description}</p>
          </Modal>
          <Backdrop />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Events;
