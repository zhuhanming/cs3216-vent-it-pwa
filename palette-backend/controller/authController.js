require('dotenv').config();
const { generateHashPassword } = require('../db/helper');
const jwtSecret = process.env.JWT_SECRET;
const jsonWebToken = require('jsonwebtoken');

const { sendVerificationEmail } = require('./helper');
const client = require('../db/connection');
const JWT_EXPIRES_IN = 604800;

const signupUser = (request, response) => {
  let email = request.body.email;
  let password = request.body.password;
  let full_name = request.body.full_name;
  let username = request.body.username;
  if (!email || !password || !full_name || !username) {
    return response.json({
      success: false,
      error: {
        message:
          'Field(s) are empty. Please fill in all fields before submission.'
      }
    });
  }
  client.query(
    'SELECT * FROM user_profile WHERE email = $1 ',
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount == 1) {
        //user already exist.
        return response.json({
          success: false,
          error: {
            message: 'User already exists.'
          }
        });
      }
      client.query(
        'INSERT INTO user_profile(full_name, email, username ) VALUES ($1, $2, $3) RETURNING *',
        [full_name, email, username],
        (error, insertResult) => {
          // console.log(insertResult);
          let user_profile_id = insertResult.rows[0].id;
          client.query(
            'INSERT INTO user_account(user_profile_id, email, password) VALUES ($1,$2, $3)',
            [user_profile_id, email, generateHashPassword(password)],
            (err, insertResultAccount) => {
              console.log('☑️Insert into user_account done');
              //client.end();
              let accessToken = jsonWebToken.sign(
                insertResult.rows[0],
                jwtSecret,
                {
                  //Set the expiration
                  expiresIn: JWT_EXPIRES_IN //we are setting the expiration time of 1 day.
                }
              );
              sendVerificationEmail(email, accessToken);

              response.json({
                success: true,
                user: insertResult.rows[0],
                accessToken: accessToken
              });
            }
          );
        }
      );
    }
  );
};

const loginUser = (request, response) => {
  console.log('🧐 Login', request.user);
  if (request.user) {
    console.log('✅ Success login via Email.');
    let accessToken = jsonWebToken.sign(request.user, jwtSecret, {
      //Set the expiration
      expiresIn: JWT_EXPIRES_IN //we are setting the expiration time of 7 day.
    });

    response.json({
      success: true,
      user: request.user,
      accessToken: accessToken
    });
  }
};

const loginUserError = (err, request, response, next) => {
  // failure
  if (err) {
    console.log('❌Error login via email.');
    response.status(401).json({
      success: false,
      error: err
    });
  }
};

const fbLogin = (request, response, next) => {
  // success
  if (request.user) {
    console.log('✅ Success login via Facebook.');
    // generate JWT
    // return user info and jwt.
    let accessToken = jsonWebToken.sign(request.authInfo, jwtSecret, {
      //Set the expiration
      expiresIn: JWT_EXPIRES_IN //we are setting the expiration time of 1 day.
    });

    response.json({
      success: true,
      user: request.authInfo,
      accessToken: accessToken
    });
  }
};

const fbLoginError = (err, request, response, next) => {
  // failure
  if (err) {
    console.log('❌Error login via Facebook.');
    response.status(401).json({
      success: false,
      error: err
    });
  }
};

const confirmEmail = (request, response) => {
  let user = request.user;
  let email = user.email;
  if (user.verified) {
    return response.json({
      success: false,
      error: {
        message: 'User already verified.'
      }
    });
  } else {
    client.query(
      'SELECT * FROM user_profile WHERE email = $1',
      [email],
      (error, result) => {
        if (result.rowCount == 1) {
          //user already exist.
          client.query(
            'UPDATE user_profile SET verified = true WHERE email = $1 RETURNING *',
            [email],
            (err, updateResult) => {
              if (updateResult.rowCount == 1) {
                let accessToken = jsonWebToken.sign(
                  updateResult.rows[0],
                  jwtSecret,
                  {
                    //Set the expiration
                    expiresIn: JWT_EXPIRES_IN //we are setting the expiration time of 1 day.
                  }
                );

                response.json({
                  success: true,
                  user: updateResult.rows[0],
                  accessToken: accessToken
                });
              }
            }
          );
        }
      }
    );
  }
};

const resendEmail = (request, response) => {
  console.log("Resending email...");
  let user = request.user;
  let email = user.email;

  client.query(
    'SELECT * FROM user_profile WHERE email = $1',
    [email],
    (error, result) => {
      if (result.rowCount == 0) {
        return response.json({
          success: false,
          error: {
            message: 'User does not exits.'
          }
        })
      }

      if (result.rowCount == 1) {
        let accessToken = jsonWebToken.sign(
          result.rows[0],
          jwtSecret,
          {
            //Set the expiration
            expiresIn: JWT_EXPIRES_IN //we are setting the expiration time of 1 day.
          }
        );
        sendVerificationEmail(email, accessToken);
        return response.json({
          success: true
        })
      }
    }
  );
};

module.exports = {
  signupUser,
  loginUser,
  loginUserError,
  fbLogin,
  fbLoginError,
  confirmEmail,
  resendEmail
};
