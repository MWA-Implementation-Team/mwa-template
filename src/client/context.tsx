import { createContext } from "preact";
import { ReactNode } from "preact/compat";

export type ClientContextType = {
    username: string | null, // username if logged in, else null
};

export const ClientContext = createContext<ClientContextType>({
    username: null,
});

// ---

export type ClientContextWrapperProps = {
    value: ClientContextType,
    content: ReactNode,
};

export function ClientContextWrapper({ value, content }: ClientContextWrapperProps) {
    return (
        <>
            <ClientContext value={value}>
                {content}
            </ClientContext>
        </>
    );
}
