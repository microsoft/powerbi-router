import * as pbiRouter from '../src/router';

describe('router', function () {
  let router: pbiRouter.Router;
  let wpmpStub = {
    addHandler: jasmine.createSpy("spyHandler")
  };
  
  beforeAll(function () {
    router = new pbiRouter.Router(wpmpStub);
  });
  
  describe('common', function () {
    // Arrange
    const testUrl = '/report/pages';
    const testHandler: pbiRouter.IRouterHandler = (request: pbiRouter.IRequest, response: pbiRouter.Response) => {
      response.send(400);
    };
    let internalHandler: any;
    
    beforeEach(function () {
      router.get(testUrl, testHandler);
      internalHandler = wpmpStub.addHandler.calls.mostRecent().args[0];
    });
    
    afterEach(function () {
      wpmpStub.addHandler.calls.reset();
    });
    
    it('the handle method will always return a promise', function () {
      expect(internalHandler.handle({ method: "GET", url: testUrl }).then).toBeDefined();
    });
    
    it('the handle method will call the given handler with request and response object so the response may be modified', function (done) {
      internalHandler.handle({ method: "GET", url: testUrl })
        .then((response: pbiRouter.Response) => {
          expect(response.statusCode).toEqual(400);
          done();
        });
    });
  })
  
  describe('get', function () {
    // Arrange
    const testUrl = '/report/pages';
    const testHandler: pbiRouter.IRouterHandler = (request: pbiRouter.IRequest, response: pbiRouter.Response) => {
      response.send(400);
    };
    let internalHandler: any;
    
    beforeEach(function () {
      router.get(testUrl, testHandler);
      internalHandler = wpmpStub.addHandler.calls.mostRecent().args[0];
    });
    
    afterEach(function () {
      wpmpStub.addHandler.calls.reset();
    });
    
    it('calling get registers handler on the handlers object', function () {
      expect(wpmpStub.addHandler).toHaveBeenCalled();
    });
    
    it('the test method will return true if the method is GET and the url match exactly', function () {
      expect(internalHandler.test({ method: "POST", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "GET", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "GET", url: testUrl })).toBe(true);
    });
  });
  
  describe('post', function () {
    // Arrange
    const testUrl = '/report/filters';
    const testHandler: pbiRouter.IRouterHandler = (request: pbiRouter.IRequest, response: pbiRouter.Response) => {
      response.send(202);
    };
    let internalHandler: any;

    beforeEach(function () {
      router.post(testUrl, testHandler);
      internalHandler = wpmpStub.addHandler.calls.mostRecent().args[0];
    });
    
    afterEach(function () {
      wpmpStub.addHandler.calls.reset();
    });
    
    it('calling post registers handler on the handlers object', function () {
      expect(wpmpStub.addHandler).toHaveBeenCalled();
    });
    
    it('the test method will return true if the method is POST and the url match exactly', function () {
      expect(internalHandler.test({ method: "GET", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "POST", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "POST", url: testUrl })).toBe(true);
    });
  });
  
  describe('put', function () {
    // Arrange
    const testUrl = '/report/pages/active';
    const testHandler: pbiRouter.IRouterHandler = (request: pbiRouter.IRequest, response: pbiRouter.Response) => {
      response.send(202);
    };
    let internalHandler: any;

    beforeEach(function () {
      router.put(testUrl, testHandler);
      internalHandler = wpmpStub.addHandler.calls.mostRecent().args[0];
    });
    
    afterEach(function () {
      wpmpStub.addHandler.calls.reset();
    });
    
    it('calling put registers handler on the handlers object', function () {
      expect(wpmpStub.addHandler).toHaveBeenCalled();
    });
    
    it('the test method will return true if the method is PUT and the url match exactly', function () {
      expect(internalHandler.test({ method: "POST", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "PUT", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "PUT", url: testUrl })).toBe(true);
    });
  });
  
  describe('delete', function () {
    // Arrange
    const testUrl = '/report/filters/myFilter';
    const testHandler: pbiRouter.IRouterHandler = (request: pbiRouter.IRequest, response: pbiRouter.Response) => {
      response.send(202);
    };
    let internalHandler: any;

    beforeEach(function () {
      router.delete(testUrl, testHandler);
      internalHandler = wpmpStub.addHandler.calls.mostRecent().args[0];
    });
    
    afterEach(function () {
      wpmpStub.addHandler.calls.reset();
    });
    
    it('calling delete registers handler on the handlers object', function () {
      expect(wpmpStub.addHandler).toHaveBeenCalled();
    });
    
    it('the test method will return true if the method is PUT and the url match exactly', function () {
      expect(internalHandler.test({ method: "POST", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "DELETE", url: "xyz" })).toBe(false);
      expect(internalHandler.test({ method: "DELETE", url: testUrl })).toBe(true);
    });
  });
});
