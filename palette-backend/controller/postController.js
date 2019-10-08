require('dotenv').config();
// Storage
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AWS = require('aws-sdk');

const { generateFilename, getRemainingDate } = require('./helper');

//sql
const client = require('../db/connection');

let space = new AWS.S3({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  useAccelerateEndpoint: false,
  credentials: new AWS.Credentials(
    process.env.DO_SPACES_KEY,
    process.env.DO_SPACES_TOKEN,
    null
  ),
  signatureVersion: 'v4'
});

const uploadPost = (request, response) => {
  let bucketName = request.user.email;
  let content = request.body.content;
  let angry_score = request.body.angry_score;
  if (!bucketName || !content || !angry_score || !request.file) {
    return response.json({
      success: false,
      error: {
        message:
          'Field(s) are empty. Please fill in all fields before submission.'
      }
    });
  }
  console.log('Bucketname', bucketName);
  space.createBucket({ Bucket: bucketName }, (err, data) => {
    //created bucket
    let uploadParameters = {
      Bucket: bucketName,
      ContentType: 'audio/webm',
      Body: request.file.buffer,
      ACL: 'private',
      Key: generateFilename(request.file.originalname)
    };

    space.upload(uploadParameters, (error, data) => {
      if (error) {
        console.error('🚨 Uploading file error', error);
        return response.json({
          status: false,
          error: error
        });
      }

      const params = {
        Bucket: data.Bucket,
        Key: data.key, //the directory in S3
        Expires: 3600 //expire in 1hr
      };
      let audio_url = data.key;
      let time_remaining = getRemainingDate(angry_score);
      space.getSignedUrl('getObject', params, (err, url) => {
        console.log('Download URL', url);

        client.query(
          'INSERT INTO post(user_profile_id,content,audio_url,angry_score, time_remaining) VALUES ($1,$2,$3,$4, to_timestamp( $5 / 1000.0)) RETURNING *',
          [request.user.id, content, audio_url, angry_score, time_remaining],
          (err, result) => {
            if (err) {
              console.log('ERROR uploading post...', err);
              return response.json({
                success: true,
                error: err
              });
            } else {
              console.log('✅ Success insert post.', result.rows[0]);
              let data = result.rows[0];
              data.audio_url = url;
              response.json({
                success: true,
                data: [data]
              });
            }
          }
        );
      });
    });
  });
};

const getPost = (request, response) => {
  let postId = request.params.id;
  let user_profile_id = request.user.id;
  let bucketName = request.user.email;
  client.query(
    'SELECT * FROM post WHERE id = $1 AND user_profile_id = $2',
    [postId, user_profile_id],
    (err, result) => {
      if (err) {
        return response.json({
          success: false,
          error: err
        });
      }

      console.log('Requesting post', result.rows);
      if (result.rowCount == 1) {
        let key = result.rows[0].audio_url;
        const params = {
          Bucket: bucketName,
          Key: key, //the directory in S3
          Expires: 3600 //expire in 1hr
        };
        space.getSignedUrl('getObject', params, (err, url) => {
          console.log('Download URL', url);
          let data = result.rows[0];
          data.audio_url = url;
          response.json({
            success: true,
            data: [data]
          });
        });
      } else {
        response.json({
          success: false,
          error: {
            message: 'Content not found.'
          }
        });
      }
    }
  );
};

const deletePost = (request, response) => {
  let postId = request.params.id;
  let user_profile_id = request.user.id;
  let bucketName = request.user.email;
  client.query(
    'DELETE FROM post WHERE id = $1 AND user_profile_id = $2 RETURNING *',
    [postId, user_profile_id],
    (err, result) => {
      if (err) {
        return response.json({
          success: false,
          error: err
        });
      }
      if (result.rowCount == 1) {
        let key = result.rows[0].audio_url;
        let param = {
          Bucket: bucketName,
          Key: key
        };
        space.deleteObject(param, (err, data) => {
          console.log('💣 Deleting audio files...');
          response.json({
            success: true
          });
        });
      } else {
        response.json({
          success: false,
          error: {
            message: 'No content to be deleted.'
          }
        });
      }
    }
  );
};

const getArchivedPosts = (request, response) => {
  let user_profile_id = request.user.id;
  console.log('Getting archived post..');
  client.query(
    'SELECT * FROM post WHERE user_profile_id = $1 AND archive = true',
    [user_profile_id],
    (err, result) => {
      if (err) {
        return response.json({
          success: false,
          error: err
        });
      }

      response.json({
        success: true,
        data: result.rows
      });
    }
  );
};

const markPostsAsArchived = (request, response) => {
  let currentTime = Date.now();
  client.query(
    'UPDATE post SET archive = true WHERE time_remaining < to_timestamp( $1 / 1000.0) AND archive = false RETURNING *',
    [currentTime],
    (err, result) => {
      if (err) {
        return response.status(400).json({
          success: false,
          error: err
        })
      }
      response.status(200).json({
        success: true,
        data: result.rowCount
      })
    }
  );
};

module.exports = {
  uploadPost,
  getPost,
  deletePost,
  getArchivedPosts,
  markPostsAsArchived
};
