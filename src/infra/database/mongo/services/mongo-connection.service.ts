import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConnectionService {
  uri: string;

  constructor(config: ConfigService) {
    this.uri = config.get<string>('MONGO_URL') ?? '';

    this.validate();
  }

  private validate(): void {
    if (!this.uri) throw new Error('MongoOptions requires uri');
  }
}
