var Cookies = require("js-cookie");

const state = {
  isLoggedIn: Cookies.get("user") ? true : false,
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
