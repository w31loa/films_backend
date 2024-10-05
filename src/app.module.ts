import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import PrismaModule from './common/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MovieStatusModule } from './movie-status/movie-status.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    AuthModule,
    PrismaModule,
    UserModule,
    MovieStatusModule,
    ReviewModule
  ],
  controllers: [],
  providers: [AppService, Logger],
})
export class AppModule {}
