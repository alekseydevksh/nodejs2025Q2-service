import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [UserModule, TrackModule],
})
export class AppModule {}
