declare module 'vm-browserify' {
  export function createContext(context?: any): any;
  export function runInContext(code: string, context: any): any;
}