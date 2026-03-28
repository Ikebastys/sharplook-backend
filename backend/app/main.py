import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, events, favorites, search
from app.api import admin


def get_allowed_origins() -> List[str]:
    env_val = os.getenv("ALLOWED_ORIGINS")
    if not env_val:
        # Явно перечисляем dev-оригины, чтобы не было * с credentials
        return [
            "http://localhost:8080",
            "http://127.0.0.1:8080",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    return [origin.strip() for origin in env_val.split(",") if origin.strip()]


app = FastAPI(title="SharpLook API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router, prefix="/v1")
app.include_router(events.router, prefix="/v1")
app.include_router(favorites.router, prefix="/v1")
app.include_router(auth.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
