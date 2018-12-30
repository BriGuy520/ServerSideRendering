import 'babel-polyfill';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();

// make the public available to the outside environment
app.use(express.static('public'));

app.get('*', (req, res) => {

  const store = createStore();

  // take incoming request, look at incoming current path request, look at the
  //  route configuration object and see what needs to be rendered 
  matchRoutes(Routes, req.path).map(({ route }) => {
    return route.loadData ? route.loadData() : null;
  });

  res.send(renderer(req, store));
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});