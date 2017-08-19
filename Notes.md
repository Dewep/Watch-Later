# Watch-Later notes

## TMDB API

- API Key: https://www.themoviedb.org/settings/api
- API docs: https://developers.themoviedb.org/3/getting-started
- Public description: https://www.themoviedb.org/documentation/api

Configurations (https://developers.themoviedb.org/3/configuration/get-api-configuration):

- Request Rate Limiting: 40 requests every 10 seconds
- `base_url`: https://image.tmdb.org/t/p/
- `backdrop_sizes`: w30, w780, w1280, original
- `logo_sizes`: w45, w92, w154, w185, w300, w500, original
- `poster_sizes`: w92, w154, w185, w342, w500, w780, original
- `profile_sizes`: w45, w185, h632, original
- `still_sizes`: w92, w185, w300, original

Genres for movies (https://developers.themoviedb.org/3/genres/get-movie-list):

- Action (28)
- Adventure (12)
- Animation (16)
- Comedy (35)
- Crime (80)
- Documentary (99)
- Drama (18)
- Family (10751)
- Fantasy (14)
- History (36)
- Horror (27)
- Music (10402)
- Mystery (9648)
- Romance (10749)
- Science Fiction (878)
- TV Movie (10770)
- Thriller (53)
- War (10752)
- Western (37)

## Auth/Profile page

User model:

- Username
- Bcrypted password
- Email
- Transmi API key
- Genres for movies filter
- Theatres region (`FR`)
- Query regions (`en-US,fr-FR`)

## News page

Display all movies that are not in our list, match our genres and:

- Top rated (https://developers.themoviedb.org/3/discover `release_date.gte=2017-06-19` `sort_by=popularity.desc`)
- Currently+soon in theatres (https://developers.themoviedb.org/3/discover `region=FR` `release_date.gte=2017-08-05` `release_date.lte=2017-09-05` `sort_by=popularity.desc`)

Get general information for a movie: https://developers.themoviedb.org/3/movies `movie_id=XXXXX` `append_to_response=alternative_titles,release_dates,videos,similar`

## My movies page

On this page, display all the movies in our list with:

- "In theatres": `status=watch-later` and `isInTheatres=true` and `canBeDownloaded=false`
- "Can be downloaded": `status=watch-later` and `canBeDownloaded=true`
- "Watch Later": `status=watch-later` and `isInTheatres=false` and `canBeDownloaded=false`

## Movie page

- General information about the movie, the releases dates, the videos, the similar movies
- The allocine link (https://www.npmjs.com/package/allocine-api `search` `q={originalTitle}` `filter=movie`, check the `productionYear` in the results)
- Possibility to set the status of the movie to `watch-later`, `ignored`, `watched`

- Add a refresh button

## Cron tasks

### Available for download

For each movie in our list with `status=watch-later` and `canBeDownloaded=false`, check with transmi API if it can be downloaded.

Run one time per day.

### Recently updated

For each movie in our list with `status=watch-later`, check if there are some recently changes (https://developers.themoviedb.org/3/movies/get-movie-changes).

If some changes, refresh data movie information.

If `key=videos` and `action=added` and `(!value.iso_639_1 || value.iso_639_1=en || value.iso_639_1=fr)`, send an email with the new trailers.

Run one time per day.

### In theatres

For each movie in our list with `status=watch-later`:

- If `isInTheatres=false`, check the FR `release_date`. If this is in 4 days, set `isInTheatres=true` and send an email.
- If `isInTheatres=true` and FR `release_date` + 14 days < NOW(), set `isInTheatres=false`

Run one time per day.
