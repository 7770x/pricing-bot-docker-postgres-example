# Uphold API


1) set up packages:
```
yarn

```
2) start Docker by running docker app

3) Deploy bot into a docker container

```
docker build . -t bot
```

4) Deploy and start postgres in another docker container with params as below:

 user: "postgres",
  database: "bot",
  password: "mysecretpassword",
  port: 5432,

```
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
docker ps
docker exec -it some-postgres bash
psql -U postgres
create database bot;
```

5) Start the bot container

```
docker run -p 4000:4000 bot
```

6) Alternatively, the bot can be run from local machine:
```
node bot.js
```

7) Request parameters can be modified in this line of bot.js, where the array contains pairs of coins to be checked, the 2nd param is minutes and third is %-age of oscillations:

```
runParams(["BTC-USD", "ETH-USD"], 5, 0.01);
```


8) Check DB bot in postgres for entries
```
psql -h localhost -p 5432 -U postgres
\l
\c bot
SELECT * FROM "entries";
```
it will return something like this:

```
 id |  pair   |    new    |    old    | diffusd | diffperc 
|       whenalerted       
----+---------+-----------+-----------+---------+----------
+-------------------------
  1 | ETH-USD | 2597.593  | 2599.229  | -1.636  | -0.063   
| 2022-03-11 15:04:55.595
  2 | BTC-USD | 39033.716 | 39047.086 | -13.370 | -0.034   
| 2022-03-11 15:05:20.701
  3 | ETH-USD | 2595.963  | 2597.553  | -1.590  | -0.061   
| 2022-03-11 15:05:20.701
  4 | BTC-USD | 39017.306 | 39033.716 | -16.411 | -0.042   
| 2022-03-11 15:05:35.769
  5 | ETH-USD | 2595.414  | 2595.963  | -0.548  | -0.021   
| 2022-03-11 15:05:35.769
  6 | BTC-USD | 39076.704 | 39017.306 | 59.398  | 0.152    
| 2022-03-11 15:05:50.826
  7 | ETH-USD | 2598.837  | 2595.414  | 3.423   | 0.132    
| 2022-03-11 15:05:50.826
  8 | BTC-USD | 39063.841 | 39076.704 | -12.863 | -0.033 
  ```
9) For testing with mocha:

```
yarn test

```
