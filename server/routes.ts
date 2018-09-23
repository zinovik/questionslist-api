import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router';
import questionsRouter from './api/controllers/questions/router';
import categoriesRouter from './api/controllers/categories/router';
import authorizationRouter from './api/controllers/authorization/router';
export default function routes(app: Application): void {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/questions', questionsRouter);
  app.use('/api/v1/categories', categoriesRouter);
  app.use('/api/v1/authorization', authorizationRouter);
};