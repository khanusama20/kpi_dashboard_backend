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