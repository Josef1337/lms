/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** "false" leaves out print buttons, for hosts that block the print dialog. */
	readonly VITE_ALLOW_PRINT?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
