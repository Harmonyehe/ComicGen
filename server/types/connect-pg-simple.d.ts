declare module 'connect-pg-simple' {
  import session from 'express-session';
  
  function connectPgSimple(session: typeof import('express-session')): new (options: {
    conString?: string;
    tableName?: string;
    schemaName?: string;
    pool?: any;
    pruneSessionInterval?: number;
    createTableIfMissing?: boolean;
  }) => session.Store;
  
  export default connectPgSimple;
}