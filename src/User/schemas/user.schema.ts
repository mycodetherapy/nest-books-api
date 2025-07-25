import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    sparse: true,
    unique: true,
    required: false,
    default: undefined,
  })
  username?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
