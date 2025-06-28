import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsMongoId,
  MinLength,
  MaxLength,
  ArrayMinSize,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(50, { each: true })
  authors: string[];

  @IsString()
  @IsNotEmpty()
  fileCover: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @MaxLength(50, { each: true })
  authors?: string[];

  @IsString()
  @IsOptional()
  fileCover?: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  filePath?: string;

  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  views?: number;
}
