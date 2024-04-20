
import StartingScreen from '@/components/StartingScreen';
import { Prisma } from '@prisma/client'
import { GetServerSideProps } from 'next';
import { useState } from "react";

// // Assuming useDashboardGenerator and useAskQuestion are custom hooks you've created
// import { useDashboardGenerator, useAskQuestion } from '../hooks'; 

export type schema = Prisma.DMMF.Model[];
const Dashboard = ({ schema }: { schema: schema }) => {


  return (
    <div className="flex flex-col items-center justify-center w-full text-gray-800 h-full">
      <StartingScreen databaseSchema={schema} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const schema = Prisma.dmmf.datamodel.models;
  return { props: { schema: JSON.parse(JSON.stringify(schema)) } };

};

export default Dashboard;

