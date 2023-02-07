export interface WAVehicleInfoResponseDto {
    vehicle: WAVehicleInfo;
}

export interface WAVehicleInfo {
    vin: string;
    vin2: string;
    modelCode: string;
    sapModelCode: string;
    modelName: string;
    sapModelName: string;
    ocn: string;
    engineCode: string;
    engineName: string;
    colorCode: string;
    warrantyStartDate: string;
    warrantyExtendedDate: string;
    producedDate: string;
    retailDateSap: string;
    modelYear: string;
    transmission: string;
    currentMileage: string;
    plateNo: string;
    autolink: string;
    navi: string;
    loyalty: string;
    serviceCampaigns?: WAVehicleInfoServiceCampaign[];
    campNo: string;
    campNm: string;
}

export interface WAVehicleInfoServiceCampaign {
    campNo: string;
    ffFromDt: string;
    amPNM: string;
    anGCD: string;
    labors: string;
}
