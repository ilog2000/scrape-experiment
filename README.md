## Scraping experiment

This is a simple experiment to scrape the [sreality.cz page](https://www.sreality.cz/hledani/prodej/byty) for the list of apartments being sold, and to create a simple Express back end and React front end.

Before running the code, you need to create a `.env` file in the root directory with the following content:
```
SEARCH_URL=https://www.sreality.cz/hledani/prodej/byty
DB_NAME=scrapedb
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
PORT=5000
```
Update the values as needed.

To run it locally, you need to have Node.js and PostgreSQL installed. Then, run `npm install`. Then, run `npm run ingest` to scrape the data and save it to the database. Finally, start the server with `npm run dev`. Now open the browser at `http://localhost:5000` and you should see the list of apartments.

It is possible to run everything in Docker. To do so,
1) create docker image by running `docker build -t scrape-experiment .`
2) make a container by running `docker create -p 5000:80 --env-file ./.env --name scrape-experiment scrape-experiment`
3) run `docker-compose up`. This will start the database, run the scraping script, and start the server. The server will be available at `http://localhost:5000`.