# Movies-Database-Api

Netguru recruitment task

## Getting Started

1. Clone this repository
2. run `npm install`
3. run `npm run start` It will synchronize the database and start listening.

## Running the tests

Run `npm run test` to launch tests

## Routes

1. `/movies` `GET` - gets all movies present in the database.<br />
You can use queries:<br />
`/movies?id=x` will return movie with id = x<br />
`/movies?year[gt]=x` will return movies with year > x<br />
`/movies?year[lt]=x` will return movies with year < x<br />

2. `/movies` `POST` - if found, adds a new movie to the database
and returns it as a json object.<br />
Parameters:<br />
`title` - title of the movie to be found<br />

3. `/comments` `GET` - gets all comments present in the database.<br />
You can use query:<br />
`/comments?id=x` will return comment with id = x<br />

4. `/comments` `POST` - if matches any movie in the database,
will add new comment to database and return it as a json object.<br />
Parameters:<br />
`id` - movie id to add comment to<br />
`body` - comment's body<br />
