'use client'
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UppyUploader from "@/components/uploader/UppyUploader";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export function UploadDialog() {
    const { t } = useLanguage();
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="default"
                    className="text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ backgroundColor: '#8C2CFF' }}
                >
                    {t('uploadFiles')}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-[#1A1A22] border border-[#E5E5EA] dark:border-[#333333]">
                <DialogHeader>
                    <DialogTitle className="text-[#222222] dark:text-[#F0F0F5]">
                        {t('uploadFilesTitle')}
                    </DialogTitle>
                    <DialogDescription className="text-[#6D6D85]">
                        {t('uploadDescription')}
                        <br/>
                        {t('supportedFormats')}
                    </DialogDescription>
                </DialogHeader>

                <Separator className="bg-[#E5E5EA] dark:bg-[#333333]" />
                <div className="bg-[#F8F7FB] dark:bg-[#2A2A38] rounded-lg p-2">
                     <UppyUploader height={"400px"} width={"100%"}/>
                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button 
                            type="button" 
                            variant="outline"
                            className="border-2 text-[#222222] dark:text-[#F0F0F5] border-[#E5E5EA] dark:border-[#333333] bg-white dark:bg-[#2A2A38] hover:bg-[#F8F7FB] dark:hover:bg-[#333333]"
                        >
                            {t('close')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}