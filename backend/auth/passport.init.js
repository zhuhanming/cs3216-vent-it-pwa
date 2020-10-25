require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

const { generateHashPassword, isSamePassword } = require('../db/helper');

const client = require('../db/connection');

const getFbCallbackUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.FACEBOOK_CALLBACK_PROD;
  } else {
    return process.env.FACEBOOK_CALLBACK;
  }
};
module.exports = () => {
 

  const JwtCallback = (decoded_token, cb) => {
    try {
      //Pass the user details to the next middleware
      return cb(null, decoded_token);
    } catch (error) {
      return cb(error);
    }
  };

  const loginCallback = (email, password, cb) => {
    client.query(
      'SELECT * FROM user_profile WHERE email = $1 ',
      [email],
      (err, user) => {
        if (err) {
          console.log('error');
        }
        //user already exists.
        if (user.rowCount == 1) {
          //check if password is correct.
          client.query(
            'SELECT * FROM user_account WHERE email = $1',
            [email],
            (err, userAccount) => {
              if (isSamePassword(password, userAccount.rows[0].password)) {
                return cb(null, user.rows[0]);
              } else {
                return cb(null, false);
              }
            }
          );
        } else {
          return cb(null, false);
        }
      }
    );
  };

  const facebookTokenCallback = (accessToken, refreshToken, profile, cb) => {
    try {
      // Check whether this current user exists in our DB
      let email = profile.emails[0].value;

      client.query(
        'SELECT * FROM user_profile WHERE email = $1 ',
        [email],
        (err, res) => {
          if (err) {
            console.log('error');
          }

          if (res.rowCount == 1) {
            //user already exists.
            cb(null, profile, res.rows[0]);
          }

          if (res.rowCount == 0) {
            console.log('User doesnt exists');
            // user does not exists.
            let full_name = profile.displayName;
            let profile_picture_url = profile.photos[0].value;
            let username = email.split('@')[0];
            let verified = true;
            client.query(
              'INSERT INTO user_profile(full_name, email, profile_picture_url, username, verified ) VALUES ($1, $2, $3, $4, $5) RETURNING *',
              [full_name, email, profile_picture_url, username, verified],
              (err, insertResult) => {
                if (err) {
                  console.log(err);
                }

                client.query(
                  'INSERT INTO facebook_account(user_profile_id, access_token) VALUES ($1,$2)',
                  [insertResult.rows[0].id, accessToken],
                  (err, insertResultFB) => {
                    console.log('☑️Insert into FB_account done');
                    cb(null, profile, insertResult.rows[0]); // can return the custom data.
                    //client.end();
                  }
                );
              }
            );
          }
        }
      );
    } catch (error) {
      cb(error, false);
    }
    
  }

  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET
      },
      facebookTokenCallback
    )
  );

  passport.use(
    new JWTstrategy(
      {
        //secret we used to sign our JWT
        secretOrKey: process.env.JWT_SECRET,
        //we expect the user to send the token as a query paramater with the name 'secret_token'
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
      },
      JwtCallback
    )
  );

  passport.use(new LocalStrategy({ usernameField: 'email' }, loginCallback));
};
