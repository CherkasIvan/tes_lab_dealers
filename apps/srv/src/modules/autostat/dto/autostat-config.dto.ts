import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class AutostatConfigDto {
    [key: string]: string | number | undefined;
    @IsString()
    @IsDefined()
    authUrl!: string;

    @IsString()
    @IsDefined()
    dataUrl!: string;

    @IsString()
    @IsDefined()
    login!: string;

    @IsString()
    @IsDefined()
    password!: string;

    @IsNumber()
    @IsOptional()
    cacheExpirationSeconds?: number;
}
