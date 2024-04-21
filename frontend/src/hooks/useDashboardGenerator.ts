import { useState } from "react";
import { ChartConfiguration } from 'chart.js';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useDashboardGenerator = (databaseSchema: any, tableName: string) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sqlQueries, setSqlQueries] = useState([]);
    const [loadingCharts, setLoadingCharts] = useState(false);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const [chartConfigs, setChartConfigs] = useState<any>([]);


    const generateDashboard = async () => {
        try {
            setHasStarted(true);
            console.log({databaseSchema},"line number 100")
            if (!databaseSchema.length) return;
            const selectedTable = databaseSchema.find((table:any) => table.name === tableName);
            console.log({selectedTable})
            setIsLoading(true);
            // two queries it will provide one will be sql queries and other will be natural language queries
            const queries = await fetch('api/query-generator', {
                method: 'POST',
                body: JSON.stringify({
                    tableName: tableName,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    tableColumns: selectedTable.fields.map((field: any) => {
                        const parsed = JSON.parse(JSON.stringify(field));
                        return {
                            column: parsed.name,
                            type: parsed.type
                        }
                    }),
                    amount_to_generate: 10
                })
            });
            setIsLoading(false);
            if (queries.status === 200) {
                const data = await queries.json();
                console.log({data})
                setSqlQueries(data);
                console.log(queries);
                // let's create charts from the data
                setLoadingCharts(true);
                console.log({sqlQueries})
                // generate charts
                
                const chartConfiguration = await fetch('api/chart-generator', {
                    method: 'POST',
                    body: JSON.stringify({
                        sqlQueries: data,
                        tableName: tableName
                    })
                });

                const chartConfig = await chartConfiguration.json();
                console.log({chartConfig})
                setChartConfigs(chartConfiguration)

            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingCharts(false);
            setIsLoading(false);
        }
    }


    return {
        hasStarted,
        isLoading,
        generateDashboard,
        sqlQueries,
        chartConfigs,
        loadingCharts
    }
}