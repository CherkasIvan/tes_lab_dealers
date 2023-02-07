export interface BluelinkDeviceInterface {
    /** VIN автомобиля */
    vin: string;
    /** Дата активации bluelink */
    activationDate: Date;
    /** Информация по автомобилю */
    carLineDesc: string;
    /** Расширенная информация по автомобилю */
    carDesc: string;
    /** Номер телефона пользователя */
    phone: string;
    /** OCN код */
    bodyCode: string;
    /** Статус устройства blue */
    status: string;
    /** Статус на русском */
    mobikeyStatus: string;
}
