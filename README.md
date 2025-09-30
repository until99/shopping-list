# Shopping List Application

A full-stack shopping list application built with FastAPI backend and vanilla JavaScript frontend. The application allows users to manage their shopping items with features like adding, updating, deleting, and marking items as purchased.

## Features

- ✅ Add new shopping items with details (name, price, description, amount, category)
- ✅ View all shopping items with pagination
- ✅ Filter items by purchased status (show only purchased or unpurchased items)
- ✅ Update existing items
- ✅ Delete items from the list
- ✅ Mark items as purchased/unpurchased
- ✅ Categorize items (Fruits, Vegetables, Dairy, Meat)
- ✅ Real-time updates with a responsive web interface

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **PostgreSQL** - Database for storing shopping items
- **Pydantic** - Data validation using Python type annotations
- **psycopg2** - PostgreSQL adapter for Python

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling and responsive design
- **Vanilla JavaScript** - Interactive functionality
- **Dialog API** - Modal dialogs for adding/updating items

## Project Structure

```
shopping-list/
├── api/                    # Backend API
│   ├── main.py            # FastAPI application
│   ├── pyproject.toml     # Python dependencies
│   └── database/          # Database modules
│       ├── __init__.py
│       └── postgresql.py  # PostgreSQL connection utilities
├── app/                   # Frontend application
│   ├── index.html         # Main HTML page
│   ├── app.js            # JavaScript functionality
│   └── styles.css        # CSS styles
└── README.md             # This file
```

## Prerequisites

- Python 3.13+
- PostgreSQL database
- Web browser (for frontend)

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database
2. Create the required table:
```sql
CREATE SCHEMA IF NOT EXISTS vitalis;

CREATE TABLE vitalis.items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    amount INTEGER DEFAULT 0,
    category VARCHAR(100),
    purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Backend Setup

1. Navigate to the API directory:
```bash
cd api
```

2. Install dependencies using uv:
```bash
uv sync
```

3. Configure your database connection in `database/postgresql.py`

4. Run the FastAPI server:
```bash
uv run fastapi dev main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the app directory:
```bash
cd app
```

2. Serve the files using a local server (e.g., Python's built-in server):
```bash
python -m http.server 3000
```

Or open `index.html` directly in your web browser.

## API Endpoints

- `GET /` - Health check
- `GET /items/` - Get all items (with pagination and optional filtering)
  - Query parameters:
    - `page` (int, default: 1) - Page number for pagination
    - `limit` (int, default: 10) - Number of items per page
    - `purchased` (bool, optional) - Filter by purchased status (true/false)
- `GET /items/{item_id}` - Get specific item
- `POST /items/` - Create new item
- `PUT /items/{item_id}` - Update existing item
- `DELETE /items/{item_id}` - Delete item

### Example API Usage

**Create a new item:**
```bash
curl -X POST "http://localhost:8000/items/" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Apples",
       "price": 2.99,
       "description": "Fresh red apples",
       "amount": 6,
       "category": "fruits"
     }'
```

**Get all items:**
```bash
curl "http://localhost:8000/items/?page=1&limit=10"
```

**Get only unpurchased items:**
```bash
curl "http://localhost:8000/items/?purchased=false"
```

**Get only purchased items:**
```bash
curl "http://localhost:8000/items/?purchased=true&page=1&limit=5"
```

## Development

The application uses CORS middleware to allow requests from any origin during development. For production, configure appropriate CORS settings.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).