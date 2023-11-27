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
