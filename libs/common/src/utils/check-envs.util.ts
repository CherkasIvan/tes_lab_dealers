export function checkEnvs(envValue: unknown, envErrMsg: string): void {
    if (!envValue) {
        throw new Error(`ENV: ${envErrMsg} not found. Check '.env' file or server variables.`);
    }
}
