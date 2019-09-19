require('mocha');
const expect = require('chai').expect;
const Compressor = require('..').Compressor;
const Decompressor = require('..').Decompressor;

const compressed = [];
const expected = [];

describe('Compressor', function() {

  it('should...', function() {

    const original = {
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
    };

    const compressor = new Compressor({
      Title: true,
      Year: true,
      Rated: true,
      Released: true,
      Runtime: true,
      Genre: true,
      Director: true,
      Writer: true,
      Actors: true,
      Plot: true,
      Language: true,
      Country: true,
      Awards: true,
      Poster: true,
      Ratings: [
        { Source: true, Value: true }
      ],
      Metascore: true,
      imdbRating: true,
      imdbVotes: true,
      imdbID: true,
      Type: true,
      DVD: true,
      BoxOffice: true,
      Production: true,
      Website: true,
    });

    console.log(compressor.compress(original, false, true).compressed);

  });

  it('should compress flat object correctly and not mutate the original object', function() {

    const original = {
      firstName: 'Corey',
      lastName: 'Taylor',
      age: 45,
      superPowers: ['Beautiful Voice', 'Crazy Thick Neck', 'Kickass Headbanging Skills']
    };

    const compressor = new Compressor({
      firstName: true,
      lastName: true,
      age: true,
      superPowers: true
    });

    const result = compressor.compress(original, false, true);

    expect(result.compressed).to.deep.equal({
      a: 'Corey',
      b: 'Taylor',
      c: 45,
      d: [
        'Beautiful Voice',
        'Crazy Thick Neck',
        'Kickass Headbanging Skills'
      ]
    });

    expect(original).to.deep.equal({
      firstName: 'Corey',
      lastName: 'Taylor',
      age: 45,
      superPowers: ['Beautiful Voice', 'Crazy Thick Neck', 'Kickass Headbanging Skills']
    });

    compressed.push(result);
    expected.push(original);

  });

  it('should compress flat object correctly and mutate the original object', function() {

    const original = {
      firstName: 'Corey',
      lastName: 'Taylor',
      age: 45,
      superPowers: ['Beautiful Voice', 'Crazy Thick Neck', 'Kickass Headbanging Skills']
    };

    const compressor = new Compressor({
      firstName: true,
      lastName: true,
      age: true,
      superPowers: true
    });

    const result = compressor.compress(original, true, true);

    expect(result.compressed).to.deep.equal({
      a: 'Corey',
      b: 'Taylor',
      c: 45,
      d: [
        'Beautiful Voice',
        'Crazy Thick Neck',
        'Kickass Headbanging Skills'
      ]
    });

    expect(original).to.deep.equal({
      a: 'Corey',
      b: 'Taylor',
      c: 45,
      d: [
        'Beautiful Voice',
        'Crazy Thick Neck',
        'Kickass Headbanging Skills'
      ]
    });

  });

  it('should compress nested object correctly and not mutate the original object', function() {

    const original = {
      firstName: 'Corey',
      lastName: 'Taylor',
      age: 45,
      superPowers: ['Beautiful Voice', 'Crazy Thick Neck', 'Kickass Headbanging Skills'],
      bands: [
        { name: 'Slipknot', genres: ['Nu Metal'], albums: [
          { title: 'Slipknot', release: 1999 },
          { title: 'IOWA', release: 2001 },
          { title: 'Vol. 3', release: 2004 },
          { title: 'All Hope Is Gone', release: 2008 },
          { title: '.5: The Gray Chapter', release: 2014 },
          { title: 'We Are Not Your Kind', release: 2019 }
        ]},
        { name: 'Stone Sour', genres: ['Alternative Metal'], albums: [
          { title: 'Stone Sour', release: 2002 },
          { title: 'Come What(ever) May', release: 2006 },
          { title: 'Audio Secrecy', release: 2010 },
          { title: 'House of Gold & Bones - Part 1', release: 2012 },
          { title: 'House of Gold & Bones - Part 2', release: 2013 },
          { title: 'Hydrograd', release: 2017 }
        ]}
      ]
    };

    const compressor = new Compressor({
      firstName: true,
      lastName: true,
      age: true,
      superPowers: true,
      bands: [{ name: true, genres: true, albums: [{ title: true, release: true }] }]
    });

    const result = compressor.compress(original, false, true);

    expect(result.compressed).to.deep.equal({
      a: 'Corey',
      b: 'Taylor',
      c: 45,
      d: [
        'Beautiful Voice',
        'Crazy Thick Neck',
        'Kickass Headbanging Skills'
      ],
      j: [
        { e: 'Slipknot', f: ['Nu Metal'], i: [
          { g: 'Slipknot', h: 1999 },
          { g: 'IOWA', h: 2001 },
          { g: 'Vol. 3', h: 2004 },
          { g: 'All Hope Is Gone', h: 2008 },
          { g: '.5: The Gray Chapter', h: 2014 },
          { g: 'We Are Not Your Kind', h: 2019 }
        ]},
        { e: 'Stone Sour', f: ['Alternative Metal'], i: [
          { g: 'Stone Sour', h: 2002 },
          { g: 'Come What(ever) May', h: 2006 },
          { g: 'Audio Secrecy', h: 2010 },
          { g: 'House of Gold & Bones - Part 1', h: 2012 },
          { g: 'House of Gold & Bones - Part 2', h: 2013 },
          { g: 'Hydrograd', h: 2017 }
        ]}
      ]
    });

    expect(original).to.deep.equal({
      firstName: 'Corey',
      lastName: 'Taylor',
      age: 45,
      superPowers: ['Beautiful Voice', 'Crazy Thick Neck', 'Kickass Headbanging Skills'],
      bands: [
        { name: 'Slipknot', genres: ['Nu Metal'], albums: [
          { title: 'Slipknot', release: 1999 },
          { title: 'IOWA', release: 2001 },
          { title: 'Vol. 3', release: 2004 },
          { title: 'All Hope Is Gone', release: 2008 },
          { title: '.5: The Gray Chapter', release: 2014 },
          { title: 'We Are Not Your Kind', release: 2019 }
        ]},
        { name: 'Stone Sour', genres: ['Alternative Metal'], albums: [
          { title: 'Stone Sour', release: 2002 },
          { title: 'Come What(ever) May', release: 2006 },
          { title: 'Audio Secrecy', release: 2010 },
          { title: 'House of Gold & Bones - Part 1', release: 2012 },
          { title: 'House of Gold & Bones - Part 2', release: 2013 },
          { title: 'Hydrograd', release: 2017 }
        ]}
      ]
    });

    compressed.push(result);
    expected.push(original);

  });

  it('should compress nested object correctly and mutate the original object', function() {

    const original = {
      firstName: 'Corey',
      lastName: 'Taylor',
      age: 45,
      superPowers: ['Beautiful Voice', 'Crazy Thick Neck', 'Kickass Headbanging Skills'],
      bands: [
        { name: 'Slipknot', genres: ['Nu Metal'], albums: [
          { title: 'Slipknot', release: 1999 },
          { title: 'IOWA', release: 2001 },
          { title: 'Vol. 3', release: 2004 },
          { title: 'All Hope Is Gone', release: 2008 },
          { title: '.5: The Gray Chapter', release: 2014 },
          { title: 'We Are Not Your Kind', release: 2019 }
        ]},
        { name: 'Stone Sour', genres: ['Alternative Metal'], albums: [
          { title: 'Stone Sour', release: 2002 },
          { title: 'Come What(ever) May', release: 2006 },
          { title: 'Audio Secrecy', release: 2010 },
          { title: 'House of Gold & Bones - Part 1', release: 2012 },
          { title: 'House of Gold & Bones - Part 2', release: 2013 },
          { title: 'Hydrograd', release: 2017 }
        ]}
      ]
    };

    const compressor = new Compressor({
      firstName: true,
      lastName: true,
      age: true,
      superPowers: true,
      bands: [{ name: true, genres: true, albums: [{ title: true, release: true }] }]
    });

    const result = compressor.compress(original, true, true);

    expect(result.compressed).to.deep.equal({
      a: 'Corey',
      b: 'Taylor',
      c: 45,
      d: [
        'Beautiful Voice',
        'Crazy Thick Neck',
        'Kickass Headbanging Skills'
      ],
      j: [
        { e: 'Slipknot', f: ['Nu Metal'], i: [
          { g: 'Slipknot', h: 1999 },
          { g: 'IOWA', h: 2001 },
          { g: 'Vol. 3', h: 2004 },
          { g: 'All Hope Is Gone', h: 2008 },
          { g: '.5: The Gray Chapter', h: 2014 },
          { g: 'We Are Not Your Kind', h: 2019 }
        ]},
        { e: 'Stone Sour', f: ['Alternative Metal'], i: [
          { g: 'Stone Sour', h: 2002 },
          { g: 'Come What(ever) May', h: 2006 },
          { g: 'Audio Secrecy', h: 2010 },
          { g: 'House of Gold & Bones - Part 1', h: 2012 },
          { g: 'House of Gold & Bones - Part 2', h: 2013 },
          { g: 'Hydrograd', h: 2017 }
        ]}
      ]
    });

    expect(original).to.deep.equal({
      a: 'Corey',
      b: 'Taylor',
      c: 45,
      d: [
        'Beautiful Voice',
        'Crazy Thick Neck',
        'Kickass Headbanging Skills'
      ],
      j: [
        { e: 'Slipknot', f: ['Nu Metal'], i: [
          { g: 'Slipknot', h: 1999 },
          { g: 'IOWA', h: 2001 },
          { g: 'Vol. 3', h: 2004 },
          { g: 'All Hope Is Gone', h: 2008 },
          { g: '.5: The Gray Chapter', h: 2014 },
          { g: 'We Are Not Your Kind', h: 2019 }
        ]},
        { e: 'Stone Sour', f: ['Alternative Metal'], i: [
          { g: 'Stone Sour', h: 2002 },
          { g: 'Come What(ever) May', h: 2006 },
          { g: 'Audio Secrecy', h: 2010 },
          { g: 'House of Gold & Bones - Part 1', h: 2012 },
          { g: 'House of Gold & Bones - Part 2', h: 2013 },
          { g: 'Hydrograd', h: 2017 }
        ]}
      ]
    });

  });

  it('should compress nested object with merged schema', function() {

    const original = [
      { type: 'llc', name: 'Slipknot LLC California', founder: 'Shawn Crahan' },
      { type: 'c-corp', companyName: 'Slipknot Inc. IOWA', founders: ['Shawn Crahan', 'Corey Taylor'] },
      { type: 'llc', name: 'Slipknot LLC New York', founder: 'Shawn Crahan' }
    ];

    const compressor = new Compressor([
      { type: true, name: true, companyName: true, founder: true, founders: true }
    ]);

    const result = compressor.compress(original);

    expect(result.compressed).to.deep.equal([
      { a: 'llc', b: 'Slipknot LLC California', d: 'Shawn Crahan' },
      { a: 'c-corp', c: 'Slipknot Inc. IOWA', e: ['Shawn Crahan', 'Corey Taylor'] },
      { a: 'llc', b: 'Slipknot LLC New York', d: 'Shawn Crahan' }
    ]);

    compressed.push(result);
    expected.push(original);

  });

});

describe('Decompressor', function() {

  it('should correctly decompress all previously un-mutated compressed objects', function() {

    for ( let i = 0; i < compressed.length; i++ ) {

      const decompressor = new Decompressor(compressed[i].mappings);

      expect(decompressor.decompress(compressed[i].compressed).decompressed).to.deep.equal(expected[i]);

    }

  });

});
