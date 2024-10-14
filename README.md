# powerbi-router
[![Build Status](https://img.shields.io/travis/Microsoft/powerbi-router.svg)](https://travis-ci.org/Microsoft/powerbi-router)
[![NPM Version](https://img.shields.io/npm/v/powerbi-router.svg)](https://www.npmjs.com/package/powerbi-router)
[![NPM Total Downloads](https://img.shields.io/npm/dt/powerbi-router.svg)](https://www.npmjs.com/package/powerbi-router)
[![NPM Monthly Downloads](https://img.shields.io/npm/dm/powerbi-router.svg)](https://www.npmjs.com/package/powerbi-router)
[![GitHub tag](https://img.shields.io/github/tag/microsoft/powerbi-router.svg)](https://github.com/Microsoft/powerbi-router/tags)

Router for Microsoft Power BI. Given an http method and url pattern call the matching handler with the request and response object. Syntax matches common libraries such as express and restify.
This library uses [Route-recognizer](https://github.com/tildeio/route-recognizer) to handle pattern matching such as `/root/path/:name` where `name` will be passed as paramter to the handler.

## Documentation:
### [https://microsoft.github.io/powerbi-router](https://microsoft.github.io/powerbi-router)

## Installation:

```bash
npm install --save powerbi-router
```

## Usage:

```typescript
import * as Wpmp from 'window-post-message-proxy';
import * as Router from 'powerbi-router';

const wpmp = new Wpmp.WindowPostMessageProxy();
const router = new Router.Router(wpmp);

/**
 * Demonstrate 'syncrhonous' API with request and response.
 */
router.get('/report/pages', (request, response) => {
  return app.getPages()
    .then(pages => {
      response.send(200, pages);
    });
});

/**
 * Demonstrate 'asynchronous' API with accepted command, and events
 */
router.put('/report/pages/active', (request, response) => {
  const page = request.body;

  return app.validatePage(page)
    .then(() => {
      app.setPage(request.body)
        .then(page => {
          hpm.post(`/report/${reportId}/events/pageChanged`, page);
        }, error => {
          hpm.post(`/report/${reportId}/events/error`, error);
        });

      response.send(202);
    }, errors => {
      response.send(400, errors);
    });
});

/**
 * Demonstrate using path parameters and query parameters
 */
router.put('/report/pages/:pageName/visuals?filter=true', (request, response) => {
  const pageName = request.params.pageName;
  const filter = request.queryParams.filter;

  return app.validatePage(pageName)
    .then(() => {
      return app.getVisuals(filter)
        .then(visuals => {
          response.send(200, visuals);
        }, error => {
          response.send(500, error);
        });
    }, errors => {
      response.send(400, errors);
    });
});

/**
 * Demonstrate using wildcard matching
 */
router.get('*notfound', (request, response) => {
  response.send(404, `Not Found. Url: ${request.params.notfound} was not found.`);
});
```

## Support

- **Feature Requests:** Submit your ideas and suggestions to the [Fabric Ideas Portal](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fideas.fabric.microsoft.com%2F&data=05%7C02%7COr.Shemesh%40microsoft.com%7C72ccde64806a4ff4237b08dce610afa7%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C638638206567959909%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&sdata=f8%2Blboxk11RF0P4KelMaE7FEUfStuxgUkTc8HiuBxr0%3D&reserved=0), where you can also vote on ideas from other developers.
- **Bug Reports and Technical Assistance:** Visit the [Fabric Developer Community Forum](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fcommunity.fabric.microsoft.com%2Ft5%2FDeveloper%2Fbd-p%2FDeveloper&data=05%7C02%7COr.Shemesh%40microsoft.com%7C66158ccfa9d0420897b808dce93e491f%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C638641700929578580%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&sdata=niYdcy8yLbG2X11WQhy3lkUgfboyYdT3oowYYfbtaDc%3D&reserved=0). Our team and community experts are ready to assist you.
- **Additional Support:** Contact your account manager or reach out to the [Fabric Support Team](https://support.fabric.microsoft.com/en-us/support/).
