import { registerAs } from "@nestjs/config";

export const databaseToken = "database";

export const databaseConfig = registerAs(databaseToken, () => ({
  host: process.env.DATABASE_HOST,
  port: Number.parseInt(process.env.DATABASE_PORT || "0"),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  logging: true,
  type: "mysql",
}));
