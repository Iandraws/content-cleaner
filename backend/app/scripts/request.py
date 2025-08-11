from pydantic import BaseModel


class CleanRequest(BaseModel):
    text: str


class LoginRequest(BaseModel):
    key: str
