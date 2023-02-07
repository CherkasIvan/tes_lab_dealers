import { IsArray, IsDefined, IsString } from 'class-validator';

export class CarSaleMailingConfigInterface {
    [key: string]: string | number | undefined | string[];
    @IsString()
    @IsDefined()
    path!: string;

    @IsArray()
    @IsString({ each: true })
    @IsDefined()
    mailingList!: string[];
}
