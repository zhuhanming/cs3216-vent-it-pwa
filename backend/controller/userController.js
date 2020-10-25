require('dotenv').config();

const client = require('../db/connection');

const markUserOnboarded = (request, response) => {
  let user_profile_id = request.user.id;
  client.query(
    'UPDATE user_profile SET onboarded = true WHERE id = $1',
    [user_profile_id],
    (err, result) => {
      if (err) {
        return response.json({
          success: false,
          error: err
        });
      }

      response.json({
        success: true
      });
    }
  );
};

const getUserFeed = (request, response) => {
  let user_profile_id = request.user.id;
  let filterParam = request.query.filter; //angry_score or time
  // 2 ways of sorting
  if (filterParam === 'angry_score') {
    // 1) sort by angry_score highest - lowest
    client.query(
      'SELECT * FROM post WHERE user_profile_id = $1 AND archive = false ORDER BY angry_score DESC',
      [user_profile_id],
      (err, result) => {
        response.json({
          success: true,
          data: result.rows
        });
      }
    );
  } else if (filterParam === 'time') {
    // 2) sort by chrological
    client.query(
      'SELECT * FROM post WHERE user_profile_id = $1 AND archive = false ORDER BY created_at DESC',
      [user_profile_id],
      (err, result) => {
        response.json({
          success: true,
          data: result.rows
        });
      }
    );
  } else {
    //return default.
    client.query(
      'SELECT * FROM post WHERE user_profile_id = $1 AND archive = false',
      [user_profile_id],
      (err, result) => {
        response.json({
          success: true,
          data: result.rows
        });
      }
    );
  }
};

module.exports = {
  markUserOnboarded,
  getUserFeed
};
