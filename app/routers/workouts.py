from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, status, HTTPException, Depends
from app.models import Workout
from app.deps import db_dependency, user_dependency

router = APIRouter(
    prefix='/workouts',
    tags=['workouts']
)

class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutResponse(WorkoutBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

@router.get('/{workout_id}', response_model=WorkoutResponse)
def get_workout(
    db: db_dependency,
    user: user_dependency,
    workout_id: int
):
    if not user or not user.get('id'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == user['id']
    ).first()

    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.get('/', response_model=list[WorkoutResponse])
def get_workouts(db: db_dependency, user: user_dependency):
    if not user or not user.get('id'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return db.query(Workout).filter(Workout.user_id == user['id']).all()

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=WorkoutResponse)
def create_workout(
    db: db_dependency,
    user: user_dependency,
    workout: WorkoutCreate
):
    if not user or not user.get('id'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    db_workout = Workout(
        name=workout.name,
        description=workout.description,
        user_id=user['id']  # Use bracket notation instead of get()
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.delete('/{workout_id}')
def delete_workout(
    db: db_dependency,
    user: user_dependency,
    workout_id: int
):
    if not user or not user.get('id'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    db_workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == user['id']
    ).first()

    if not db_workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    db.delete(db_workout)
    db.commit()
    return {"message": "Workout deleted successfully"}
