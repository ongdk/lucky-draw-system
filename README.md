# Lucky Draw System

## Setup

1. Start redis and postgres containers with Docker compose using the following command:

```
docker-compose up -d
```

2a. Start the server in dev mode

```
npm install -g nodemon
npm install
npm run dev
```

2b. Start the server in production env

```
npm install
npm run build
npm start
```

3. To stop redis and postgres

```
docker-compose down
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
