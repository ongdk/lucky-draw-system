# Lucky Draw System

## Description

Lucky draw system created with Express.js, Postgres and Redis.

The Postgres DB contains two tables: Prize and Result.
Prize table contains configurations for each prize, including probabilities, daily and total quotas.
Result table contains lucky draw results.

Redis is used for tracking remaining quota for each prize on each day and for tracking whether a user has already participated in the lucky draw on that day.

A cron job is scheduled to run at midnight everyday to re-calculate the prize quotas stored in Redis.

## Setup

1. Create a `.env` file according to the `.env.example`
2. Start redis, postgres and server containers with Docker compose using the following command:

```
docker compose up --build -d
```

3. To stop redis and postgres

```
docker compose down
```

## API endpoints

<details>
 <summary><code>POST</code> <code><b>localhost:8000/draw</b></code> <code>(perform lucky draw for a user)</code></summary>

##### Body

> ```json
> {
>   "username": "test"
> }
> ```

##### Responses

###### Prize Won

> ```json
> {
>   "success": true,
>   "data": {
>     "message": "Congratulations! You have won a $5 Cash Coupon!",
>     "result": {
>       "id": "11a96a49-4bc7-454d-b477-7871f1b2230f",
>       "user_id": "hello",
>       "prize_id": "FIVE_DOLLAR",
>       "created_at": "2023-11-27T09:41:44.397Z"
>     }
>   }
> }
> ```

###### No Prize

> ```json
> {
>   "success": true,
>   "message": {
>     "message": "You have already participated. Please come back tomorrow!"
>   }
> }
> ```

</details>

<details>
 <summary><code>GET</code> <code><b>localhost:8000/redeem</b></code> <code>(redeem a prize)</code></summary>

##### Body

> ```json
> {
>   "id": "id"  // result id returned from the lucky draw
>   "username" : "test"
> }
> ```

##### Responses

###### Success

> ```json
> {
>   "success": true,
>   "data": {
>     "message": "You have successfully redeemed your prize.",
>     "result": {
>       "id": "11a96a49-4bc7-454d-b477-7871f1b2230f",
>       "user_id": "hello",
>       "prize_id": "FIVE_DOLLAR",
>       "created_at": "2023-11-27T09:41:44.397Z",
>       "phone_no": "+85299999999"
>     }
>   }
> }
> ```

</details>
