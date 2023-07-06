import { ErrorMessage } from "../lib/toastMessage/Toastmessage";
import API from "./API";

let baseaddress = window.Configs.baseaddress;

export const postCall = async ({
  endpoint,
  headers,
  body,
  setload,
  res,
} = {}) => {
  endpoint = baseaddress + endpoint;
  if (sessionStorage.getItem("tokens")) {
    headers = {
      ...headers,
      Authorization:
        JSON.parse(sessionStorage.getItem("tokens")).tokenType +
        " " +
        JSON.parse(sessionStorage.getItem("tokens")).accessToken,
    };
  }
  // body = { ...body };

  const response = await API.post(endpoint, body, {
    headers: headers,
  })
    .then(function (response) {
      if (response.data.token) {
        sessionStorage.setItem("tokens", JSON.stringify(response.data.token));
      }

      return {
        data: response.data,
      };
    })
    .catch((error) => {
      // ErrorMessage("An error ocured. " + error.message);
      return { data: error.response.data };
    });

  return response.data;
};

export const getCall = async ({ endpoint, headers } = {}) => {
  endpoint = baseaddress + endpoint;

  if (sessionStorage.getItem("tokens")) {
    headers = {
      ...headers,
      Authorization:
        JSON.parse(sessionStorage.getItem("tokens")).tokenType +
        " " +
        JSON.parse(sessionStorage.getItem("tokens")).accessToken,
    };
  }
  const response = await API.get(endpoint, {
    headers: headers,
  })
    .then(function (response) {
      if (response.data.token) {
        sessionStorage.setItem("tokens", JSON.stringify(response.data.token));
      }

      return {
        data: response.data,
      };
    })
    .catch((error) => {
      // ErrorMessage("An error ocured. " + error.message);
      return { data: error.response.data };
    });
  return response.data;
};
