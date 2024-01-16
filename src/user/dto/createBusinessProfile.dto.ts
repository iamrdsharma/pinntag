import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Allergen,
  Insurance,
  Location,
  Menu,
  OpeningHours,
  TaxDetails,
} from '../models/businessProfile.model';

export class createBusinessProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsArray()
  locations: Location[];

  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsNumber()
  postCode: number;

  @IsOptional()
  @IsNumber()
  foundationYear: number;

  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @IsOptional()
  @IsString()
  vatNumber: string;

  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @IsNotEmpty()
  @IsNumber()
  foodHygieneRating: number;

  @IsOptional()
  @IsArray()
  menu: Menu[];

  @IsOptional()
  @IsArray()
  allergenInformation: Allergen[]; 

  @IsNotEmpty()
  @IsArray()
  openingHours: OpeningHours[];

  @IsOptional()
  @IsBoolean()
  acceptsReservations: boolean;

  @IsOptional()
  @IsString()
  reservationPolicy: string;

  @IsOptional()
  @IsArray()
  paymentMethods: string[];

  @IsOptional()
  @IsArray()
  covidSafetyMeasures: string[];

  @IsOptional()
  @IsBoolean()
  isWheelchairAccessible: boolean;

  @IsOptional()
  @IsString()
  sustainabilityEfforts: string;

  @IsOptional()
  @IsObject()
  insuranceDetails: Insurance;
  
  @IsOptional()
  @IsObject()
  taxInformation: TaxDetails; 

  @IsOptional()
  @IsArray()
  healthAndSafetyPolicies: string[];
}
