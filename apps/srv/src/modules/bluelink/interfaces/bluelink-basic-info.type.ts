export interface ConnectedBluelinkBasicInfoInterface {
    /** VIN авто */
    vin: string;

    /** Одометр */
    odometer: Odometr;

    /**  */
    resultcd: 'S';
}

export interface Odometr {
    /** Пробег */

    distanceVal: number;

    /**  */
    distanceUnit: string;

    /** Время запроса */
    timestamp: string;

    /**  */
    offset: number;
}

export interface DisconnectedBluelinkBasicInfoInterface {
    vin: string;
    resultcd: 'F';
    resultmsg: string;
}

export type BluelinkBasicInfoType = ConnectedBluelinkBasicInfoInterface | DisconnectedBluelinkBasicInfoInterface;

export interface BluelinkBasicInfoResponseInterface {
    basicinfo: BluelinkBasicInfoType[];
}
