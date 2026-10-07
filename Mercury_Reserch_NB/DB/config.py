from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import datetime

client = None
def connect(uri: str):
    global client
    if client:
        return client
    
    client = MongoClient(uri, server_api=ServerApi("1"))
    client.admin.command("ping")
    print("MongoDB Connected!")
    return client


def get_collection():
    global client
    if client is None:
        raise RuntimeError("Mongo client not initialized. Call connect() first.")

    db = client["research_db"]
    return db["reports"]


def save_to_mongo(topic, depth, chunks):
    collection = get_collection()

    documents = []
    for chunk in chunks:
        documents.append({
            "topic": topic,
            "depth": depth,
            "chunk_index": chunk["index"],
            "text": chunk["text"],
            "embedding": chunk["embedding"],
            "created_at": datetime.datetime.utcnow()
        })

    collection.insert_many(documents)
    return len(documents)
