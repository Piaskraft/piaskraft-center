import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'Piaskraft Center API',
      status: 'ok',
      version: '0.1.0',
    };
  }
}