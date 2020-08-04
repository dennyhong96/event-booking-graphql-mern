import React, { Fragment } from "react";

import Modal from "../Modal/Modal";
import Backdrop from "../Modal/Backdrop";
import "./Events.css";

const Events = () => {
  return (
    <Fragment>
      <div className="events-control">
        <p className="events-control__msg">Share your events.</p>
        <button className="btn">Add Event</button>
      </div>
      <Modal title="Add Event" canCancel canConfirm>
        <p>Content</p>
      </Modal>
      <Backdrop />
    </Fragment>
  );
};

export default Events;
