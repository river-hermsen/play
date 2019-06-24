var Cookies = require("js-cookie");

const state = {
  isLoggedIn: false,
  user: {
    token: "",
    username: "",
    email: ""
  },
  flashMsg: {
    error: {
      msg: ""
    },
    success: {
      msg: ""
    },
    info: {
      msg: ""
    }
  },
  podcasts: {
    genres: [],
    mostPopular: []
  }
};

export default state;
