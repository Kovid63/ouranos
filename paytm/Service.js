import {API_URL} from './Constants';

export const generateToken = async (orderId, amount, customerId) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    orderId: orderId,
    amt: amount,
    customerId: customerId,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return await fetch(API_URL, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log("result", result)
      return result?.body?.txnToken;
    })
    .catch(error => console.log('error', error));
};