from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import database.postgresql as db

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/")
def read_items(page: int = 1, limit: int = 10):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    offset = (page - 1) * limit

    cursor.execute("SELECT COUNT(*) FROM items")
    result = cursor.fetchone()
    total_count = result[0] if result else 0

    cursor.execute("SELECT * FROM items LIMIT %s OFFSET %s", (limit, offset))
    items = cursor.fetchall()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    total_pages = (total_count + limit - 1) // limit

    return {
        "items": items,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": limit,
        },
    }


@app.get("/items/{item_id}")
def read_item(
    item_id: int,
):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    cursor.execute("SELECT * FROM items WHERE id = %s", (item_id,))
    item = cursor.fetchone()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    return {"item": item}


@app.post("/items/")
def create_item(
    name: str,
    price: float,
    description: Union[str, None] = None,
):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    cursor.execute(
        "INSERT INTO items (name, price, description) VALUES (%s, %s, %s) RETURNING id",
        (name, price, description),
    )
    result = cursor.fetchone()
    item_id = result[0] if result else None
    conn.commit()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    return {
        "item_id": item_id,
        "name": name,
        "price": price,
        "description": description,
    }


@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    cursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
    conn.commit()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    return {"status": "success", "item_id": item_id}


@app.put("/items/{item_id}")
def update_item(
    item_id: int,
    name: Union[str, None] = None,
    price: Union[float, None] = None,
    description: Union[str, None] = None,
):
    conn = db.get_db_connection()
    cursor = db.get_db_cursor(conn)

    update_fields = []
    values = []

    if name is not None:
        update_fields.append("name = %s")
        values.append(name)

    if price is not None:
        update_fields.append("price = %s")
        values.append(price)

    if description is not None:
        update_fields.append("description = %s")
        values.append(description)

    if not update_fields:
        db.close_db_cursor(cursor)
        db.close_db_connection(conn)
        return {"status": "error", "message": "No fields to update"}

    query = f"UPDATE items SET {', '.join(update_fields)} WHERE id = %s"
    values.append(item_id)

    cursor.execute(query, values)
    conn.commit()

    db.close_db_cursor(cursor)
    db.close_db_connection(conn)

    return {
        "status": "success",
        "item_id": item_id,
        "updated_fields": {
            k: v
            for k, v in [("name", name), ("price", price), ("description", description)]
            if v is not None
        },
    }
