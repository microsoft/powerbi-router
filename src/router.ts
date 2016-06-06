import RouteRecognizer = require('route-recognizer');

export interface IAddHandler {
  addHandler(handler: any): void;
}

export interface IRouterHandler {
  (request: IExtendedRequest, response: Response): void | Promise<void>;
}

export class Router {
  private handlers: IAddHandler;
  private getRouteRecognizer: RouteRecognizer<any>;
  private patchRouteRecognizer: RouteRecognizer<any>;
  private postRouteRecognizer: RouteRecognizer<any>;
  private putRouteRecognizer: RouteRecognizer<any>;
  private deleteRouteRecognizer: RouteRecognizer<any>;
  
  constructor(handlers: IAddHandler) {
    this.handlers = handlers;
    
    /**
     * TODO: look at generating the router dynamically based on list of supported http methods
     * instead of hardcoding the creation of these and the methods.
     */
    this.getRouteRecognizer = new RouteRecognizer();
    this.patchRouteRecognizer = new RouteRecognizer();
    this.postRouteRecognizer = new RouteRecognizer();
    this.putRouteRecognizer = new RouteRecognizer();
    this.deleteRouteRecognizer = new RouteRecognizer();
  }
  
  get(url: string, handler: IRouterHandler): this {
    this.registerHandler(this.getRouteRecognizer, "GET", url, handler);
    return this;
  }
  
  patch(url: string, handler: IRouterHandler): this {
    this.registerHandler(this.patchRouteRecognizer, "PATCH", url, handler);
    return this;
  }
  
  post(url: string, handler: IRouterHandler): this {
    this.registerHandler(this.postRouteRecognizer, "POST", url, handler);
    return this;
  }
  
  put(url: string, handler: IRouterHandler): this {
    this.registerHandler(this.putRouteRecognizer, "PUT", url, handler);
    return this;
  }
  
  delete(url: string, handler: IRouterHandler): this {
    this.registerHandler(this.deleteRouteRecognizer, "DELETE", url, handler);
    return this;
  }
  
  private registerHandler(routeRecognizer: RouteRecognizer<any>, method: string, url: string, handler: IRouterHandler) {
    routeRecognizer.add([
      { path: url, handler: () => {} }
    ]);
    
    const internalHandler = {
      test(request: IRequest): boolean {
        if (request.method !== method) {
          return false;
        }
        
        const matchingRoutes = routeRecognizer.recognize(request.url);
        if(matchingRoutes === undefined) {
          return false;
        }
        
        /**
         * Copy parameters from recognized route to the request so they can be used within the handler function
         * This isn't ideal because it is side affect which modifies the request instead of strictly testing for true or false
         * but I don't see a better place to put this.  If we move it between the call to test and the handle it becomes part of the window post message proxy
         * even though it's responsibility is related to routing.
         */
        const route = matchingRoutes[0];
        (<IExtendedRequest>request).params = route.params;
        (<IExtendedRequest>request).queryParams = (<any>matchingRoutes).queryParams;
        
        return true;
      },
      handle(request: IExtendedRequest): Promise<IResponse> {
        const response = new Response();
        return Promise.resolve(handler(request, response))
          .then(x => response);
      }
    };
    
    this.handlers.addHandler(internalHandler);
  }
}

export interface IExtendedRequest extends IRequest {
  params: any;
  queryParams: any;
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