import psycopg2


def get_db_connection():
    conn = psycopg2.connect("dbname=test user=postgres")
    return conn


def get_db_cursor(conn):
    return conn.cursor()


def close_db_connection(conn):
    conn.close()


def close_db_cursor(cursor):
    cursor.close()
