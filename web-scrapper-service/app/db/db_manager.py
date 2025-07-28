import sqlite3

class DBManager:
    def __init__(self, db_name):
        self.db_name = db_name
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS requests (
                id TEXT PRIMARY KEY,
                status TEXT
            )
        ''')
        conn.commit()
        conn.close()

    def _get_conn(self):
        return sqlite3.connect(self.db_name)

    def insert_request(self, id, status):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO requests VALUES (?, ?)', (id, status))
        conn.commit()
        conn.close()

    def update_request(self, id, status):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute('UPDATE requests SET status = ? WHERE id = ?', (status, id))
        conn.commit()
        conn.close()

    def get_request(self, id):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM requests WHERE id = ?', (id,))
        row = cursor.fetchone()
        conn.close()
        return row

    def get_request_status(self, id):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute('SELECT status FROM requests WHERE id = ?', (id,))
        result = cursor.fetchone()
        conn.close()
        return result[0] if result else None
