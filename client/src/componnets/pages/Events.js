import React, { Fragment, useState, useContext, useEffect } from "react";
import axios from "axios";

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
        const res = await axios.post("/graphql", fetchEventsBody, config);
        setEvents(res.data.data.events);
        console.log(res.data);
      } catch (error) {
        console.error(error.response);
      }
    })();
  }, []);

  const [events, setEvents] = useState([]);
  const [creating, toggleCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    date: "",
    description: "",
  });

  const { token } = useContext(AuthContext);

  const { title, price, date, description } = formData;

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
      <EventList events={events} />
      {creating && (
        <Fragment>
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={() => toggleCreating(false)}
            onSubmit={handleSubmit}
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
    </Fragment>
  );
};

export default Events;
