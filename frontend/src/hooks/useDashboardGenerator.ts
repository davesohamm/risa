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
            if (!databaseSchema.values.length) return;
            console.log(tableName)
            setIsLoading(true);
            // two queries it will provide one will be sql queries and other will be natural language queries
            const queries = await fetch('api/query-generator', {
                method: 'POST',
                body: JSON.stringify({
                    tableName: tableName,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    tableColumns: databaseSchema.values[0].fields.map((field: any) => {
                        const parsed = JSON.parse(JSON.stringify(field));
                        return {
                            column: parsed.name,
                            type: parsed.type
                        }
                    })
                })
            });
            setIsLoading(false);
            if (queries.status === 200) {
                const data = await queries.json();
                setSqlQueries(data);
                console.log(queries);
                // let's create charts from the data
                setLoadingCharts(true);

                // generate charts
                
                const chartConfiguration = await fetch('api/chart-generator', {
                    method: 'POST',
                    body: JSON.stringify({
                        sqlQueries: sqlQueries,
                        tableName: tableName
                    })
                });
                
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