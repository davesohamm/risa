export interface ColumnMetadata {
    column: string;
    type: string;
}

export interface TableMetadata {
    tableName: string;
    tableColumns: ColumnMetadata[];
    amount_to_generate: number;
}

export interface QueryResult {
    nlquery: string;
    sqlquery: string;
}