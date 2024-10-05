import { Module } from '@nestjs/common';
import { MovieStatusService } from './movie-status.service';
import { MovieStatusController } from './movie-status.controller';
import PrismaModule from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MovieStatusController],
  providers: [MovieStatusService],
})
export class MovieStatusModule {}
