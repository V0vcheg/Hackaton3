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
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export function UploadDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    Upload Files
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                        Use the form below to upload files. You can drag and drop files or select them from your device.
                        <br/>
                        Supported formats: images, documents, and more.
                    </DialogDescription>
                </DialogHeader>

                <Separator/>
                <div>
                     <UppyUploader height={"400px"} width={"100%"}/>
                </div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}