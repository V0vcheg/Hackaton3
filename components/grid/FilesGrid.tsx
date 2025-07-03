'use client';

import {AgGridReact, AgGridReactProps} from "ag-grid-react";
import {AppFile} from "@/types/files.types";
import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";
import {toast} from "sonner";
import {FilesCols} from "@/components/grid/FilesCols";
import {useMemo, useEffect, useRef} from "react";
import {GridApi, themeQuartz} from "ag-grid-community";
import {FileRenderer} from "@/components/grid/FileRenderer";
import {initializeAgGrid} from "@/lib/agGrid";
import {Button} from "@/components/ui/button";
import {useDarkMode} from "@/hooks/useDarkMode";
import {useLanguage} from "@/hooks/useLanguage";

export default function FilesGrid() {
    initializeAgGrid()
    const gridApiRef = useRef<GridApi | null>(null);
    const {isDarkMode} = useDarkMode();
    const {t} = useLanguage();
    const userId = '12345'; // TODO : Replace with actual user ID logic

    const {data: filesResponse, isFetching, isError, error} = useQuery<{ files: AppFile[], count: number }>({
        queryKey: ['files'],
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        queryFn: async () => await api(`/api/files?userId=${userId}`, 'GET'),
    });

    // Extraire le tableau files de la réponse
    const files = filesResponse?.files || [];

    useEffect(() => {
        if (isError) {
            toast.error('Failed to fetch files');
            console.error('Query error:', error);
        }
    }, [isError, error]);

    const gridOptions: AgGridReactProps<AppFile> = useMemo(() => ({
        columnDefs: FilesCols,
        // Utiliser le tableau files extrait de la réponse
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
        loadingOverlayComponent: () => (
            <div className="flex items-center justify-center p-4 text-gray-600 dark:text-gray-400">
                {t('loadingFiles')}
            </div>
        ),
        noRowsOverlayComponent: () => (
            <div className="flex items-center justify-center p-4 text-gray-600 dark:text-gray-400">
                {t('noFilesFound')}
            </div>
        ),
        getContextMenuItems: (params) => {
            if (params.node?.group) {
                return [{
                    name: params.node.expanded ? t('collapseFolder') : t('expandFolder'),
                    action: () => params.node?.setExpanded(!params.node.expanded)
                }];
            }
            if (params.node && !params.node.group && params.node.data) {
                return [{
                    name: t('downloadFile'),
                    action: () => window.open(params.node?.data?.downloadUrl, '_blank')
                }];
            }
            return [];
        }
    }), [files, isFetching, t]);

    return (
        <div className={`h-[60vh] w-full ${isDarkMode ? 'dark' : ''}`}>
            <div className="mb-4 flex gap-2">
                <Button
                    onClick={() => gridApiRef.current?.expandAll()}
                    className="text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{backgroundColor: '#8C2CFF'}}
                >
                    {t('expandAll')}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => gridApiRef.current?.collapseAll()}
                    className="border-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                    {t('collapseAll')}
                </Button>
            </div>
            <div
                className="ag-theme-quartz w-full h-full"
                style={{
                    '--ag-background-color': isDarkMode ? '#1A1A22' : '#F8F7FB',
                    '--ag-header-background-color': isDarkMode ? '#2A1E3F' : '#FFFFFF',
                    '--ag-odd-row-background-color': isDarkMode ? '#2A2A38' : '#FFFFFF',
                    '--ag-row-hover-color': isDarkMode ? '#333333' : '#F0F0F5',
                    '--ag-selected-row-background-color': '#8C2CFF20',
                    '--ag-border-color': isDarkMode ? '#333333' : '#E5E5EA',
                    '--ag-foreground-color': isDarkMode ? '#F0F0F5' : '#222222',
                    '--ag-secondary-foreground-color': isDarkMode ? '#F0F0F5' : '#6D6D85',
                    '--ag-data-color': isDarkMode ? '#F0F0F5' : '#222222',
                    '--ag-header-foreground-color': isDarkMode ? '#F0F0F5' : '#222222',
                    '--ag-disabled-foreground-color': '#6D6D85',
                    '--ag-input-background-color': isDarkMode ? '#2A2A38' : '#F8F7FB',
                    '--ag-control-panel-background-color': isDarkMode ? '#2A1E3F' : '#FFFFFF',
                    '--ag-subheader-background-color': isDarkMode ? '#2A1E3F' : '#F8F7FB',
                    '--ag-active-color': '#8C2CFF',
                    '--ag-checkbox-checked-color': '#8C2CFF',
                } as React.CSSProperties}
            >
                <AgGridReact<AppFile>
                    {...gridOptions}
                />
            </div>
        </div>
    );
}