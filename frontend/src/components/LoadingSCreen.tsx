import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationData from '../lottie/man-writing.json';

interface LoadingScreenProps {
  hasStarted: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
chartConfigs: any[];
  naturalLanguageQueries: string[];
  sqlQueries: { sqlQuery: string }[];
  isLoadingCharts: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  hasStarted,
  chartConfigs,
  naturalLanguageQueries,
  sqlQueries,
  isLoadingCharts,
}) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
const  [animationOptions, setAnimationOptions] = useState<any>({
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  });

  useEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
setAnimationOptions((prevOptions:any) => ({
      ...prevOptions,
      animationData: animationData,
    }));
  }, []);

  if (!hasStarted || chartConfigs.length > 0) return null;

  return (
    <div className="container p-6 relative overflow-hidden">
      {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
      <div className="h-64 w-full absolute top-0 left-0 bg-gradient-to-b from-white via-white via-85% to-transparent z-10"></div>
      <div className="w-full flex justify-center py-4 relative z-20">
        <Lottie options={animationOptions} height={192} width="100%" />
      </div>
      <div className="w-full flex flex-col-reverse overflow-hidden">
        <div className="flex flex-col space-y-4">
          <span className="comment-pill">
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              fill="currentColor"
              className="w-3 mr-1.5 text-gray-400"
            >
              <path d="M86.24 26.96A16.67 16.67 0 0 0 70 6.66c-2.55 0-4.95.63-7.12 1.66a19.98 19.98 0 0 0-35.08 5.12c-.38-.02-.74-.1-1.12-.1a16.67 16.67 0 0 0-16.35 19.8 16.6 16.6 0 0 0-6.99 13.52c0 9.21 7.46 16.67 16.67 16.67 3.77 0 7.21-1.3 10-3.42a16.58 16.58 0 0 0 13.34 6.75c2.7 0 5.2-.7 7.46-1.84A16.61 16.61 0 0 0 83.34 60a16.65 16.65 0 0 0 2.9-33.04z" />
              <path d="M43.33 78.33a8.33 8.33 0 1 1-16.66 0 8.33 8.33 0 0 1 16.66 0M23.33 88.33c0 6.67-10 6.67-10 0 0-6.66 10-6.66 10 0" />
            </svg>
            <span className="text-gray-400">Analysing your SQL schema...</span>
          </span>
          {naturalLanguageQueries.map((query) => (
            <span key={query} className="comment-pill">
              {query}
            </span>
          ))}
          {sqlQueries.map((query) => (
            <span key={query.sqlQuery} className="comment-pill">
              <span className="font-mono">{query.sqlQuery}</span>
            </span>
          ))}
          {isLoadingCharts && (
            <span className="comment-pill">
              <span className="flex items-center text-indigo-600">
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  className="w-3 mr-1.5"
                  fill="currentColor"
                >
                  <path d="M40.69 12A3 3 0 0 0 38 15v60a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V15a3 3 0 0 0-3-3H40.69zM44 18h12v54H44zm24.69 17A3 3 0 0 0 66 38v37a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V38a3 3 0 0 0-3-3H68.7zM72 41h12v31H72zM12.7 49A3 3 0 0 0 10 52v23a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V52a3 3 0 0 0-3-3H12.7zM16 55h12v17H16zM7.7 82A3 3 0 0 0 8 88h84a3 3 0 1 0 0-6H7.7z" />
                </svg>
                Generating charts...
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;