import {FileIcon} from "lucide-react";

interface FileRendererParams {
    value: string;
    node: {
        group: boolean;
    };
    data?: {
        downloadUrl?: string;
    };
}

export const FileRenderer = (params: FileRendererParams) => {
    const isFolder = params.node.group;
    const name  = params.value as string;

    if (isFolder) {
            return <span>{name}</span>;
    }
    return (
        <a
            href={params.data?.downloadUrl}
            className={'underline text-primary hover:text-blue-800'}
            target="_blank"
            rel="noopener noreferrer"
        >
            <FileIcon className="inline mr-2" />
             {name}
        </a>
    );
}