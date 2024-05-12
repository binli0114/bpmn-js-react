// In a global.d.ts file or at the top of a TypeScript file

declare global {
    interface Window {
        hasChangeName: boolean;
        fromLocalFile: boolean;
    }
}

export {};
