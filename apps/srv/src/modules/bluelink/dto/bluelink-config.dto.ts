import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class BluelinkConfigDto {
    [key: string]: string | number | undefined;
    @IsString()
    @IsDefined()
    url!: string;
    @IsString()
    @IsDefined()
    hostHeader!: string;
    @IsString()
    @IsDefined()
    brandHeader!: string;

    @IsNumber()
    @IsOptional()
    cacheExpirationSeconds?: number;
}
