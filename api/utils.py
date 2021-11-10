from rest_framework.exceptions import AuthenticationFailed
import jwt

def getUsername(token):
    if not token:
        raise AuthenticationFailed("Unauthenticated!")
    try:
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
        return payload["username"]
    except:
        raise AuthenticationFailed("Unauthenticated!")