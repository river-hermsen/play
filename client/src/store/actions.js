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
  logInUser({ state }, userData) {
    console.log(state);
    console.log(userData);

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
  logOutUser() {
    Cookies.remove("user");
  },
  fetchBestPodcastsByGenreId() {}
};

export default actions;
