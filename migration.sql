CREATE TABLE IF NOT EXISTS mines (
    id SERIAL PRIMARY KEY,
    name TEXT,
    location TEXT
);

CREATE TABLE IF NOT EXISTS ores (
    id SERIAL PRIMARY KEY,
    name TEXT,
    rarity INTEGER
);