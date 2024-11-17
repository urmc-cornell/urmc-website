-- Create tables
CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    netid VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    graduation_year INTEGER,
    major VARCHAR(100),
    join_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(200) NOT NULL,
    event_date DATE NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    points_value INTEGER NOT NULL,
    description TEXT
);

CREATE TABLE points_tracking (
    tracking_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    event_id INTEGER REFERENCES events(event_id),
    points_earned INTEGER NOT NULL,
    date_earned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    semester VARCHAR(20),
    UNIQUE(member_id, event_id)
);