from typing import Optional
from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import database.postgresql as db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    id: Optional[int] = None
    name: str
    price: float
    description: str = ""
    amount: int = 0
    category: str = ""
    purchased: bool = False


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    amount: Optional[int] = None
    category: Optional[str] = None
    purchased: Optional[bool] = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/")
def read_items(page: int = 1, limit: int = 10):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    offset = (page - 1) * limit

    cursor.execute("SELECT COUNT(*) FROM vitalis.items where purchased = false")
    result = cursor.fetchone()
    total_count = result[0] if result else 0

    cursor.execute(
        "SELECT * FROM vitalis.items WHERE purchased = false ORDER BY id LIMIT %s OFFSET %s", (limit, offset)
    )
    items = cursor.fetchall()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    total_pages = (total_count + limit - 1) // limit

    return {
        "items": [item for item in items],
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": limit,
        },
    }


@app.get("/items/{item_id}")
def read_item(item_id: int):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    cursor.execute("SELECT * FROM vitalis.items WHERE id = %s", (item_id,))
    item = cursor.fetchone()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    return {"item": item}


@app.post("/items/")
def create_item(item: Item):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    fields = [field for field in Item.model_fields.keys() if field != "id"]
    fields.extend(["created_at", "updated_at"])
    
    values = [getattr(item, field) for field in Item.model_fields.keys() if field != "id"]
    values.extend(["NOW()", "NOW()"])

    placeholders = []
    for i, field in enumerate(fields):
        if field in ["created_at", "updated_at"]:
            placeholders.append("NOW()")
        else:
            placeholders.append("%s")
    
    field_names = ", ".join(fields)
    placeholders_str = ", ".join(placeholders)
    
    execution_values = [getattr(item, field) for field in Item.model_fields.keys() if field != "id"]

    cursor.execute(
        f"INSERT INTO vitalis.items ({field_names}) VALUES ({placeholders_str}) RETURNING id",
        execution_values,
    )
    result = cursor.fetchone()
    item_id = result[0] if result else None
    conn.commit()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    response_data = item.model_dump()
    response_data["id"] = item_id
    return response_data


@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    cursor.execute("DELETE FROM vitalis.items WHERE id = %s", (item_id,))
    conn.commit()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    return {"status": "success", "item_id": item_id}


@app.put("/items/{item_id}")
def update_item(item_id: int, item_update: ItemUpdate):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    update_data = item_update.model_dump(exclude_unset=True)

    if not update_data:
        db.close_db_cursor(cursor)
        db.close_db_connection(conn)
        return {"status": "error", "message": "No fields to update"}

    update_data["updated_at"] = "NOW()"

    update_fields = []
    values = []
    
    for field, value in update_data.items():
        if field == "updated_at":
            update_fields.append(f"{field} = NOW()")
        else:
            update_fields.append(f"{field} = %s")
            values.append(value)
    
    values.append(item_id)

    query = f"UPDATE vitalis.items SET {', '.join(update_fields)} WHERE id = %s"

    cursor.execute(query, values)
    conn.commit()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    return {
        "status": "success",
        "item_id": item_id,
        "updated_fields": {k: v for k, v in update_data.items() if k != "updated_at"},
    }
