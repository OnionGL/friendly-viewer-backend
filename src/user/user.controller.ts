import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/:id')
  getUser(@Param("id") id: number) {
    return this.userService.findById(id)
  }

  @Post('/guest')
  createGuestUser() {
    return this.create({
      email: `guest${Date.now()}@gmail.com`,
      password: "121212121212121212"
    })
  }

  @Patch('/:id')
  patchUser(@Param("id") id:number , @Body() user: Partial<UpdateUserDto>) {

    const updateUser = {...user , id}

    return this.userService.updateUser(updateUser)
  }

}
