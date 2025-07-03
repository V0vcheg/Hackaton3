'use client';

import {Dashboard} from "@uppy/react";
import {Uppy} from "@uppy/core";
import {useState, useEffect} from "react";
import Xhr from '@uppy/xhr-upload';
import {toast} from "sonner";
import {queryClient} from "@/lib/query";
import { useDarkMode } from "@/hooks/useDarkMode";

type UppyUploaderProps = {
    width?: string;
    height?: string;
}

function createUppyInstance(userId: string) {
    return new Uppy({
        restrictions: {
            maxFileSize: 10000000, // 10 MB
            maxNumberOfFiles: 10,
            minNumberOfFiles: 1,
            allowedFileTypes: ['image/*', 'application/pdf', 'text/*'],
        },
    }).use(Xhr, {
        endpoint: '/api/upload',
        formData: true
    }).on('file-added', (file) => {
        file.meta.userId = userId; // Attach user ID to file metadata
    }).on('complete', () => {
        toast.success('Upload complete');
        queryClient.invalidateQueries({
            queryKey: ['files'],
        })
    })
}

export default function UppyUploader(
    {width = "100%", height = "100%"}: UppyUploaderProps
) {
    const { isDarkMode } = useDarkMode();
    //TODO : get user info
    const userId = '12345'; // Replace with actual user ID logic
    const [uppy] = useState(() => createUppyInstance(userId));

    // Appliquer les styles dark mode dynamiquement
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .uppy-Dashboard {
                background-color: ${isDarkMode ? '#1A1A22' : '#F8F7FB'} !important;
                border: 2px solid ${isDarkMode ? '#333333' : '#E5E5EA'} !important;
                border-radius: 8px !important;
            }
            
            .uppy-Dashboard-inner {
                background-color: ${isDarkMode ? '#1A1A22' : '#F8F7FB'} !important;
            }
            
            .uppy-Dashboard-dropFilesHereHint {
                color: ${isDarkMode ? '#F0F0F5' : '#222222'} !important;
                font-weight: 500 !important;
            }
            
            .uppy-Dashboard-browse {
                color: #6B1FB3 !important;
                font-weight: 600 !important;
            }
            
            .uppy-Dashboard-browse:hover {
                color: #5A1A99 !important;
            }
            
            .uppy-Dashboard-note {
                color: #6D6D85 !important;
            }
            
            .uppy-Dashboard-AddFiles {
                background-color: ${isDarkMode ? '#2A2A38' : '#FFFFFF'} !important;
                border: 2px dashed ${isDarkMode ? '#333333' : '#E5E5EA'} !important;
                border-radius: 8px !important;
            }
            
            .uppy-Dashboard-AddFiles:hover {
                border-color: #6B1FB3 !important;
                background-color: ${isDarkMode ? '#2A1E3F' : '#F8F7FB'} !important;
            }
            
            .uppy-Dashboard-Item {
                background-color: ${isDarkMode ? '#2A2A38' : '#FFFFFF'} !important;
                border: 1px solid ${isDarkMode ? '#333333' : '#E5E5EA'} !important;
                border-radius: 6px !important;
            }
            
            .uppy-Dashboard-Item-name {
                color: ${isDarkMode ? '#F0F0F5' : '#222222'} !important;
            }
            
            .uppy-Dashboard-Item-status {
                color: #6D6D85 !important;
            }
            
            .uppy-Dashboard-AddFiles-title {
                color: ${isDarkMode ? '#F0F0F5' : '#222222'} !important;
                font-weight: 600 !important;
            }
            
            .uppy-Dashboard-upload {
                background-color: #6B1FB3 !important;
                color: white !important;
                border: none !important;
                border-radius: 6px !important;
                font-weight: 500 !important;
                padding: 12px 24px !important;
            }
            
            .uppy-Dashboard-upload:hover {
                background-color: #5A1A99 !important;
            }
            
            .uppy-Dashboard-uploadCount {
                color: ${isDarkMode ? '#F0F0F5' : '#222222'} !important;
            }
            
            .uppy-StatusBar {
                background-color: ${isDarkMode ? '#2A2A38' : '#F8F7FB'} !important;
                border-top: 1px solid ${isDarkMode ? '#333333' : '#E5E5EA'} !important;
            }
            
            .uppy-StatusBar-content {
                color: ${isDarkMode ? '#F0F0F5' : '#222222'} !important;
            }
            
            .uppy-ProgressBar {
                background-color: ${isDarkMode ? '#333333' : '#E5E5EA'} !important;
            }
            
            .uppy-ProgressBar-fill {
                background-color: #6B1FB3 !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, [isDarkMode]);

    return (
        <Dashboard 
            uppy={uppy} 
            width={width} 
            height={height}
            theme={isDarkMode ? 'dark' : 'light'}
            proudlyDisplayPoweredByUppy={false}
            showProgressDetails={true}
            showLinkToFileUploadResult={false}
            locale={{
                strings: {
                    dropPasteFiles: 'Glissez vos fichiers ici ou %{browse}',
                    browse: 'parcourir',
                    uploadComplete: 'Téléchargement terminé',
                    uploadPaused: 'Téléchargement mis en pause',
                    resumeUpload: 'Reprendre le téléchargement',
                    pauseUpload: 'Mettre en pause',
                    retryUpload: 'Réessayer',
                    cancelUpload: 'Annuler',
                    xFilesSelected: {
                        0: '%{smart_count} fichier sélectionné',
                        1: '%{smart_count} fichiers sélectionnés'
                    },
                    uploadingXFiles: {
                        0: 'Téléchargement de %{smart_count} fichier',
                        1: 'Téléchargement de %{smart_count} fichiers'
                    },
                    processingXFiles: {
                        0: 'Traitement de %{smart_count} fichier',
                        1: 'Traitement de %{smart_count} fichiers'
                    }
                }
            }}
        />
    )
}