import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ForceOperationRequestDto {
    @ApiProperty({ type: Boolean, default: false })
    @IsOptional()
    @IsBoolean()
    force = false;
}
