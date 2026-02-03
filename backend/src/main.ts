import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import { ALLOWED_ORIGINS } from './constant';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //setting allow origin logic
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  });

  //db connection retry logic 
  const prismaService = app.get(PrismaService);
  
  async function tryConnect() {
    try {
      await prismaService.$queryRaw`SELECT 1`;
      console.log('connected to DB');
    } catch (e) {
      console.log('supabase sleeping... retrying in 5s');
      setTimeout(tryConnect, 5000);
    }
  }

  tryConnect();


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
