import { VehiclesPublisher } from '../../channels/vehicles/vehicles.publisher';
import { Injectable } from '@nestjs/common';
import { LastPacketInterface } from '../dealers/interfaces/last-packet.interface';

@Injectable()
export class VehicleService {
    constructor(private readonly vehiclePublisher: VehiclesPublisher) { }

    async getLastPacket(vin: string): Promise<LastPacketInterface | null> {
        const fullLastPacket = await this.vehiclePublisher.getLastPacket(vin);
        if (fullLastPacket) {
            return {
                latitude: fullLastPacket.latitude,
                longitude: fullLastPacket.longitude,
                speed: fullLastPacket.speed,
                packetTime: fullLastPacket.packetTime,
                mileage: fullLastPacket.mileage,
                drivingStyle: fullLastPacket.drivingStyle,
                connected: fullLastPacket.connected,
                batteryVoltage: fullLastPacket.batteryVoltage,
                motoHours: fullLastPacket.motoHours || 0,
            };
        }
        return null;
    }

    getVehicle(vin: string) {
        return this.vehiclePublisher.getVehicle(vin);
    }
}
