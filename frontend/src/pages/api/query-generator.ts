import { QueryResult, TableMetadata } from '@/utils/types';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let tableMetadata: TableMetadata = JSON.parse(req.body) as TableMetadata;
    // console.log({tableColumn: tableMetadata.tableColumns})
    const tableColumnsStr = tableMetadata.tableColumns.map(col => `${col.column} (${col.type})`).join(', ');
    const nlQueryPrompt = `You are looking at the SQL table called: ${tableMetadata.tableName}. ${tableColumnsStr}. Give me a JSON array of the top ${tableMetadata.amount_to_generate} questions you might want to ask of this table. They should be about varying topics. They shouldn't be answerable with only one thing.only give question in response`;
    // console.log({nlQueryPrompt})
    console.log("fetching data")
    const nlQueryResponse = await axios('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "model": "llama2",
        prompt: nlQueryPrompt,
        stream: false
      })
    });
    // console.log("hey i fetched the data")
    // console.log({nlQueryResponse: nlQueryResponse.})
    // console.log(nlQueryResponse.data)
    let nlQueries: string[] = (await nlQueryResponse.data?.response).trim().split('\n');
    console.log({ nlQueries })
    const queryResults: QueryResult[] = [];
    for (const nlQuery of nlQueries) {
      const sqlQueryPrompt = `The table name is: ${tableMetadata.tableName}. The database columns are: ${tableColumnsStr}. A user has made this request about a SQL query: "${nlQuery}". Identify and respond with the SQL query that would satisfy this request, just the query itself which runs in public schema. Limit the page size to 10 records. Don't use as a name that is already a column name, add public. before the table name, Don't include any explanation of the query, just the query itself.`;
      const sqlQueryResponse = await axios('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "model": "llama2",
          prompt: sqlQueryPrompt,
          stream: false
        })
      });
      console.log(sqlQueryResponse.data.response)
      const sqlQueryResult: string = (await sqlQueryResponse.data).response.trim();
      queryResults.push({ nlquery: nlQuery, sqlquery: sqlQueryResult });
    }

    res.status(200).json(queryResults);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}