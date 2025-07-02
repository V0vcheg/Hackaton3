// src/components/grid/FilesCols.tsx

import { AppFile } from "@/types/files.types";
import { ColDef } from "ag-grid-community";

const typeMap: { [key: string]: string } = {
    'application/pdf': 'PDF Document',
    'image/png': 'PNG Image',
    'image/jpeg': 'JPEG Image',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
    'text/plain': 'Text File',
    'text/javascript': 'JavaScript File',
    'text/csv': 'CSV File',
    'video/mp4': 'MP4 Video',
    'application/zip': 'ZIP Archive',
};

export const FilesCols: ColDef<AppFile>[] = [
    {
        field: 'size',
        headerName: 'Size',
        valueFormatter: (params) => {
            if (params.node?.group) {
                return '';
            }
            const bytes = params.value;
            if (bytes == null) return '';
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 Bytes';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
        },
        width: 120,
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 140,
        valueFormatter: (params) => {
            if (params.node?.group) return 'Folder';
            if (!params.value) return '';


            return typeMap[params.value] || params.value;
        }
    },
    {
        field: 'lastModified',
        headerName: 'Last Modified',
        width: 180,
        valueFormatter: (params) => {
            if (params.node?.group) return '';
            if (!params.value) return '';
            return new Date(params.value).toLocaleString();
        },
        sort: 'desc'
    }
];