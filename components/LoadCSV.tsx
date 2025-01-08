/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { SocialData } from '@/lib/types';
import React, { useEffect, useState } from 'react'
import Papa from 'papaparse';
import { LoaderCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { DataTable } from './DataTable';


const PostDistribution = dynamic(() => import('./PostDistribution').then(mod => mod.PostDistribution), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const EngagementDistribution = dynamic(() => import('./EngagementDistribution').then(mod => mod.EngagementDistribution), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
});

const transformCSVRow = (row: any): SocialData => ({
    post_id: String(row['Post_ID']),
    post_type: row['Post_Type'] as SocialData['post_type'],
    likes: Number(row['Likes']),
    shares: Number(row['Shares']),
    comments: Number(row['Comments']),
    date_posted: new Date(row['Date_Posted'])
});

const LoadCSV = () => {
    const [data, setData] = useState<SocialData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const loadCSV = async () => {
            try {
                const response = await fetch('/data.csv');
                if (!response.ok) throw new Error('Failed to fetch CSV');
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const transformedData = results.data
                            .filter((row: any) => row['Post_ID'])
                            .map(transformCSVRow);
                        setData(transformedData);
                        setIsLoading(false);
                    },
                    error: (error: Error) => {
                        setError(error.message);
                        setIsLoading(false);
                    }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load CSV');
                setIsLoading(false);
            }
        };

        loadCSV();
    }, []);

    if (error) return (
        <div className="w-full lg:w-2/3 p-4 text-red-500">Error loading data: {error}</div>
    );

    if (isLoading) return (
        <div className="w-full lg:w-2/3 p-4 text-center">
            <LoaderCircle className="animate-spin inline mr-2" />
            Loading data...
        </div>
    );

    if (!data.length) return (
        <div className="w-full lg:w-2/3 p-4">No data available</div>
    );


    return (
        <div className="bg-red-500 w-full lg:w-2/3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                <PostDistribution data={data} />
                <EngagementDistribution data={data} />
            </div>
            <div className="px-4 pb-4">
                <DataTable data={data} />
            </div>
        </div>
    )
}

export default LoadCSV