from sqlalchemy.orm import Session

from api.item.models import Item, ItemSchema, ItemUpdateSchema
from sqlalchemy import select


def item(db_session: Session, payload: ItemSchema):
    item = Item(
        name=payload.name,
        description=payload.description,
        category=payload.category,
        price=payload.price,
        amount=payload.amount,
        purchased=payload.purchased,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)

    return item


def get(db_session: Session, id: int):
    stmt = select(Item).where(Item.id == id)
    return db_session.execute(stmt).scalar_one()


def get_all(db_session: Session):
    stmt = select(Item)
    return db_session.execute(stmt).scalars().all()


def search(db_session: Session, query: str):
    stmt = select(Item).where(getattr(Item, "name").ilike(f"%{query}%"))
    return db_session.execute(stmt).scalars().all()


def get_all_where(db_session: Session, **kwargs):
    stmt = select(Item).filter_by(**kwargs)
    return db_session.execute(stmt).scalars().all()


def put(db_session: Session, item: Item, payload: ItemUpdateSchema):
    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(item, field, value)

    db_session.commit()
    return item


def delete(db_session: Session, id: int):
    stmt = select(Item).where(Item.id == id)
    item = db_session.execute(stmt).scalar_one_or_none()

    db_session.delete(item)
    db_session.commit()

    return item
