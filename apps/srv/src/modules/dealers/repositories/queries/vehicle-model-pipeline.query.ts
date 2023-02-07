import { Document, Filter } from 'mongodb';
import { VehicleModel } from '../../models';

// eslint-disable-next-line max-lines-per-function
export const VEHICLE_MODEL_PIPELINE_QUERY = (filter: Filter<VehicleModel>): Document[] => {
    return [
        { $match: filter },
        {
            $lookup: {
                from: 'vehicles.last-packet',
                localField: 'vin',
                foreignField: 'vin',
                as: 'lastPacketRef',
            },
        },
        {
            $lookup: {
                from: 'dealers.vehicles',
                localField: 'vin',
                foreignField: 'vin',
                as: 'vehicleRelationRef',
            },
        },
        {
            $set: {
                dealerOfficeSapCodeTmp: '$vehicleRelationRef.dealerOfficeSapCode',
                dealerSapCodeTmp: '$vehicleRelationRef.dealerSapCode',
            },
        },
        {
            $lookup: {
                from: 'dealers.offices',
                localField: 'dealerOfficeSapCodeTmp',
                foreignField: 'sapCode',
                as: 'dealerOfficeRef',
            },
        },
        {
            $lookup: {
                from: 'dealers',
                localField: 'dealerSapCodeTmp',
                foreignField: 'sapCode',
                as: 'dealerRef',
            },
        },
        {
            $lookup: {
                from: 'autostat-report',
                localField: 'vin',
                foreignField: 'vin',
                as: 'autostatReportRef',
            },
        },
        {
            $lookup: {
                from: 'vehicles.ocn-info',
                localField: 'ocn',
                foreignField: 'ocn',
                as: 'ocnInfoRef',
            },
        },
        {
            $lookup: {
                from: 'vehicles.wa-info',
                localField: 'vin',
                foreignField: 'vin',
                as: 'waInfoRef',
            },
        },
        {
            $lookup: {
                from: 'vehicles.device-id',
                localField: 'vin',
                foreignField: 'vin',
                as: 'vehicleDeviceIdRef',
            },
        },
        {
            $set: {
                lastPacketRef: { $arrayElemAt: ['$lastPacketRef', 0] },
                dealerOfficeRef: { $arrayElemAt: ['$dealerOfficeRef', 0] },
                autostatReportRef: { $arrayElemAt: ['$autostatReportRef', 0] },
                vehicleRelationRef: { $arrayElemAt: ['$vehicleRelationRef', 0] },
                dealerRef: { $arrayElemAt: ['$dealerRef', 0] },
                ocnInfoRef: { $arrayElemAt: ['$ocnInfoRef', 0] },
                waInfoRef: { $arrayElemAt: ['$waInfoRef', 0] },
                vehicleDeviceIdRef: { $arrayElemAt: ['$vehicleDeviceIdRef', 0] },
            },
        },
        { $unset: ['dealerOfficeSapCodeTmp', 'dealerSapCodeTmp'] },
    ];
};
