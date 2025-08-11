import { Logger, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Model } from 'mongoose';
import { MongoConnectionService } from './services/mongo-connection.service';

@Module({
  providers: [MongoConnectionService, ConfigService],
})
export class MongoModule implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger('MongoDbModule');

  constructor(private readonly connectionService: MongoConnectionService) {}

  async onApplicationBootstrap(): Promise<void> {
    await mongoose
      .connect(this.connectionService.uri, {
        autoIndex: true,
      })
      .then(async () => {
        this.logger.verbose(`MongoDb connected successfully -> ${this.connectionService.uri} `);

        await this.syncIndex();
      })
      .catch((error) => {
        this.logger.error(`MongoDb connection error: -> ${error}: ${this.connectionService.uri}`);
      });
  }

  async onApplicationShutdown(): Promise<void> {
    await mongoose.disconnect();
  }

  private async syncIndex(): Promise<void> {
    const models: Model<any>[] = [];

    if (!models.length) {
      return;
    }

    const results = await Promise.allSettled(
      models.map(async (model) => {
        await model.syncIndexes();
      }),
    );

    results.forEach((result, index) => {
      const modelName = models[index].modelName;
      if (result.status === 'fulfilled') {
        this.logger.verbose(`${modelName}: indexes synced successfully`);
      } else {
        this.logger.error(`${modelName}: Failed to sync indexes - ${result.reason}`);
      }
    });
  }
}
