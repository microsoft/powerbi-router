import * as Router from '../src/router';

describe('router', function () {
  let wpmpStub = {
    testSpy: jasmine.createSpy('testSpy'),
    handleSpy: jasmine.createSpy('handleSpy'),
    handleResponseSpy: jasmine.createSpy('handleResponseSpy'),
    handlers: <any[]>[],
    addHandler: jasmine.createSpy("spyHandler").and.callFake((handler: any) => {
      wpmpStub.handlers.push(handler);
    }),
    simulateReceiveMessage(message: any) {
      wpmpStub.handlers.some(handler => {
        wpmpStub.testSpy(message);
        if(handler.test(message)) {
          wpmpStub.handleSpy(message);
          const returnValue = handler.handle(message);
          wpmpStub.handleResponseSpy(returnValue);
          return returnValue;
        }
      });
    }
  };

  describe('common', function () {
    let router: Router.Router;
    const testUrl = '/report/pages';
    const testHandler: Router.IRouterHandler = (request, response) => {
      response.send(200, { params: request.params });
    };
    let internalHandler: any;

    beforeAll(function () {
      wpmpStub.handlers.length = 0;
      router = new Router.Router(wpmpStub);
      router.get(testUrl, testHandler);
    });

    beforeEach(function () {
      internalHandler = wpmpStub.addHandler.calls.mostRecent().args[0];
    });

    afterEach(function () {
      wpmpStub.testSpy.calls.reset();
      wpmpStub.handleSpy.calls.reset();
    });

    afterAll(function () {
      wpmpStub.addHandler.calls.reset();
    });

    it('the handle method will always return a promise', function () {
      // Arrange 
      const testData = {
        request: {
          method: 'GET',
          url: testUrl
        }
      };

      // Act
      wpmpStub.simulateReceiveMessage(testData.request);

      // Assert
      const handleReturnValue: any = wpmpStub.handleResponseSpy.calls.mostRecent().args[0];
      expect(wpmpStub.testSpy).toHaveBeenCalledWith(testData.request);
      expect(wpmpStub.handleSpy).toHaveBeenCalledWith(testData.request);
      expect(handleReturnValue.then).toBeDefined();
    });

    it('the handle method will call the given handler with request and response object so the response may be modified', function (done) {
      // Arrange 
      const testData = {
        request: {
          method: 'GET',
          url: testUrl
        }
      };

      // Act
      wpmpStub.simulateReceiveMessage(testData.request);

      // Assert
      const handleReturnValue: any = wpmpStub.handleResponseSpy.calls.mostRecent().args[0];
      expect(wpmpStub.testSpy).toHaveBeenCalled();
      expect(wpmpStub.handleSpy).toHaveBeenCalled();
      handleReturnValue
        .then((response: any) => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });

    it('calling any method on the router instance always returns itself to allow chaining', function () {
      const returnValue = router.get("abc", testHandler);
      expect(returnValue).toBe(router);
    });

    it('wildcard route can be added', function () {
      // Arrange
      router.get('*path', testHandler);
      const testData = {
        request: {
          method: 'GET',
          url: `nonexistentpath/asdfasdf`
        }
      };
      const expectedRequest = {
        params: {
          path: testData.request.url
        }
      };

      // Act
      wpmpStub.simulateReceiveMessage(testData.request);

      // Assert
      expect(wpmpStub.testSpy).toHaveBeenCalledWith(testData.request);
      expect(wpmpStub.handleSpy).toHaveBeenCalledWith(jasmine.objectContaining(expectedRequest));
    });
  });

  describe('http methods', function () {
    let router: Router.Router;
    let testUrl = '/report/pages/:pageName';
    let testHandler: Router.IRouterHandler = (request, response) => {
      response.send(200, { params: request.params });
    };
    let internalHandler: any;

    beforeAll(function () {
      wpmpStub.handlers.length = 0;
      router = new Router.Router(wpmpStub);
      router.get(testUrl, testHandler);
    });

    beforeEach(function () {
      internalHandler = wpmpStub.addHandler.calls.mostRecent().args[0];
    });

    afterEach(function () {
      wpmpStub.testSpy.calls.reset();
      wpmpStub.handleSpy.calls.reset();
    });

    afterAll(function () {
      wpmpStub.addHandler.calls.reset();
    });

    it('calling router[method](path, handler) registers handler on the handlers object', function () {
      expect(wpmpStub.addHandler).toHaveBeenCalled();
    });

    it('the test method will return FALSE if the request.method does not match', function () {
      // Arrange 
      const testPageName = 'customPage';
      const testData = {
        request: {
          method: 'POST',
          url: `/report/pages/${testPageName}`
        }
      };

      // Act

      // Assert
      expect(internalHandler.test(testData.request)).toEqual(false);
    });

    it('the test method will return TRUE if the request method and the url matches a pattern', function () {
      // Arrange 
      const testPageName = 'customPage';
      const testPageTitle = 'customPageTitle';
      const testData = {
        request: {
          method: 'GET',
          url: `/report/pages/${testPageName}?title=${testPageTitle}`
        }
      };

      // Act

      // Assert
      expect(internalHandler.test(testData.request)).toEqual(true);
    });

    it('the test method will add the path parameters and query parameters to the request if the request method and the url matches the pattern', function () {
      // Arrange
      const testPageName = 'customPage';
      const testData = {
        request: {
          method: 'GET',
          url: `/report/pages/${testPageName}?myParameter=xyz`
        }
      };
      const expectedRequest = {
        params: {
          pageName: testPageName
        },
        queryParams: {
          myParameter: 'xyz'
        }
      };

      // Act
      wpmpStub.simulateReceiveMessage(testData.request);

      // Assert
      // const handleReturnValue: any = wpmpStub.handleResponseSpy.calls.mostRecent().args[0];
      expect(wpmpStub.testSpy).toHaveBeenCalledWith(testData.request);
      expect(wpmpStub.handleSpy).toHaveBeenCalledWith(jasmine.objectContaining(expectedRequest));
    });

    it('route recognizers are split by http method so two paths with different methods will not conflict', function () {
      // Arrange
      router.delete('/report/pages/:pageName', testHandler);
      const testPageName = 'customPage';
      const testData = {
        request: {
          method: 'DELETE',
          url: `/report/pages/${testPageName}`
        }
      };
      const expectedRequest = {
        params: {
          pageName: testPageName
        }
      };
      // const secondInternalHandler: any = wpmpStub.addHandler.calls.mostRecent().args[0];

      // Act
      wpmpStub.simulateReceiveMessage(testData.request);

      // Assert
      expect(wpmpStub.addHandler).toHaveBeenCalled();
      expect(wpmpStub.testSpy).toHaveBeenCalledWith(testData.request);
      expect(wpmpStub.handleSpy).toHaveBeenCalledWith(jasmine.objectContaining(expectedRequest));
    });
  });
});
