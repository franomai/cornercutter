/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MEASUREMENT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
