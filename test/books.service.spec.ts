import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BooksService } from '../src/books/books.service';
import { Book } from '../src/books/schemas/book.schema';
import { Model } from 'mongoose';

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<Book>;

  const mockBook = {
    _id: '67d419b8af0562473a260706',
    title: 'Test Book',
    description: 'Test Description',
    authors: ['Author 1', 'Author 2'],
    fileCover: 'cover.jpg',
    fileName: 'book.pdf',
    filePath: '/path/to/book.pdf',
    userId: '507f1f77bcf86cd799439011',
    views: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            prototype: {
              save: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('create', () => {
    it('should create and return a book (alternative implementation)', async () => {
      const createBookDto = {
        title: 'New Book',
        description: 'New Description',
        authors: ['New Author'],
        fileCover: 'new-cover.jpg',
        fileName: 'new-book.pdf',
        filePath: '/path/to/new-book.pdf',
        userId: '507f1f77bcf86cd799439012',
      };

      const mockCreatedBook = {
        ...createBookDto,
        _id: '67d419b8af0562473a260706',
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockCreatedBook as any);

      const result = await service.create(createBookDto);
      expect(result).toEqual(mockCreatedBook);
      expect(model.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockBook]),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBook),
      } as any);

      const result = await service.findOne(mockBook._id);
      expect(result).toEqual(mockBook);
      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });

  describe('update', () => {
    it('should update and return a book', async () => {
      const updateBookDto = { title: 'Updated Title' };
      const updatedBook = { ...mockBook, ...updateBookDto };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBook),
      } as any);

      const result = await service.update(mockBook._id, updateBookDto as any);
      expect(result).toEqual(updatedBook);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockBook._id,
        updateBookDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should delete and return a book', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBook),
      } as any);

      const result = await service.remove(mockBook._id);
      expect(result).toEqual(mockBook);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);
    });
  });
});
