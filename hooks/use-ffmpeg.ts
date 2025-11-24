"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { toast } from "sonner";

export default function useFFmpeg() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    const load = async () => {
        setIsLoading(true);
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on("log", ({ message }) => {
            if (messageRef.current) messageRef.current.innerHTML = message;
            console.log(message);
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(
                    `${baseURL}/ffmpeg-core.wasm`,
                    "application/wasm"
                ),
            });
            setLoaded(true);
            setIsLoading(false);
            toast.success("FFmpeg loaded successfully");
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toast.error("Failed to load FFmpeg");
        }
    };

    useEffect(() => {
        load();
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return { ffmpeg: ffmpegRef.current, loaded, isLoading };
}
