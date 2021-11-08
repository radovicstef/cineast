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
}

export default new AuthenticationService();
