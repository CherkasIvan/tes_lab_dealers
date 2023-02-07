import { LastPacketInterface } from '../interfaces/last-packet.interface';

export interface VehicleLastPacketModel {
    vin: string;
    simId: string | null;
    lastPacket: LastPacketInterface | null;
    lastUpdate: Date | null;
}
