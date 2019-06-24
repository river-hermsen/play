var Cookies = require("js-cookie");

const actions = {
  getUserInfo() {
    if (Cookies.get("user")) {
      const userInfo = JSON.parse(Cookies.get("user"));
      return {
        username: userInfo.username,
        email: userInfo.email
      };
    } else {
      return false;
    }
  },
  logInUser(userData) {
    // console.log(state);
    // console.log(userData);
    Cookies.set(
      "user",
      {
        jwt: userData.token,
        username: userData.username,
        email: userData.email
      },
      { expires: 7 }
    );
  },
  logOutUser({ state }) {
    // console.log(state);
    state.isLoggedIn = false;
    Cookies.remove("user");
    return;
  }
};

export default actions;
