

CREATE TABLE "user_profile" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar(256) NOT NULL,
  "email" varchar(256) UNIQUE NOT NULL,
  "accept_terms_of_service" boolean DEFAULT FALSE,
  "onboarded" boolean DEFAULT FALSE,
  "profile_picture_url" TEXT DEFAULT '',
  "username" varchar(256) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE "user_account" (
  "user_profile_id" int REFERENCES user_profile(id) ON DELETE CASCADE,
  "email" varchar(256) UNIQUE NOT NULL,
  "password" varchar(256) NOT NULL,
  primary key (user_profile_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

CREATE TABLE "facebook_account" (
  "user_profile_id" int REFERENCES user_profile(id) ON DELETE CASCADE,
  "access_token" varchar(256) UNIQUE NOT NULL,
  primary key (user_profile_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);


CREATE TABLE "post" (
  "id" SERIAL PRIMARY KEY,
  "user_profile_id" int REFERENCES user_profile(id) ON DELETE CASCADE,
  "content" VARCHAR(140) NOT NULL,
  "audio_url" VARCHAR(256) NOT NULL,
  "archive" boolean DEFAULT FALSE,
  "angry_score" NUMERIC(4,1) NOT NULL,
  time_remaining TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

DROP TABLE user_profile, user_account, facebook_account, post;