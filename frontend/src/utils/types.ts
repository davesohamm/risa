export interface ColumnMetadata {
    column: string;
    type: string;
}

export interface TableMetadata {
    table_name: string;
    table_columns: ColumnMetadata[];
    amount_to_generate: number;
}

export interface QueryResult {
    nlquery: string;
    sqlquery: string;
}