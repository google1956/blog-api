import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Authorization } from './guards/authorization.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiBearerAuth()
  @Authorization(true)
  getHello(): string {
    return this.appService.getHello();
  }
}
