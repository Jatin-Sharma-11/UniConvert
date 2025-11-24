"use client";

import { Upload, File, X, Loader2, Download, RefreshCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useFFmpeg from "@/hooks/use-ffmpeg";
import convertFile, { Action } from "@/utils/convert";
import { Progress } from "@/components/ui/progress";

const extensions = {
    image: ["jpg", "jpeg", "png", "gif", "bmp", "webp", "ico", "tif", "tiff", "tga"],
    video: ["mp4", "m4v", "mp4v", "3gp", "3g2", "avi", "mov", "wmv", "mkv", "flv", "ogv", "webm", "h264", "264", "hevc", "265"],
    audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
};

function formatTime(seconds: number): string {
    if (!seconds || seconds < 0) return "Calculating...";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function Dropzone() {
    const { ffmpeg, loaded, isLoading } = useFFmpeg();
    const [actions, setActions] = useState<Action[]>([]);
    const [isHover, setIsHover] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setIsHover(false);
        if (acceptedFiles.length > 0) {
            const newActions: Action[] = acceptedFiles.map((file) => ({
                file,
                file_name: file.name,
                file_size: file.size,
                from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
                to: null,
                file_type: file.type,
                is_converting: false,
                is_converted: false,
                is_error: false,
                progress: 0,
                startTime: 0,
            }));
            setActions((prev) => [...prev, ...newActions]);
            toast.success("Files added successfully");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDragEnter: () => setIsHover(true),
        onDragLeave: () => setIsHover(false),
        accept: {
            "image/*": extensions.image.map((e) => "." + e),
            "video/*": extensions.video.map((e) => "." + e),
            "audio/*": extensions.audio.map((e) => "." + e),
        },
    });

    const updateAction = (fileName: string, to: string) => {
        setActions((prev) =>
            prev.map((action) => {
                if (action.file_name === fileName) {
                    return { ...action, to };
                }
                return action;
            })
        );
    };

    const removeAction = (fileName: string) => {
        setActions((prev) => prev.filter((a) => a.file_name !== fileName));
    };

    const convert = async () => {
        if (!loaded) {
            toast.error("FFmpeg is not loaded yet");
            return;
        }
        setIsConverting(true);
        const newActions = actions.map((action) => ({
            ...action,
            is_converting: true,
        }));
        setActions(newActions);

        for (const action of newActions) {
            if (action.to) {
                try {
                    setActions((prev) =>
                        prev.map((a) => {
                            if (a.file_name === action.file_name) {
                                return {
                                    ...a,
                                    is_converting: true,
                                    startTime: Date.now(),
                                };
                            }
                            return a;
                        })
                    );

                    const { url, output } = await convertFile(ffmpeg, action, (progress) => {
                        setActions((prev) =>
                            prev.map((a) => {
                                if (a.file_name === action.file_name) {
                                    return {
                                        ...a,
                                        progress: progress,
                                    };
                                }
                                return a;
                            })
                        );
                    });

                    setActions((prev) =>
                        prev.map((a) => {
                            if (a.file_name === action.file_name) {
                                return {
                                    ...a,
                                    is_converted: true,
                                    is_converting: false,
                                    url,
                                    output,
                                };
                            }
                            return a;
                        })
                    );
                } catch (err) {
                    console.error(err);
                    setActions((prev) =>
                        prev.map((a) => {
                            if (a.file_name === action.file_name) {
                                return {
                                    ...a,
                                    is_converted: false,
                                    is_converting: false,
                                    is_error: true,
                                };
                            }
                            return a;
                        })
                    );
                    toast.error(`Error converting ${action.file_name}`);
                }
            }
        }
        setIsDone(true);
        setIsConverting(false);
    };

    const download = (action: Action) => {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = action.url;
        a.download = action.output;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(action.url);
        document.body.removeChild(a);
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-5xl mx-auto p-6 flex flex-col items-center justify-center gap-6 min-h-[300px]">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading Core...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
            {/* Dropzone Area */}
            <div
                {...getRootProps()}
                className={`
            border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ease-in-out
            ${isHover || isDragActive
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                    }
          `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="p-4 rounded-full bg-background shadow-sm ring-1 ring-border">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold tracking-tight">
                            {isDragActive ? "Drop files here" : "Drag & Drop files here"}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            or click to select files
                        </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Badge variant="secondary" className="text-xs">
                            Images
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            Audio
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            Video
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Files List */}
            {actions.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Selected Files ({actions.length})</h2>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setActions([]);
                                setIsDone(false);
                            }}
                        >
                            Clear All
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {actions.map((action, i) => (
                            <Card key={i} className="group relative overflow-hidden">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        {!action.is_error && !action.is_converted && !action.is_converting ? (
                                            <File className="w-6 h-6 text-primary" />
                                        ) : action.is_converting ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        ) : action.is_converted ? (
                                            <File className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <X className="w-6 h-6 text-destructive" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{action.file_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(action.file_size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        {action.is_converting && (
                                            <div className="mt-2 space-y-2">
                                                <Progress value={action.progress} className="h-2.5" />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span className="font-medium">{Math.round(action.progress || 0)}%</span>
                                                    <span className="font-medium">
                                                        ETC: {action.progress && action.progress > 0 && action.startTime
                                                            ? formatTime((Date.now() - action.startTime) / action.progress * (100 - action.progress) / 1000)
                                                            : formatTime(0)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {action.is_converted ? (
                                        <Button variant="outline" size="sm" onClick={() => download(action)}>
                                            Download
                                            <Download className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <Select onValueChange={(value) => updateAction(action.file_name, value)}>
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Convert to" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {action.file_type.includes("image") && extensions.image.map((ext) => (
                                                    <SelectItem key={ext} value={ext}>{ext}</SelectItem>
                                                ))}
                                                {action.file_type.includes("video") && extensions.video.map((ext) => (
                                                    <SelectItem key={ext} value={ext}>{ext}</SelectItem>
                                                ))}
                                                {action.file_type.includes("audio") && extensions.audio.map((ext) => (
                                                    <SelectItem key={ext} value={ext}>{ext}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeAction(action.file_name);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        {isDone ? (
                            <Button size="lg" className="w-full md:w-auto" onClick={() => {
                                setActions([]);
                                setIsDone(false);
                            }}>
                                Convert New Files
                                <RefreshCcw className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                size="lg"
                                className="w-full md:w-auto"
                                onClick={convert}
                                disabled={isConverting || actions.some(a => !a.to)}
                            >
                                {isConverting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Converting...
                                    </>
                                ) : (
                                    "Convert All"
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
