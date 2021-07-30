CREATE SEQUENCE tablename_colname_seq;

CREATE DATABASE jwtdb;

CREATE TABLE users(
  user_id integer NOT NULL DEFAULT nextval('tablename_colname_seq') PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_password TEXT NOT NULL
);

CREATE TABLE post (
  postId integer NOT NULL DEFAULT nextval('tablename_colname_seq') PRIMARY KEY,
  user_id integer references users(user_id) on delete cascade,
  context JSON not null,
  content JSON not null,
  postedOn DATE NOT NULL DEFAULT CURRENT_DATE
);

SELECT * FROM users;

INSERT INTO users (user_name,user_email,user_password) VALUES ('Bob','bob@email.com','bob');
INSERT INTO post(user_id,context,content) VALUES (1,'{"a":"b"}','[{"type":"1","value":"Hey this is a test"}]');
Select context,content,postedon,U.user_name,U.user_id from users as U ,post where post.user_id = U.user_id;