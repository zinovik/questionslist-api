import DbService from '../../services/db.service';
import { Request, Response } from 'express';

export class Controller {
  all(req: Request, res: Response): void {
    DbService.getAllCategories().then(r => res.json(r));
  }

  create(req: Request, res: Response): void {
    DbService.createCategory(req.body).then(r =>
      res
        .status(201)
        .location(`/api/v1/categories/${r}`)
        .json(r),
    );
  }

  update(req: Request, res: Response): void {
    DbService.updateCategory(req.body).then(r =>
      res
        .status(201)
        .location(`/api/v1/categories/${r}`)
        .json(r),
    );
  }

  delete(req: Request, res: Response): void {
    DbService.deleteCategory(req.body.id).then(r =>
      res
        .status(201)
        .location(`/api/v1/categories/${r}`)
        .json(r),
    );
  }
}
export default new Controller();
