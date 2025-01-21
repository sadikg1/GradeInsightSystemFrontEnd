import axios from 'axios';

export const baseURL = import.meta.env.VITE_BASE_URL_API;
// const tok = '8398a2a648e4+c0203d19d7140c+$45bc6b577e0f00c8';
// Using Axios Create
const InterceptAxios = (props) => {
  // var enc = encrypt();
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      Accept: 'application/octet-stream',

      requestBy: props?.requestBy,
      userPassword: props?.userPassword,
      userEmail: props?.userEmail
    }
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return instance;
};
//function to authenticate
// const getAuth = async (slug, headers = {}) => {
//   return await InterceptAxios().get(slug, { headers });
// };
// Function to get data
const getData = async (slug, headers = {}) => {
  console.log('url', baseURL, slug);
  return await InterceptAxios().get(slug, { headers });
};
const getDataForReport = async (slug, headers = {}) => {
  return await InterceptAxios().get(slug, { headers, responseType: 'blob' });
};

// Function to handle POST request
const postData = async (slug, payload = {}, headers = {}) => {
  return await InterceptAxios().post(slug, payload, { headers });
};

// Function to handle PUT request
const putData = async (slug, payload = {}, headers = {}) => {
  console.log('url', baseURL, slug,payload);
  return await InterceptAxios().put(slug, payload, { headers });
};

// Function to handle DELETE request
const deleteData = async (slug, headers = {}) => {
  return await InterceptAxios().delete(slug, { headers });
};

// export function encrypt() {
//   var dateNow = new Date().toISOString().toString().split('Z')[0];
//   var encodedvalue = tok + ':' + dateNow;
//   var encoded = btoa(encodedvalue);
//   return encoded;
// }

export { getData, getDataForReport, postData, putData, deleteData };
