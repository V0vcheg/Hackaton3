'use client';

import {Dashboard} from "@uppy/react";
import {Uppy} from "@uppy/core";
import {useState} from "react";
import Xhr from '@uppy/xhr-upload';
import {toast} from "sonner";
import {queryClient} from "@/lib/query";

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
    //TODO : get user info
    const userId = '12345'; // Replace with actual user ID logic
    const [uppy] = useState(() => createUppyInstance(userId));

    return (
        <Dashboard uppy={uppy} width={width} height={height}/>
    )
}