DROP TABLE IF EXISTS mines;
DROP TABLE IF EXISTS ores;

CREATE TABLE mines (
    id serial NOT NULL,
    name TEXT,
    location TEXT,
    ore TEXT
);

CREATE TABLE ores (
    id serial NOT NULL,
    name TEXT,
    rarity INTEGER
);