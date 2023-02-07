export interface ConnectedBluelinkGpsInfoInterface {
    /** VIN авто */
    vin: string;

    /** Широта */
    latitude: number;

    /** Долгота */
    longtitude: number;

    /** Высота над ур. моря */
    altitude: number;

    /** кол-во спутников */
    gpsType: string;

    /** 0 - направление на север далее 360 градусов по часовой стрелке */
    heading: number;

    /** скорость в момент запроса */
    speed: number;

    /** ед измерения скорости, 0 - мили , 1 - км */
    speedUnit: '0' | '1';

    /** код местности */
    hdop: number;

    /** код местности */
    pdop: number;

    /** Время */
    timestamp: string;
}

export interface DisconnectedBluelinkGpsInfoInterface {
    /** VIN авто */
    vin: string;
}

export type BluelinkGpsInfoType = ConnectedBluelinkGpsInfoInterface | DisconnectedBluelinkGpsInfoInterface;

export interface BluelinkGpsInfoResponseInterface {
    gpsinfo: BluelinkGpsInfoType;
}
