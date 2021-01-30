export const readBuffer = (blob: Blob) => {
    return new Promise<Buffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("abort", reject);
        reader.addEventListener("error", reject);
        reader.addEventListener("load", () => {
            resolve(Buffer.from(reader.result as ArrayBuffer));
        });
        reader.readAsArrayBuffer(blob);
    });
};
