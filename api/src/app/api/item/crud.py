from sqlalchemy.orm import Session

from api.item.models import Item, ItemSchema, ItemUpdateSchema


def post(db_session: Session, payload: ItemSchema):
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
    return db_session.query(Item).filter(Item.id == id).first()


def get_all(db_session: Session):
    return db_session.query(Item).all()


def get_all_where(db_session: Session, **kwargs):
    return db_session.query(Item).filter_by(**kwargs).all()


def put(db_session: Session, item: Item, payload: ItemUpdateSchema):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    db_session.commit()
    return item


def delete(db_session: Session, id: int):
    item = db_session.query(Item).filter(Item.id == id).first()
    db_session.delete(item)
    db_session.commit()
    return item
