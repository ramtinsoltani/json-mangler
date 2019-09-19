# JSON Compress

JSON compress is a compressor with name mangling for JSON objects. Using a schema, the compressor generates mappings for any given objects and compresses them which makes the objects shorter in size (and harder to read as a side-effect).

# Real-Life Application

A good application for this module is when a great amount of objects with the same structure is served to the client from a server. Let's consider the following example:
  1. We have a service (web application + server) which is connected to a database of movies information
  2. A complete movie object looks like the following:
  ```json
  {
      "Title": "Pulp Fiction",
      "Year": "1994",
      "Rated": "R",
      "Released": "14 Oct 1994",
      "Runtime": "154 min",
      "Genre": "Crime, Drama",
      "Director": "Quentin Tarantino",
      "Writer": "Quentin Tarantino (stories), Roger Avary (stories), Quentin Tarantino",
      "Actors": "Tim Roth, Amanda Plummer, Laura Lovelace, John Travolta",
      "Plot": "The lives of two mob hitmen, a boxer, a gangster & his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      "Language": "English, Spanish, French",
      "Country": "USA",
      "Awards": "Won 1 Oscar. Another 62 wins & 69 nominations.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "8.9/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "92%"
        },
        {
          "Source": "Metacritic",
          "Value": "94/100"
        }
      ],
      "Metascore": "94",
      "imdbRating": "8.9",
      "imdbVotes": "1,655,375",
      "imdbID": "tt0110912",
      "Type": "movie",
      "DVD": "19 May 1998",
      "BoxOffice": "N/A",
      "Production": "Miramax Films",
      "Website": "N/A"
  }
  ```
  3. The JSON object of the movie title "Pulp Fiction" is 1031 bytes in size (with white spaces removed)
  4. The database contains 500,000 movie titles (approximately 515.5 MB) and the service has on average 200,000 daily users
  5. If each user fetches 50 movies in their visit (consider the frontpage showcasing new movies in a list), the server is serving ~300 GB of data each month
  6. Compressing the database using this module would reduce the storage size to 434.5 MB and the monthly bandwidth to ~262.3 GB
  7. This data would be decompressed on the client side before being displayed to the users
