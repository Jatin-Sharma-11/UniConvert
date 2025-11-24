/* eslint-disable @typescript-eslint/no-explicit-any */
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type Action = {
    file: File;
    file_name: string;
    file_size: number;
    from: string;
    to: string | null;
    file_type: string;
    is_converting?: boolean;
    is_converted?: boolean;
    is_error?: boolean;
    url?: any;
    output?: any;
    progress?: number;
    startTime?: number;
};

export default async function convertFile(
    ffmpeg: FFmpeg,
    action: Action,
    onProgress: (progress: number) => void
): Promise<any> {
    const { file, to, file_name, file_type } = action;
    const input = file;
    const output = file_name.split(".").slice(0, -1).join(".") + "." + to;

    await ffmpeg.writeFile(input.name, await fetchFile(input));

    ffmpeg.on("progress", ({ progress }) => {
        onProgress(progress * 100);
    });

    // FFmpeg commands based on file type
    let command: string[] = [];

    if (file_type.includes("image")) {
        command = ["-i", input.name, output];
    } else if (file_type.includes("video")) {
        command = ["-i", input.name, "-q:v", "0", output];
    } else if (file_type.includes("audio")) {
        command = ["-i", input.name, "-q:a", "0", "-map", "a", output];
    }

    await ffmpeg.exec(command);

    const data = await ffmpeg.readFile(output);
    const blob = new Blob([data as any], { type: file_type.split("/")[0] + "/" + to });
    const url = URL.createObjectURL(blob);

    return { url, output };
}
