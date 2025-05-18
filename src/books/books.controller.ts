import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '../interfaces/book.interface';

@Controller({
  path: 'books',
  version: '1',
})
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(): Book[] {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  getBookById(@Param('id') id: string): Book | { message: string } {
    const book = this.booksService.getBookById(Number(id));
    return book || { message: 'Book not found' };
  }

  @Post()
  createBook(@Body() bookData: Omit<Book, 'id'>): Book {
    return this.booksService.createBook(bookData);
  }

  @Put(':id')
  updateBook(
    @Param('id') id: string,
    @Body() updateData: Partial<Book>,
  ): Book | { message: string } {
    const updatedBook = this.booksService.updateBook(Number(id), updateData);
    return updatedBook || { message: 'Book not found' };
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string): { message: string } {
    const isDeleted = this.booksService.deleteBook(Number(id));
    return { message: isDeleted ? 'Book deleted' : 'Book not found' };
  }
}
