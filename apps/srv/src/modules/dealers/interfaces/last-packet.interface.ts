export interface LastPacketInterface {
    /** Широта */
    latitude: number;
    /** Долгота */
    longitude: number;
    /** Скорость, км/ч */
    speed: number;
    /** Дата создания пакета данных */
    packetTime: Date;
    /** Пробег, км */
    mileage: number;
    /** Стиль вождения */
    drivingStyle: number;
    /** Подключено ли устройство к серверу */
    connected: boolean;
    /** Напряжение аккумулятора, В */
    batteryVoltage: number | null;
    /** Моточасы, ч */
    motoHours: number;
}
