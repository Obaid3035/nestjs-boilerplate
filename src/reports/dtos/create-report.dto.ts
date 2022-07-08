import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(100000)
  price: number;

  @IsString()
  make: string;

  @IsNumber()
  @Min(1950)
  @Max(2050)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(100000)
  mileage: number;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsString()
  model: string;
}
