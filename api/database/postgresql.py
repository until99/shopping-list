import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv("HOST"),
        port=os.getenv("PORT"),
        dbname=os.getenv("DBNAME"),
        user=os.getenv("DBUSER"),
        password=os.getenv("PASSWORD"),
        sslmode="require",
    )
    return conn


def get_db_cursor(conn):
    return conn.cursor()


def close_db_connection(conn):
    conn.close()


def close_db_cursor(cursor):
    cursor.close()
