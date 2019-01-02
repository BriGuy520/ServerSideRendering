import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import proxy from 'express-http-proxy';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();

app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
  proxyReqOptDecorator(opts){
    opts.headers['x-forwarded-host'] = 'localhost:3000';
    return opts;
  }
}))

// make the public available to the outside environment
app.use(express.static('public'));

app.get('*', (req, res) => {

  const store = createStore(req);

  // take incoming request, look at incoming current path request, look at the
  //  route configuration object and see what needs to be rendered 
  const promises = matchRoutes(Routes, req.path).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  }).map(promise => {
    if(promise){
      return new Promise((resolve, reject) => {
        promise.then(resolve).catch(resolve);
      });
    }
  })

  Promise.all(promises).then(() => {
    
    const context = {};
    const content = renderer(req, store, context);

    if(context.url){
      return res.redirect(302, context.url);
    }

    if(context.notFound){
      res.status(404);
    }

    res.send(content);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});