let body = {
  userName: '',
  numbers: '',
  userSender: '',
  apiKey: '',
  msg: '',
};

export const setBody = (userName, userSender, apiKey) => {
  body = {
    ...body,
    userName,
    userSender,
    apiKey,
  };
};

export const sendOtp = (msg, numbers) => {
  body = {
    ...body,
    msg,
    numbers,
  };

  console.log('body: ', body);
  return fetch('https://www.msegat.com/gw/sendsms.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then(json => {
      console.log('suceess ', json);
      if (json.message === 'Success') {
        return true;
      }
      return fasle;
    })
    .catch(error => {
      console.log('Error sending otp: ', error);

      return false;
    });

};



export const login = url => {
  console.log('Url: ', url);

  return fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log('suceess ', json);
      if (json.status) {
        const user = {...json.data, display_name: json.data.username, ID: json.data.uid, user_email: json.data.email };
        return {success: true, token: json.data.token, user};
      } else {
        return {success: false};
      }
    })
    .catch(error => {
      console.log('Error sending otp: ', error);

      return {success: false};
    });
};

export const register = url => {
  return fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log('suceess ', json);
      if (json.status) {
        const user = {...json.data, display_name: json.data.username, ID: json.data.uid, user_email: json.data.email};

        return {success: true, token: json.data.token, user};
      } else {
        return {success: false};
      }
    })
    .catch(error => {
      console.log('Error sending otp: ', error);

      return {success: false};
    });
}


