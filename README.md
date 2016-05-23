# powerbi-router

Router for Microsoft Power BI. Given a pattern, call handler. Patterns will only be http-like objects so syntax matches known libraries such as express and restify.

## Getting Started

Installation:
```
npm install --save powerbi-router
```

Usage:
```
import * as wpmp from 'window-post-message-proxy';
import * as pbiRouter from 'powerbi-router';

const wpmp1 = new wpmp.WindowPostMessageProxy();
const router = new pbiRouter.Router(wpmp1);

router.get('/report/pages', (request, response) => {
  return app.getPages()
    .then(pages => {
      response.send(200, pages);
    });
});

router.put('/report/pages/active', (request, response) => {
  app.setPage(request.body)
    .then(page => {
      host.sendEvent('pageChanged', page);
    });
    
  response.send(202);
});
```

