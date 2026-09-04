import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Default to MySQL, fallback to SQLite if needed
MYSQL_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:root@localhost:3306/ai_marketing")
SQLITE_FALLBACK_URL = "sqlite:///./ai_marketing.db"

def get_engine():
    try:
        engine = create_engine(MYSQL_URL, pool_pre_ping=True)
        # Test connection
        with engine.connect() as conn:
            pass
        print(f"Connected to MySQL database: {MYSQL_URL}")
        return engine
    except Exception as e:
        print(f"MySQL Connection Warning: {e}")
        print("Falling back to local SQLite database for development stability...")
        engine = create_engine(SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})
        return engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
