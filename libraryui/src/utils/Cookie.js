import axios from "axios";
export const getCookiesFromNseIndia = () => {
  //   let cookie = cookie.load("nseindia");
  axios
    .get("https://www.nseindia.com", {
      headers: {
        Accept: "*.*",
        "Access-Control-Allow-Origin": "*",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        Connection: "keep-alive",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        //console.log(response.data);
      }
    });
};
