module.exports = {
  creatorField: {
    path: "creator",
    populate: {
      path: "createdEvents",
      populate: {
        path: "creator",
      },
    },
  },
  userField: {
    path: "user",
  },
  eventField: {
    path: "event",
  },
};
