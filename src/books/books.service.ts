import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<BookDocument | null> {
    return this.bookModel.findById(id).exec();
  }

  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<BookDocument | null> {
    return this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<BookDocument | null> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
