import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { GeozoneAddContract } from '@mobility/amqp-contracts';
import GeoZoneType = GeozoneAddContract.GeoZoneType;

export class AddBaseGeoZoneDto {
    @ApiProperty({
        description: 'Тип геозоны',
    })
    type!: GeoZoneType;

    @ApiProperty({
        description: 'Название геозоны',
    })
    @IsString()
    name!: string;

    @ApiProperty({
        description: 'Описание геозоны',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(5)
    description?: string;
}

export class AddPolygonGeoZoneDto extends AddBaseGeoZoneDto {
    @ApiProperty({
        description: 'Тип геозоны',
    })
    type!: GeoZoneType.Polygon;

    @ApiProperty({
        description:
            'Полигон в виде массива пар чисел latitude/longitude(широта/долгота), минимальная длинна массива = 3, первая и последняя точка должны совпадать',
    })
    coordinates!: number[][][];
}

export class AddCircleGeoZoneDto extends AddBaseGeoZoneDto {
    @ApiProperty({
        description: 'Тип геозоны',
    })
    type!: GeoZoneType.Circle;

    @ApiProperty({
        description: 'Центр круга',
        example: [49.6591902, 58.5929172],
    })
    @IsArray()
    @IsNumber(undefined, { each: true })
    @ArrayMinSize(2)
    center!: number[];

    @ApiProperty({
        description: 'Радиус круга в метрах',
        example: 250,
    })
    @IsNumber()
    radius!: number;
}
