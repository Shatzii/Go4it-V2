// Shims to avoid type-checking heavy backend/utility implementations during frontend builds
declare module "@/lib/*" {
  const anyExport: any;
  export = anyExport;
}

declare module "lib/*" {
  const anyExport: any;
  export = anyExport;
}

declare module "@/shared/*" {
  const anyExport: any;
  export = anyExport;
}

declare module "shared/*" {
  const anyExport: any;
  export = anyExport;
}
