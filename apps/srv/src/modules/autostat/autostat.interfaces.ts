export namespace Autostat {
    /**
     * VIN-декодер
     *
     * * `vin` - VIN-номер
     */
    export interface VinDecoderRequest {
        vin: string;
    }

    /**
     * Расчет цены по Vin:
     *
     * * `vin` - VIN-номер
     * * `mileage` - пробег (0 = не учитывать, или целое значение в км)
     * * `gearboxkey` - тип коробки передач
     *      - 0 = не учитывать
     *      - 1 = МТ
     *      - 2 = АТ
     * * `statekey` - состояние
     *      - 0 = не учитывать
     *      - 1 - идеальное
     *      - 2 - хорошее
     *      - 3 - удовлетворительное
     */
    export interface GetPriceRequest {
        vin: string;
        mileage?: number;
        gearboxkey?: number;
        statekey?: number;
    }

    /**
     * Ответ на авторизацию
     */
    export interface AuthResponseDto {
        data?: {
            generateToken: {
                value: string;
            };
        };
        errors: {
            message: string;
            locations: unknown;
            extensions: unknown;
            errorType: string;
        }[];
        extensions?: unknown;
    }

    /**
     * Фактический ответ автостата на получение данных
     */
    export interface ResponseDto {
        data?: {
            executeSQLQuery: string;
        };
        errors: {
            message: string;
            locations: unknown;
            extensions: unknown;
            errorType: string;
        }[];
        extensions?: unknown;
    }

    /**
     * Результат парсинга `executeSQLQuery` из `ResponseDto` в запросах на получение данных
     */
    export interface ParsedResponse {
        headers: {
            COLUMNS: {
                value: string;
                children: [];
            }[];
        };
        cellSet: string[][];
        size: 1;
        offset: 0;
    }
}
