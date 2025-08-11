from datetime import datetime, timedelta, timezone
import os
from jose import jwt


ACCESS_TOKEN_DURATION = os.getenv("ACCESS_TOKEN_DURATION")

# Load private key once
with open("private.pem", "r") as f:
    PRIVATE_KEY = f.read()


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=int(ACCESS_TOKEN_DURATION))
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, PRIVATE_KEY, algorithm="RS256")
    return token
