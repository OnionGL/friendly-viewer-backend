import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {

    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })

    if(existUser) throw new BadRequestException(`Email ${existUser.email} уже используется`)

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password)
    })

    const token = this.jwtService.sign({email: createUserDto.email})

    return {user , token};
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {email}
    });
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id })
  }

  async updateUser(updateUser: Partial<UpdateUserDto>) {
    return await this.userRepository.update(updateUser.id , {...updateUser})
  }

  async createGuestUser() {
    return this.create({
      email: `guest${Date.now()}@gmail.com`,
      password: "rararawasdasd12312321"
    })
  }

}
