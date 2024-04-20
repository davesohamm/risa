import os
import dotenv
import psycopg2

# Load environment variables from .env file
dotenv.load_dotenv()


# export  postgres client
# pg_client = psycopg2.connect(
#     dbname= os.getenv("database"),
#     user=os.getenv("user"),
#     host=os.getenv("host"),
#     password=os.getenv("password"),
#     port=os.getenv("port"),
# )

pg_client = psycopg2.connect(
    dbname= "risa",
    user="postgres",
    host="localhost",
    password="postgres",
    port=5432,
)
