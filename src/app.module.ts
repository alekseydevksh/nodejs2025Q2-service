import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [UserModule, TrackModule, ArtistModule],
})
export class AppModule {}
