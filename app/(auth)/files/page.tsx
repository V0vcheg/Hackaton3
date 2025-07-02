'use client'

import FilesGrid from "@/components/grid/FilesGrid";
import {UploadDialog} from "@/components/uploader/UploadDialog";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import { useLanguage } from '@/hooks/useLanguage';

// Register all Community features
export default function FilesPage() {
    const { t } = useLanguage();
    
    return (
        <Card 
            className="border-0 shadow-lg bg-[#F8F7FB] dark:bg-[#1A1A22] border-[#E5E5EA] dark:border-[#333333]"
            style={{ 
                height: 'calc(100vh - 6rem)', // Hauteur augmentée pour plus d'espace
                minHeight: '700px' // Hauteur minimale pour assurer un bon affichage
            }}
        >
            <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[#222222] dark:text-[#F0F0F5]">
                            {t('fileManagerTitle')}
                        </h1>
                        <p className="text-xs mt-1 text-[#6D6D85]">
                            {t('fileManagerDescription')}
                        </p>
                    </div>
                    <UploadDialog/>
                </div>
            </CardHeader>
            <Separator className="bg-[#E5E5EA] dark:bg-[#333333]" />
            <CardContent className="h-full p-6 py-4">
                <FilesGrid/>
            </CardContent>
        </Card>
    )
}