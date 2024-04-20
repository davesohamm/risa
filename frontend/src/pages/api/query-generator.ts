import { QueryResult, TableMetadata } from '@/utils/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const tableMetadata: TableMetadata = req.body as TableMetadata;
    const tableColumnsStr = tableMetadata.table_columns.map(col => `${col.column} (${col.type})`).join(', ');
    const nlQueryPrompt = `You are looking at the SQL table called: ${tableMetadata.table_name}. ${tableColumnsStr}. Give me a JSON array of the top ${tableMetadata.amount_to_generate} questions you might want to ask of this table. They should be about varying topics. They shouldn't be answerable with only one thing.`;
    
    const nlQueryResponse = await fetch('http://localhost:11434/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: nlQueryPrompt })
    });
    const nlQueries: string[] = (await nlQueryResponse.json()).result.trim().split('\n');

    const queryResults: QueryResult[] = [];
    for (const nlQuery of nlQueries) {
      const sqlQueryPrompt = `The table name is: ${tableMetadata.table_name}. The database columns are: ${tableColumnsStr}. A user has made this request about a SQL query: "${nlQuery}". Identify and respond with the SQL query that would satisfy this request. Don't include any explanation of the query, just the query itself. Limit the page size to 10 records. Don't use as a name that is already a column name.`;
      const sqlQueryResponse = await fetch('http://localhost:11434/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: sqlQueryPrompt })
      });
      const sqlQueryResult: string = (await sqlQueryResponse.json()).result.trim();
      queryResults.push({ nlquery: nlQuery, sqlquery: sqlQueryResult });
    }

    res.status(200).json(queryResults);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}