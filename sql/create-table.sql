CREATE TABLE agents(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  agent_id CHAR(10) UNIQUE,
  email VARCHAR(100),
  mobile_no text,
  gender VARCHAR(10),
  password text,
  salt text,
  emp_code CHAR(7),
  report_to CHAR(10),
  channel_id INT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  login_count INT,
  last_login_date TIMESTAMP
);

CREATE TABLE uid_index(
  agent_last_index INT,
  ch_last_index INT,
  current_year CHAR(10),
  last_updated TIMESTAMP
);

SELECT * FROM uid_index;
ALTER TABLE uid_index ADD COLUMN ch_last_index INT;
UPDATE uid_index SET ch_last_index = 0
	
INSERT INTO uid_index(
  agent_last_index,
  current_year,
  last_updated
) VALUES (
  1,
  2022,
  current_timestamp
);

-- Masters
-- CH2211001
CREATE TABLE channels (
  channel_code CHAR(10) PRIMARY KEY NOT NULL,
  channel_name VARCHAR(250) NOT NULL,
  status CHAR(1),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);


CREATE TABLE kpi_mapping (
  id SERIAL PRIMARY KEY NOT NULL,
  mapping_for VARCHAR (250) NOT NULL,
  label_name VARCHAR(250) NOT NULL,
  sheet_col_name VARCHAR(250) NOT NULL,
  status CHAR(1),
  created_at TIMESTAMP
);

CREATE TABLE kpi_fields (
  id SERIAL PRIMARY KEY NOT NULL,
  lable_name VARCHAR (250) NOT NULL,
  field_name VARCHAR (250) NOT NULL,
  status CHAR(1),
  created_at TIMESTAMP
);

CREATE TABLE roles (
  role_id CHAR(10) PRIMARY KEY NOT NULL,
  role_name VARCHAR(250) NOT NULL,
  channel_id VARCHAR(10) REFERENCES channels (channel_code),
  status CHAR(1),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE hierarchies (
  hierarchy_code CHAR(10) PRIMARY KEY NOT NULL,
  hierarchy_name VARCHAR(250) NOT NULL,
  channel_id VARCHAR(10) REFERENCES channels (channel_code),
  status CHAR(1),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE designations (
  desig_id VARCHAR(10) PRIMARY KEY NOT NULL,
  desig_name VARCHAR(250) NOT NULL,
  channel_id VARCHAR(10) REFERENCES channels (channel_code),
  hierarchy_id VARCHAR(10) REFERENCES hierarchies (hierarchy_code),
  role_id VARCHAR(10) REFERENCES roles (role_id),
  status CHAR(1),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);