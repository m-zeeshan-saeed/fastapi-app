from sqlalchemy import Column, String, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

workout_routine_association = Table(
    'workout_routine', Base.metadata,
    Column('workout_id', Integer, ForeignKey('workouts.id')),
    Column('routine_id', Integer, ForeignKey('routines.id')),
)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    workouts = relationship("Workout", back_populates="user")
    routines = relationship("Routine", back_populates="user")

# In models.py, make sure Workout model has user_id as non-nullable
class Workout(Base):
    __tablename__ = 'workouts'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Add nullable=False
    name = Column(String, index=True)
    description = Column(String, index=True)
    user = relationship("User", back_populates="workouts")
    routines = relationship('Routine', secondary=workout_routine_association, back_populates='workouts')

class Routine(Base):
    __tablename__ = 'routines'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String, index=True)
    description = Column(String, index=True)
    user = relationship("User", back_populates="routines")
    workouts = relationship('Workout', secondary=workout_routine_association, back_populates='routines')
