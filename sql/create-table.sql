CREATE TABLE agents(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  pan_no CHAR(10) UNIQUE,
  email VARCHAR(100),
  mobile_no text,
  gender VARCHAR(10),
  birth_date DATE,
  age INT,
  password text,
  emp_code CHAR(7) UNIQUE,
  state VARCHAR(50),
  city VARCHAR(50),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  login_count INT,
  last_login_date TIMESTAMP
);

CREATE TABLE users(
		user_id serial PRIMARY KEY,
		first_name VARCHAR(50) NOT NULL,
		last_name VARCHAR(50) NOT NULL,
		username VARCHAR(50) UNIQUE NOT NULL,
		email VARCHAR(50) UNIQUE NOT NULL,
		gender CHAR(1),
		created_on TIMESTAMP NOT NULL,
		last_login TIMESTAMP
	);


CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  title VARCHAR(250) NOT NULL,
  description text,
  created_on TIMESTAMP NOT NULL,
  updated_on TIMESTAMP,
  user_id INT REFERENCES users (user_id)
);

INSERT INTO events (event_date, event_time, title, description, created_on, user_id) VALUES (
  '2022-10-28',
  '11:30 AM',
  'Meeting with client at chembur',
  'I will meet with client at near chembur station E',
  current_timestamp,
  '5'
);


CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  score INT,
  created_on TIMESTAMP NOT NULL,
  updated_on TIMESTAMP,
  user_id INT REFERENCES users (user_id)
);