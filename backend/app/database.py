from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLITE_FILE_NAME = "workout_app.db"
SQL_ALCHEMY_DATABASE_URL = f"sqlite:///{SQLITE_FILE_NAME}"


connect_args = {"check_same_thread":False}
engine = create_engine(SQL_ALCHEMY_DATABASE_URL, connect_args= connect_args)
sessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)


Base = declarative_base()
