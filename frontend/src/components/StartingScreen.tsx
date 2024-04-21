import LoadingScreen from "@/components/LoadingSCreen";
import { useDashboardGenerator } from "@/hooks/useDashboardGenerator";
import { Fragment, useState } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function StartingScreen({ databaseSchema }: { databaseSchema: any }) {
    const [tableName, setTableName] = useState(databaseSchema[0].name);
    const { hasStarted, isLoading, generateDashboard, sqlQueries, chartConfigs, loadingCharts } = useDashboardGenerator(databaseSchema, tableName);
    console.log({hasStarted, isLoading, sqlQueries, chartConfigs, loadingCharts});
    return (
        <div className="container p-5">
            {!hasStarted ? (
                <Fragment>
                    <h1 className="text-2xl font-semibold flex items-center text-gray-900">
                        Risa
                    </h1>
                    <div className="flex flex-col space-y-5 mt-1.5">
                        <p className="leading-7">
                            LLM powered business analyst to analyse your
                            SQL and generate a dashboard.
                        </p>

                        <ol
                            className="div flex flex-col space-y-3 list-decimal list-inside text-gray-500 text-sm"
                        >
                            <li>Asks questions of data based on SQL schema</li>
                            <li>Generates SQL queries based on thoes questions</li>
                            <li>Queries database</li>
                            <li>Creates charts based on the results</li>
                        </ol>

                        <div className="mt-6 flex w-full">
                            <select
                                name="database-select"
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                value={tableName}
                                onChange={e => setTableName(e.target.value)}
                            >
                                <option disabled>Select database table...</option>
                                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                {databaseSchema.map((table: any) => (
                                    <option key={table.name} value={table.name}>
                                        {table.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={generateDashboard}
                            type="button"
                            className="mt-6 p-3 rounded-md bg-gray-900 disabled:bg-indigo-700 hover:bg-gray-800 hover:text-white transition-colors shadow-sm shadow-indigo-100 text-indigo-50 font-semibold"
                        >
                            Analyze 👀
                        </button>
                    </div>
                </Fragment>
            ) :
                (
                    <LoadingScreen hasStarted={hasStarted} chartConfigs={chartConfigs} naturalLanguageQueries={[]} sqlQueries={sqlQueries} isLoadingCharts={loadingCharts} />
                )
            }
        </div>
    )
}