'use client';

import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { AppFile } from "@/types/files.types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FilesCols } from "@/components/grid/FilesCols";
import { useMemo, useEffect, useRef } from "react";
import {GridApi, themeQuartz} from "ag-grid-community";
import {FileRenderer} from "@/components/grid/FileRenderer";
import {initializeAgGrid} from "@/lib/agGrid";
import {Button} from "@/components/ui/button";



export default function FilesGrid() {
    initializeAgGrid()
    const gridApiRef = useRef<GridApi | null>(null);
    const userId = '12345'; // TODO : Replace with actual user ID logic

    const { data: files, isFetching, isError, error } = useQuery<AppFile[]>({
        queryKey: ['files'],
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryFn: async () => await api(`/api/files?userId=${userId}`, 'GET'),
    });

    useEffect(() => {
        if (isError) {
            toast.error('Failed to fetch files');
            console.error('Query error:', error);
        }
    }, [isError, error]);

    const gridOptions: AgGridReactProps<AppFile> = useMemo(() => ({
        columnDefs: FilesCols,
        // *** CHANGE 1: Use the raw `files` data directly ***
        rowData: files,
        theme: themeQuartz,
        loading: isFetching,
        treeData: true,
        animateRows: true,
        groupDefaultExpanded: 1,
        getDataPath: (data: AppFile) => {
            const pathParts = data.key.split('/').filter(p => p);
            return pathParts.slice(2);
        },
        autoGroupColumnDef: {
            headerName: 'File',
            minWidth: 350,
            cellRendererParams: {
                suppressCount: true,
                innerRenderer: FileRenderer,
            },
            field: 'name',
        },

        rowSelection: {
            mode: 'multiRow',
            suppressRowClickSelection: true, // Prevents row selection on click
        },
        pagination: true,
        paginationPageSize: 50,
        defaultColDef: {
            flex: 1,
            sortable: true,
            filter: true,
            resizable: true,
        },
        getRowId: (params) => params.data.key,
        onGridReady: (params) => {
            gridApiRef.current = params.api;
        },
        loadingOverlayComponent: () => <div className="flex items-center justify-center p-4">Loading files...</div>,
        noRowsOverlayComponent: () => <div className="flex items-center justify-center p-4">No files found</div>,
        getContextMenuItems: (params) => {
            if (params.node?.group) {
                return [{
                    name: params.node.expanded ? 'Collapse Folder' : 'Expand Folder',
                    action: () => params.node?.setExpanded(!params.node.expanded)
                }];
            }
            if (params.node && !params.node.group && params.node.data) {
                return [{
                    name: 'Download File',
                    action: () => window.open(params.node?.data?.downloadUrl, '_blank')
                }];
            }
            return [];
        }
    }), [files, isFetching]);

    return (
        <div className="h-[60vh] w-full">
            <div className="mb-4 flex gap-2">
                <Button
                    onClick={() => gridApiRef.current?.expandAll()}
                >
                    Expand All
                </Button>
                <Button
                    variant={"outline"}
                    onClick={() => gridApiRef.current?.collapseAll()}
                >
                    Collapse All
                </Button>
            </div>
            <AgGridReact<AppFile>
                {...gridOptions}
            />
        </div>
    );
}