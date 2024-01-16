import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BusinessProfileStatus } from 'src/enums/user.enum';
import { User } from './user.model';

export class Menu {
  name: string;
  description: string;
  price: number;
}

export class Allergen {
  name: string;
  description: string;
}

export class OpeningHours {
  day: string;
  startTime: string;
  endTime: string;
}

export class Staff {
  name: string;
  role: string;
}

export class Review {
  user: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
}

export class Promotion {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export class Insurance {
  provider: string;
  policyNumber: string;
  coverageAmount: number;
}

export class TaxDetails {
  vatRate: number;
  corporationTaxRate: number;
}

export class Location {
    latitude: number;
    longitude: number;
}

export type BusinessProfileDocument = BusinessProfile & Document;
@Schema({ timestamps: true })
export class BusinessProfile {
  @Prop({
    required: true,
    enum: [
      BusinessProfileStatus.ACTIVE,
      BusinessProfileStatus.VERIFIED,
      BusinessProfileStatus.BLOCKED,
    ],
    default: BusinessProfileStatus.ACTIVE,
  })
  status: number;
  @Prop({ required: true, ref: 'User' })
  authorisedUser: mongoose.Types.ObjectId;
  @Prop({ required: true, ref: 'User' })
  createdBy: mongoose.Types.ObjectId;
  @Prop()
  image: string;
  @Prop({ required: true })
  name: string;
  @Prop({required: true})
  bio: string;
  @Prop({required: true})
  locations: Location[];
  @Prop({ required: true})
  countryCode: string;
  @Prop({ required: true})
  phone: number;
  @Prop({ required: true})
  email: string;
  @Prop()
  website: string;
  @Prop({ required: true})
  address: string;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop()
  country: string;
  @Prop({ required: true})
  postCode: number;
  @Prop()
  foundationYear: number;
  @Prop({ required: true })
  registrationNumber: string; // Business registration number
  @Prop()
  vatNumber: string; // VAT registration number, if applicable
  @Prop({ required: true })
  licenseNumber: string; // License number for serving alcohol
  @Prop({ required: true })
  foodHygieneRating: number; // Food Standards Agency (FSA) hygiene rating
  @Prop()
  menu: Menu[]; // Array of menu items with details
  @Prop()
  allergenInformation: Allergen[]; // Array of allergens present in the dishes
  @Prop({ required: true })
  openingHours: OpeningHours[]; // Array of opening hours for each day
  @Prop({ default: false })
  acceptsReservations: boolean; // Indicates if reservations are accepted
  @Prop()
  reservationPolicy: string; // Details about the reservation policy
  @Prop()
  paymentMethods: string[]; // Array of accepted payment methods
  @Prop()
  staff: Staff[]; // Array of staff members with details
  @Prop()
  reviews: Review[]; // Array of customer reviews and ratings
  @Prop()
  promotions: Promotion[]; // Array of ongoing promotions or discounts
  @Prop()
  covidSafetyMeasures: string[]; // Array of COVID-19 safety measures in place
  @Prop({ default: false })
  isWheelchairAccessible: boolean; // Indicates if the restaurant is wheelchair accessible
  @Prop()
  sustainabilityEfforts: string; // Details about sustainability and environmental responsibility
  @Prop()
  insuranceDetails: Insurance; // Details about public liability insurance
  @Prop({ type: TaxDetails })
  taxInformation: TaxDetails; // Details about tax compliance
  @Prop()
  healthAndSafetyPolicies: string[]; // Array of health and safety policies
  @Prop({ default: 0 })
  followersCount: number;
}

export const BusinessProfileSchema =
  SchemaFactory.createForClass(BusinessProfile);
