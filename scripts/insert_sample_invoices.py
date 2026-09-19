import sqlite3
import json
import uuid
import datetime

db_path = 'mindgest-pos-dev.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Sample items from earlier context
items = [
    [{"id": "item1", "name": "Pão"}, {"id": "item2", "name": "Queijo"}],
    [{"id": "item1", "name": "Pão"}, {"id": "item2", "name": "Queijo"}],
    [{"id": "item1", "name": "Pão"}, {"id": "item2", "name": "Queijo"}],
    [{"id": "item1", "name": "Pão"}, {"id": "item2", "name": "Queijo"}],
    [{"id": "item3", "name": "Café"}, {"id": "item4", "name": "Leite"}],
    [{"id": "item3", "name": "Café"}, {"id": "item4", "name": "Leite"}],
    [{"id": "item3", "name": "Café"}, {"id": "item4", "name": "Leite"}],
    [{"id": "item1", "name": "Pão"}, {"id": "item2", "name": "Queijo"}, {"id": "item3", "name": "Café"}, {"id": "item4", "name": "Leite"}],
    [{"id": "item1", "name": "Pão"}, {"id": "item2", "name": "Queijo"}, {"id": "item3", "name": "Café"}],
    [{"id": "item5", "name": "Sumo"}],
    [{"id": "item3", "name": "Café"}, {"id": "item5", "name": "Sumo"}]
]

# Insert sample payloads using exactly the existing 4 columns we saw (plus id makes 5 but let's just do id, type, payload, created_at)
for t_items in items:
    doc_id = str(uuid.uuid4())
    payload = {
        "status": "NORMAL", # Kept in JSON payload as needed by the actual train_model filter we just added
        "items": t_items
    }
    cursor.execute('''
        INSERT INTO offline_documents (id, type, payload, created_at)
        VALUES (?, ?, ?, ?)
    ''', (doc_id, 'invoice-receipt', json.dumps(payload), datetime.datetime.now().isoformat()))

conn.commit()
conn.close()

print("Sample invoices inserted.")
