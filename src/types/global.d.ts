// Global type declarations to prevent TypeScript from looking for implicit type libraries

// Prevent TypeScript from treating directory names as type libraries
// These are Next.js directory names that TypeScript might try to auto-include
declare module 'apps' {
    const content: any;
    export default content;
}

declare module 'pages' {
    const content: any;
    export default content;
}

// Re-export mapbox-gl types from the installed @types package
declare module 'mapbox-gl' {
    import mapboxgl from 'mapbox-gl';
    export = mapboxgl;
    export as namespace mapboxgl;
}
