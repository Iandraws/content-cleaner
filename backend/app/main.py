from dotenv import load_dotenv

load_dotenv()

import os

from scripts.auth import get_current_user
from scripts.token import create_access_token
from scripts.database import fetch_api_key, init_db_pool
from scripts.request import CleanRequest, LoginRequest
from scripts.cleaner import clean
from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Request

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

router = APIRouter(prefix="/api", tags=["Content Cleaner"])

rate_limit_per_minute = int(os.getenv("RATE_LIMIT_PER_MINUTE"))


@router.on_event("startup")
async def startup_event():
    await init_db_pool()


@router.post("/login")
async def login_endpoint(request: LoginRequest):
    key_id = await fetch_api_key(request.key)

    if key_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": key_id})

    return {"token": token}


@router.post("/clean")
@limiter.limit(f"{rate_limit_per_minute}/minute")
async def clean_endpoint(
    request: Request,
    body: CleanRequest,
    _: dict = Depends(get_current_user),
):
    return {"clean": clean(body.text)}


@router.get("/ping")
async def clean_endpoint(
    data: dict = Depends(get_current_user),
):
    return {"id": data["key_id"]}


app.include_router(router)
