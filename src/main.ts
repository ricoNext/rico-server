import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  const config = new DocumentBuilder()
    .setTitle("Rico Server")
    .setDescription("Rico Server API description")
    .setVersion("1.0")
    .addTag("Rico Server")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("swagger", app, documentFactory);
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
