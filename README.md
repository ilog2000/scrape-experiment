## Scraping experiment

This is a simple experiment to scrape the [sreality.cz page](https://www.sreality.cz/hledani/prodej/byty) for the list of apartments being sold, and to create a simple Express back end and React front end.

To run it locally, you need to have Node.js and PostgreSQL installed. Then,
1) run `npm install`,
2) run `npm run build` to build all apps,
3) run `npm run init` to create the database,
4) run `npm run ingest` to scrape the data and save it to the database,
5) finally, start the server with `npm run dev`.
Now open the browser at `http://localhost:5000` and you should see the list of apartments.

It is possible to run everything in Docker conatiners. To do so,
1) run `docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=scrapedb -p 5432:5432 -d postgres:alpine` to create and start a postgres container,
2) create docker image by running `docker build -t scrape-experiment .`,
3) make a container by running `docker create -p 5000:5000 --env-file ./.env --name scrape-experiment scrape-experiment`,
4) execute `docker start scrape-experiment`.

Alternatively, run `docker-compose up`. This will start the database and start the server. The server will be available at `http://localhost:5000`.

To ingest the data, run locally in project directory `npm run ingest`.
