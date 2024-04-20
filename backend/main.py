from typing import Union
from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
import requests

app = FastAPI()

class ColumnMetadata(BaseModel):
    column: str
    type: str

class TableMetadata(BaseModel):
    table_name: str
    table_columns: List[ColumnMetadata]
    amount_to_generate: int = 10

class QueryResult(BaseModel):
    nlquery: List[str]
    sqlquery: List[str]
    
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/query-generator")
async def generate_queries(table_metadata: TableMetadata):
    # Generate natural language queries
    table_columns_str = ', '.join([f"{col.column} ({col.type})" for col in table_metadata.table_columns])
    nl_query_prompt = f"You are looking at the SQL table called: {table_metadata.table_name}. {table_columns_str}. Give me a JSON array of the top {table_metadata.amount_to_generate} questions you might want to ask of this table. They should be about varying topics. They shouldn't be answerable with only one thing."
    nl_query_response = requests.post("http://localhost:11434/generate", json={"prompt": nl_query_prompt}).json()
    nl_queries = nl_query_response['result'].strip().split('\n')

    # Generate SQL queries from natural language queries
    query_results = []
    for nl_query in nl_queries:
        sql_query_prompt = f"The table name is: {table_metadata.table_name}. The database columns are: {table_columns_str}. A user has made this request about a SQL query: \"{nl_query}\". Identify and respond with the SQL query that would satisfy this request. Don't include any explanation of the query, just the query itself. Limit the page size to 10 records. Don't use as a name that is already a column name."
        sql_query_response = requests.post("http://localhost:11434/generate", json={"prompt": sql_query_prompt}).json()
        query_results.append(QueryResult(nlquery=nl_query, sqlquery=sql_query_response['result'].strip()))

    return query_results
    
@app.post("/chart-generator")
async def generate_charts(sqlQueries: List[QueryResult], tableName: str):
    # Generate charts from the SQL queries
    chart_configs = []
    for sqlQuery in sqlQueries:
        chart_prompt = f"The table name is: {tableName}. The database columns are: {sqlQuery.sqlquery}. A user has made this request about a SQL query: \"{sqlQuery.nlquery}\". Identify and respond with the chart configuration that would satisfy this request. Don't include any explanation of the query, just the chart configuration itself. Limit the page size to 10 records. Don't use as a name that is already a column name."
        chart_response = requests.post("http://localhost:11434/generate", json={"prompt": chart_prompt}).json()
        chart_configs.append(chart_response['result'])

    return chart_configs