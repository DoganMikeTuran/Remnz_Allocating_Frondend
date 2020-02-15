import jwt_decode from "jwt-decode";
import queryString from "query-string";

const URL = require("../../package.json").url.server;

class ApiFacade {
  email;
  firstName;
  lastName;
  accessToken;
  expiresAt;
  refreshToken;
  expiresOn;

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getToken() {
    return localStorage.getItem("accessToken");
  }

  setToken(token) {
    this.accessToken = token;
  }
  getExpOn() {
    return this.expiresOn;
  }

  setExpOn(expiresOn) {
    this.expiresOn = expiresOn;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  logout() {
    this.accessToken = null;
    this.expiresOn = null;
    this.firstName = null;
    this.lastName = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresOn");
  }

  isAuthenticated() {
    var now = Date.now() / 1000;
    var exp = localStorage.getItem("expiresOn");

    if (exp < now) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresOn");
    }

    return exp > now;
  }

  login(email, password) {
    const headers = {
      "Content-Type": "application/json"
    };
    return new Promise((resolve, reject) => {
      fetch("https://localhost:5001/api/login", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          firstname: email,
          lastname: password
        })
      })
        .then(Response => {
          return Response.json();
        })
        .then(data => {
          this.accessToken = data.token;
          var decode = jwt_decode(data.token);
          this.expiresAt = decode.exp;
          localStorage.setItem(
            "accessToken",
            JSON.stringify({
              token: data.token,
              hey: data.token
            })
          );
          console.log(decode.exp);
          console.log(data);

          this.firstName = decode.nameid;
          this.lastName = decode.family_name;

          console.log(data.token);
          console.log(decode);

          return resolve(data);
        })

        .catch(err => reject(err));
    });
  }

  getData(endpoint) {
    const headers = {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("accessToken")
    };

    return new Promise((resolve, reject) => {
      fetch(URL + endpoint, {
        method: "GET",
        headers: headers
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => {
          return resolve(data);
        })
        .catch(err => reject(err));
    });
  }

  readTokenData = () => {
    const jwtToken = localStorage.getItem("accessToken");
    if (jwtToken !== "undefined") {
      var decoded = jwt_decode(jwtToken);
      this.firstName = decoded.family_name;
      this.lastName = decoded.family_name;
      this.expiresOn = decoded.exp;
      //this.refreshToken = decoded.refreshToken;
    }
  };
}

const facade = new ApiFacade();

if (facade.getToken() !== null) {
  facade.readTokenData();
}

export default facade;
