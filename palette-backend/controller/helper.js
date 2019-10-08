require('dotenv').config();

const generateFilename = originalFilename => {
  let currentTimestamp = Date.now();
  let split = originalFilename.split('.'); // filename.webm
  let fileName = split[0] + '-' + currentTimestamp + '.' + split[1];
  return fileName;
};

/*
30 - 50 : 1 day 
50 - 60 : 2 days 
60 - 70 : 3 days 
80 - 90 : 4 days 
90 - 100: 5 days 
100 > 7 days
*/
const getRemainingDate = angry_score => {
  const moment = require('moment');
  if (angry_score >= 30 && angry_score <= 50) {
    return moment()
      .add(1, 'days')
      .format('x');
  } else if (angry_score >= 51 && angry_score <= 60) {
    return moment()
      .add(2, 'days')
      .format('x');
  } else if (angry_score >= 61 && angry_score <= 70) {
    return moment()
      .add(3, 'days')
      .format('x');
  } else if (angry_score >= 71 && angry_score <= 80) {
    return moment()
      .add(4, 'days')
      .format('x');
  } else if (angry_score >= 81 && angry_score <= 90) {
    return moment()
      .add(5, 'days')
      .format('x');
  } else if (angry_score >= 91 && angry_score <= 100) {
    return moment()
      .add(6, 'days')
      .format('x');
  } else if (angry_score > 100) {
    return moment()
      .add(7, 'days')
      .format('x');
  } else {
    //default 1 day.
    return moment()
      .add(1, 'days')
      .format('x');
  }
};

const sendVerificationEmail = (email, accessToken) => {
  const axios = require('axios');
  let confirmation_url;
  if (process.env.NODE_ENV === 'production') {
    confirmation_url = process.env.CONFIRMATION_URL_PROD + accessToken;
  } else {
    confirmation_url = process.env.CONFIRMATION_URL + accessToken;
  }
  axios
    .post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: {
          email: 'ventit@gmail.com',
          name: 'Vent It Support'
        },
        personalizations: [
          {
            to: [
              {
                email: email
              }
            ],
            dynamic_template_data: {
              confirmation_url: confirmation_url
            }
          }
        ],
        template_id: process.env.SEND_GRID_TEMPLATE
      },
      { headers: { Authorization: 'Bearer ' + process.env.SEND_GRID_API } }
    )
    .then(response => {
      console.log("Email sent successfully");
    })
    .catch(error => {
      console.log(error);
    });
};
module.exports = {
  generateFilename,
  getRemainingDate,
  sendVerificationEmail
};
