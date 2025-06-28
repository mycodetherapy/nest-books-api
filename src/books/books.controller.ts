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
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import {
  createBookSchema,
  updateBookSchema,
  bookIdParamSchema,
} from './schemas/validation.schemas';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller({
  path: 'books',
  version: '1',
})
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll() {
    const books = await this.booksService.findAll();
    if (!books.length) throw new NotFoundException('No books found');
    return books;
  }

  @Get(':id')
  @UsePipes(new JoiValidationPipe(bookIdParamSchema))
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(createBookSchema))
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new JoiValidationPipe(bookIdParamSchema)) id: string,
    @Body(new JoiValidationPipe(updateBookSchema)) updateBookDto: UpdateBookDto,
  ) {
    const updatedBook = await this.booksService.update(id, updateBookDto);
    if (!updatedBook) throw new NotFoundException('Book not found');
    return updatedBook;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(bookIdParamSchema))
  async remove(@Param('id') id: string) {
    const deletedBook = await this.booksService.remove(id);
    if (!deletedBook) throw new NotFoundException('Book not found');
    return { message: 'Book deleted successfully' };
  }
}
