import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  const mockBooksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockBook = {
    id: '67d419b8af0562473a260706',
    title: 'Test Book',
    description: 'Test Description',
    authors: ['Author 1', 'Author 2'],
    fileCover: 'cover.jpg',
    fileName: 'book.pdf',
    filePath: '/path/to/book.pdf',
    userId: '507f1f77bcf86cd799439011',
    views: 0,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/books/:id', () => {
    it('should return a single book', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/books/${mockBook.id}`)
        .expect(200);

      expect(response.body).toEqual(mockBook);
    });

    it('should throw 404 if book not found', async () => {
      const validButNonExistingId = '507f1f77bcf86cd799439012';
      mockBooksService.findOne.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/books/${validButNonExistingId}`)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: 'Book not found',
        error: 'Not Found',
      });
    });
  });

  describe('PUT /api/v1/books/:id', () => {
    it('should update a book', async () => {
      const updateBookDto = {
        title: 'Updated Title',
      };

      const updatedBook = { ...mockBook, ...updateBookDto };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const response = await request(app.getHttpServer())
        .put(`/api/v1/books/${mockBook.id}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body).toEqual(updatedBook);
    });

    it('should throw 404 if book not found', async () => {
      const validButNonExistingId = '507f1f77bcf86cd799439012';
      mockBooksService.update.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .put(`/api/v1/books/${validButNonExistingId}`)
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: 'Book not found',
        error: 'Not Found',
      });
    });
  });

  describe('DELETE /api/v1/books/:id', () => {
    it('should delete a book', async () => {
      mockBooksService.remove.mockResolvedValue(mockBook);

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/books/${mockBook.id}`)
        .expect(200);

      expect(response.body).toEqual({ message: 'Book deleted successfully' });
    });

    it('should throw 404 if book not found', async () => {
      const validButNonExistingId = '507f1f77bcf86cd799439012';
      mockBooksService.remove.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/books/${validButNonExistingId}`)
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: 'Book not found',
        error: 'Not Found',
      });
    });
  });
});
