import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
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
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
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
