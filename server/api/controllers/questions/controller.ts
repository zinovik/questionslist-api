import DbService from '../../services/db.service';
import { Request, Response } from 'express';

export class Controller {
  all(req: Request, res: Response): void {
    DbService.getAllQuestions().then(r => {
      r['email'] = req['session'] && req['session'].email;
      return res.json(r);
    });
  }

  create(req: Request, res: Response): void {
    DbService.createQuestion(req.body).then(r =>
      res
        .status(201)
        .location(`/api/v1/questions/${r}`)
        .json(r),
    );
  }

  update(req: Request, res: Response): void {
    DbService.updateQuestion(req.body).then(r =>
      res
        .status(201)
        .location(`/api/v1/questions/${r}`)
        .json(r),
    );
  }

  delete(req: Request, res: Response): void {
    DbService.deleteQuestion(req.body.id).then(r =>
      res
        .status(201)
        .location(`/api/v1/questions/${r}`)
        .json(r),
    );
  }
}
export default new Controller();
