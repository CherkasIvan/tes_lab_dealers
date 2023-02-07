export interface MongoDbConfig{
    /** Inject token for db service */
    injectToken: string;

    /** Environment contain url connect string */
    dbUrlEnvironment: string;
}
