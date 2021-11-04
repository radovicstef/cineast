class AuthenticationService {
    isUserLoggedIn() {
        fetch("http://localhost:8000/api/user")
        .then(() => {
            console.log("true");
            return true;
        })
        .catch(() => {
            return false;
        })
    }
}

export default new AuthenticationService();