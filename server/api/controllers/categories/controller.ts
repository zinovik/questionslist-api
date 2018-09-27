import DbService from '../../services/db.service';
import { Request, Response } from 'express';

export class Controller {
  all(req: Request, res: Response): void {
    DbService.getAllCategories().then(r => res.json(r));
  }

  create(req: Request, res: Response) {
    if (!req['session'] || !req['session'].email) {
      return res.status(401).json({ error: "401 Unauthorized" });
    }
    DbService.createCategory(req.body, req['session']).then(r =>
      res
        .status(201)
        .location(`/api/v1/categories/${r}`)
        .json(r),
    );
  }

  update(req: Request, res: Response) {
    if (!req['session'] || !req['session'].email) {
      return res.status(401).json({ error: "401 Unauthorized" });
    }
    DbService.updateCategory(req.body, req['session']).then(r =>
      res
        .status(201)
        .location(`/api/v1/categories/${r}`)
        .json(r),
    );
  }

  delete(req: Request, res: Response) {
    if (!req['session'] || !req['session'].email) {
      return res.status(401).json({ error: "401 Unauthorized" });
    }
    DbService.deleteCategory(req.body.id).then(r =>
      res
        .status(201)
        .location(`/api/v1/categories/${r}`)
        .json(r),
    );
  }
}
export default new Controller();
