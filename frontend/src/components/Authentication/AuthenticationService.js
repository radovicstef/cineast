class AuthenticationService {
  async isUserLoggedIn() {
    return fetch("http://localhost:8000/api/user")
      .then((response) => {
        if (!response.ok) {
          return false;
        } else {
          return true;
        }
      })
      .catch(() => {
        return false;
      });
  }

  async isMovieLiked(movie_id) {
    return fetch(`http://localhost:8000/api/is_movie_liked/${movie_id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.isMovieLiked;
      })
      .catch(() => {
        return false;
      });
  }
}

export default new AuthenticationService();
