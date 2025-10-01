from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from api.item import crud
from api.item.models import ItemDB, ItemSchema, ItemUpdateSchema
from db import SessionLocal


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ItemDB, status_code=201)
def create_item(*, db: Session = Depends(get_db), payload: ItemSchema):
    item = crud.item(db_session=db, payload=payload)
    return item


@router.get("/", response_model=List[ItemDB])
def read_all_items(db: Session = Depends(get_db)):
    return crud.get_all(db_session=db)


@router.get("/search/", response_model=List[ItemDB])
def search_items(
    *,
    db: Session = Depends(get_db),
    q: str | None = None,
):
    return crud.get_all_where(db_session=db, name=q)


@router.get("/{id}/", response_model=ItemDB)
def read_item(
    *,
    db: Session = Depends(get_db),
    id: int = Path(..., gt=0),
):
    item = crud.get(db_session=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/{id}/", response_model=ItemDB)
def update_note(
    *,
    db: Session = Depends(get_db),
    id: int = Path(..., gt=0),
    payload: ItemUpdateSchema,
):
    item = crud.get(db_session=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item = crud.put(
        db_session=db,
        item=item,
        payload=payload,
    )
    return item


@router.delete("/{id}/", response_model=ItemDB)
def delete_item(
    *,
    db: Session = Depends(get_db),
    id: int = Path(..., gt=0),
):
    item = crud.get(db_session=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item = crud.delete(db_session=db, id=id)
    return item
