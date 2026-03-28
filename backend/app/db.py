from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import DATABASE_URL

# SQLite: check_same_thread False so one engine works across threads (FastAPI dev server)
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
