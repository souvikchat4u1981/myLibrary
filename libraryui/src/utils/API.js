import axios from "axios";

let baseaddress = window.Configs.baseaddress;
//console.log("Base address :" + baseaddress);
export default axios.create({
  baseURL: baseaddress,
  headers: {
    "Content-type": "application/json",
  },
});
