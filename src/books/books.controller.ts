import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '../interfaces/book.interface';
import { CreateBookDto, UpdateBookDto, BookIdParamDto } from './dto/book.dto';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import {
  createBookSchema,
  updateBookSchema,
  bookIdParamSchema,
} from './schemas/book.schema';

@Controller({ path: 'books', version: '1' })
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(): Book[] {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  getBookById(
    @Param(new JoiValidationPipe(bookIdParamSchema)) params: BookIdParamDto,
  ) {
    const book = this.booksService.getBookById(params.id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createBookSchema))
  createBook(@Body() bookData: CreateBookDto): Book {
    return this.booksService.createBook(bookData);
  }

  @Put(':id')
  updateBook(
    @Param(new JoiValidationPipe(bookIdParamSchema)) params: BookIdParamDto,
    @Body(new JoiValidationPipe(updateBookSchema)) updateData: UpdateBookDto,
  ) {
    const updatedBook = this.booksService.updateBook(params.id, updateData);
    if (!updatedBook) throw new NotFoundException('Book not found');
    return updatedBook;
  }

  @Delete(':id')
  deleteBook(
    @Param(new JoiValidationPipe(bookIdParamSchema)) params: BookIdParamDto,
  ) {
    const isDeleted = this.booksService.deleteBook(params.id);
    if (!isDeleted) throw new NotFoundException('Book not found');
    return { message: 'Book deleted' };
  }
}
