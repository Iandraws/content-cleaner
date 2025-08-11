from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load public key once
with open("public.pem", "r") as f:
    PUBLIC_KEY = f.read()

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials

    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
        key_id = payload.get("sub")

        if not key_id:
            raise HTTPException(status_code=401, detail="invalid_access_token")

        return {"key_id": key_id}

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="access_token_expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="invalid_access_token")
