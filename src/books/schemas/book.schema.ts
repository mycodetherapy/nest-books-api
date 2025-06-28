import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    },
  },
})
export class Book {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [String], required: true })
  authors: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  favorites: Types.ObjectId[];

  @Prop({ required: true })
  fileCover: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  filePath: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
  comments: Types.ObjectId[];
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

BookSchema.index({ title: 'text', authors: 'text' });
BookSchema.index({ userId: 1 });
BookSchema.index({ favorites: 1 });
