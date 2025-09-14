import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export type Response<T> = {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果已经是统一格式，直接返回
        if (data && typeof data === "object" && "success" in data) {
          return data;
        }

        return {
          success: true,
          data,
          message: "操作成功",
          timestamp: new Date().toISOString(),
        };
      })
    );
  }
}
