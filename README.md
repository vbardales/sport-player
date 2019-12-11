# Sport Player

## Installation

Install dependencies:
`npm install`

## Usage

Start the app:
```
npm run build
npm run start
```

To use a query url, replace `${queryUrl}` in the next command by your URL to query
`npm run start ${queryUrl}`


Start the app in development mode:
`npm run dev`
or
`npm run dev ${queryUrl}`

Launch unit tests:
`npm run test`

## Possible improvements

- linter
- real loggers instead of console (no log in test env for instance)
- custom errors (not just JS Error)
- server handle already sent responses
