require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const dbUri = process.env.MONGODB_URI;
const ownerId = "6930a92c5145f729204ae8b1";

mongoose
  .connect(dbUri)
  .then(async function () {
    console.log('Connected to MongoDB');

    await Movie.deleteMany({});

    const movies = [
      {
        name: 'Oppenheimer',
        description: 'The story of J. Robert Oppenheimer and the creation of the atomic bomb.',
        year: 2023,
        genres: ['Biography', 'Drama', 'History'],
        rating: 8.6,
        posterUrl: 'https://image.tmdb.org/t/p/w500/ptpr0k5E6LMeVbT7jN0H9gC4GKF.jpg',
        owner: ownerId
      },
      {
        name: 'The Batman',
        description: 'Batman faces the Riddler while uncovering corruption in Gotham.',
        year: 2022,
        genres: ['Action', 'Crime', 'Thriller'],
        rating: 7.9,
        posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        owner: ownerId
      },
      {
        name: 'Avatar: The Way of Water',
        description: 'Jake Sully protects his family from new threats on Pandora.',
        year: 2022,
        genres: ['Sci-Fi', 'Fantasy', 'Adventure'],
        rating: 7.7,
        posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        owner: ownerId
      },
      {
        name: 'Dune: Part One',
        description: 'Paul Atreides rises to fulfill his destiny on the desert planet Arrakis.',
        year: 2021,
        genres: ['Sci-Fi', 'Adventure', 'Drama'],
        rating: 8.0,
        posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
        owner: ownerId
      },
      {
        name: 'Spider-Man: No Way Home',
        description: 'Spider-Man faces villains from multiple universes after a spell goes wrong.',
        year: 2021,
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        rating: 8.3,
        posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        owner: ownerId
      },
      {
        name: 'John Wick: Chapter 4',
        description: 'John Wick uncovers a path to defeating the High Table.',
        year: 2023,
        genres: ['Action', 'Thriller'],
        rating: 7.8,
        posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        owner: ownerId
      },
      {
        name: 'Mission: Impossible – Dead Reckoning',
        description: 'Ethan Hunt faces artificial intelligence gone rogue.',
        year: 2023,
        genres: ['Action', 'Adventure', 'Thriller'],
        rating: 7.5,
        posterUrl: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
        owner: ownerId
      },
      {
        name: 'The Super Mario Bros. Movie',
        description: 'Mario and Luigi enter the Mushroom Kingdom to save the world.',
        year: 2023,
        genres: ['Animation', 'Adventure', 'Comedy'],
        rating: 7.3,
        posterUrl: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
        owner: ownerId
      },
      {
        name: 'Black Panther: Wakanda Forever',
        description: 'Wakanda fights to protect their home after T’Challa’s death.',
        year: 2022,
        genres: ['Action', 'Drama', 'Superhero'],
        rating: 7.2,
        posterUrl: 'https://image.tmdb.org/t/p/w500/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg',
        owner: ownerId
      },
      {
        name: 'Top Gun: Maverick',
        description: 'Maverick trains a squad of young fighter pilots for a special mission.',
        year: 2022,
        genres: ['Action', 'Drama'],
        rating: 8.3,
        posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        owner: ownerId
      }
    ];

    await Movie.insertMany(movies);

    console.log('Movies inserted successfully');
    mongoose.connection.close();
  })
  .catch(function (err) {
    console.log(err);
  });
