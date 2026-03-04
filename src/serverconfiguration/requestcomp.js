import axios from "axios";
// export async function getRequest(url, controller, jwt) {
//   if (jwt == null) {
//     if (sessionStorage.getItem("jwt") == null) {
//       alert("session has expired ! You need to login again");
//       return null;
//     } else {
//       return await axios.get(url + controller, {
//         headers: {
//           "X-Special-Header": sessionStorage.getItem("jwt"),
//         },
//       });
//     }
//   } else {
//     return await axios.get(url + controller, jwt);
//   }
// }
export async function getRequest(controller, config) {
  const baseUrl = "https://localhost:7266/api/";
  const authStr=sessionStorage.getItem("auth");
  const token=authStr? JSON.parse(authStr).token:null;
  return axios.get(baseUrl + controller, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      
      ...(config?.headers || {}),
    },
    ...config,
  });
}

export async function postRequest(url, controller, data, jwt) {
  if (jwt == null) {
    return await axios.post(url + controller, data, {
      headers: {
        "X-Special-Header": sessionStorage.getItem("jwt"),
      },
    });
  } else {
    return await axios.post(url + controller, data, jwt);
  }
}
export async function putRequest(url, controller, data) {
  return await axios.put(url + controller, data, {
    headers: {
      "X-Special-Header": sessionStorage.getItem("jwt"),
    },
  });
}
export async function deleteRequest(url, controller, data) {
  return await axios.delete(url + controller, data, {
    headers: {
      "X-Special-Header": sessionStorage.getItem("jwt"),
    },
  });
}
