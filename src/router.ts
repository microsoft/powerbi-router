export interface IAddHandler {
  addHandler(handler: any): void;
}

export interface IRouterHandler {
  (request: IRequest, response: Response): void | Promise<void>;
}

export class Router {
  handlers: IAddHandler;
  
  constructor(handlers: IAddHandler) {
    this.handlers = handlers;
  }
  
  get(url: string, handler: IRouterHandler) {
    this.registerHandler("GET", url, handler);
  }
  
  post(url: string, handler: IRouterHandler) {
    this.registerHandler("POST", url, handler);
  }
  
  put(url: string, handler: IRouterHandler) {
    this.registerHandler("PUT", url, handler);
  }
  
  delete(url: string, handler: IRouterHandler) {
    this.registerHandler("DELETE", url, handler);
  }
  
  private registerHandler(method: string, url: string, handler: IRouterHandler) {
    const internalHandler = {
      test(request: IRequest): boolean {
        return (request.method === method
          && request.url === url);
      },
      handle(request: IRequest): Promise<IResponse> {
        const response = new Response();
        return Promise.resolve(handler(request, response))
          .then(x => response);
      }
    };
    
    this.handlers.addHandler(internalHandler);
  }
}

export interface IRequest {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string,
  headers: { [key: string]: string };
  body: any;
}

export interface IResponse {
  statusCode: number;
  headers?: { [key: string]: string };
  body: any;
}

export class Response implements IResponse {
  statusCode: number;
  headers: any;
  body: any;
  
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = null;
  }
 
  send(statusCode: number, body?: any) {
    this.statusCode = statusCode;
    this.body = body;
  }
}