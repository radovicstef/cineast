
# cineast

Cineast is a movie recommender platform.\
This is a full-stack app that is created using Django & React and comunicates with TMDB API.

![gif](https://github.com/radovicstef/cineast/blob/main/cineast.gif)
## Frontend

- React functional components, such as:
    - Authenticated route
    - Trending movies carousel
    - Login and registration
    - Explore movie catalogue
    - Favorite movie catalogue
    - Filter movie catalogue
    - Movie card with overview info
    - Movie details with detailed info
    - Header with navigation, search and logout functionality
    - Footer with contact information
- Styling with Material-UI and Bootstrap

## Backend

- Django REST API
    - Registration and login with JWT authentication
    - Movie content-based recommender system, based on movie synopsis keywords, using scikit-learn tool
    - User and FavoriteMovies models
    - Views that correspond to frontend components functionalities (login and registration, get searched movies, get trending movies, get similar movies, get filtered similar movies, add movie to favorite movies list, remove movie from favorite movies list)

- MySQL database



## Development setup

### Install
- Python 3.8.8
- Node.js v14.15.1
- npm 6.14.8

### Deployment

- To install all frontend dependencies, run
    ```bash
    npm install
    ```
- To build bundler file, cd frontend and run

    ```bash
    npm run build
    ```
- To start Django server, run
    ```bash
    python .\manage.py runserver
    ```




    