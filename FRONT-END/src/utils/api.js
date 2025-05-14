//const baseUrl =
const baseUrl = import.meta.env.VITE_API_BASE_URL;

  //import.meta.env.MODE === 'development'
    //? 'http://localhost:5000/api/v1/'
    //: 'https://www.vericapture.com.ng/api/v1/';

export async function apiRequest({ method = 'GET', route, body = null, formData = null }) {
  try {
    const options = {
      method: method.toUpperCase(),
      credentials: 'include', // for sending cookies
      headers: {},
    };

    if (formData) {
      options.body = formData;
    } else if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Accept'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${route}`, options);
    const data = await response.json();

    return {
      success: response.ok,
      message: data.message || (response.ok ? 'Request successful' : 'Request failed'),
      data: data || null,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Something went wrong',
      data: null,
      statusCode: null,
    };
  }
}
