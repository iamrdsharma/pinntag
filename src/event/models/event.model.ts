import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventDocument = Event & Document;
@Schema()
export class Event {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  date: Date;
  @Prop()
  address: string;
  @Prop()
  city: string;
  @Prop()
  country: string;
  @Prop()
  image: string;
  @Prop()
  user: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
