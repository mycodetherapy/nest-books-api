import { Injectable } from '@nestjs/common';
import { Book } from '../interfaces/book.interface';

@Injectable()
export class BooksService {
  private books: Book[] = [
    { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien' },
    { id: 2, title: '1984', author: 'George Orwell' },
  ];
  private lastId = 2;

  getAllBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find((book: Book) => book.id === id);
  }

  createBook(book: Omit<Book, 'id'>): Book {
    const newBook = { id: ++this.lastId, ...book };
    this.books.push(newBook);
    return newBook;
  }

  updateBook(id: number, updateData: Partial<Book>): Book | undefined {
    const index = this.books.findIndex((book: Book) => book.id === id);
    if (index === -1) return undefined;

    this.books[index] = { ...this.books[index], ...updateData };
    return this.books[index];
  }

  deleteBook(id: number): boolean {
    const initialLength = this.books.length;
    this.books = this.books.filter((book: Book) => book.id !== id);
    return this.books.length !== initialLength;
  }
}
