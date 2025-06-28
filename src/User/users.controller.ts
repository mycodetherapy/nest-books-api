import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { userIdParamSchema } from './schemas/user-validation.schemas';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path: 'users',
  version: '1', // Добавляем версионирование
})
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationPipe(userIdParamSchema)) id: string,
  ) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', new JoiValidationPipe(userIdParamSchema)) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', new JoiValidationPipe(userIdParamSchema)) id: string,
  ) {
    return this.usersService.remove(id);
  }
}
