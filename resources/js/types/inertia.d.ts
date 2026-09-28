// Las props compartidas (HandleInertiaRequests::share) quedan tipadas en TODO `usePage().props`.
declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: App.Data.Shared.SharedData;
        errorValueType: string;
    }
}

export {};
