from fastapi import FastAPI

from api.ping import ping as ping
from api.item import routes as item
from api.item.models import Base

from db import engine


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(ping.router)
app.include_router(item.router, prefix="/items", tags=["items"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
