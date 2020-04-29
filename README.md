This is a starter template for [Learn Next.js](https://nextjs.org/learn).

```
% createdb scribble-scrabble
% psql scribble-scrabble
...
```

## v1
```
CREATE TABLE games (
  id serial primary key,
  key text,
  doc json,
  timestampz timestamptz
);

CREATE TABLE players (
  id serial primary key,
  fbuid text,
  name text,
  timestampz timestamptz
);
```
