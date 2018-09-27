import DbService from '../../services/db.service';
import { Request, Response } from 'express';

export class Controller {
  all(req: Request, res: Response): void {
    DbService.getAllQuestions().then(r => {
      r['given_name'] = req['session'] && req['session'].given_name;
      return res.json(r);
    });
  }

  create(req: Request, res: Response) {
    if (!req['session'] || !req['session'].email) {
      return res.status(401).json({ error: "401 Unauthorized" });
    }
    DbService.createQuestion(req.body, req['session']).then(r =>
      res
        .status(201)
        .location(`/api/v1/questions/${r}`)
        .json(r),
    );
  }

  update(req: Request, res: Response) {
    if (!req['session'] || !req['session'].email) {
      return res.status(401).json({ error: "401 Unauthorized" });
    }
    DbService.updateQuestion(req.body, req['session']).then(r =>
      res
        .status(201)
        .location(`/api/v1/questions/${r}`)
        .json(r),
    );
  }

  delete(req: Request, res: Response) {
    if (!req['session'] || !req['session'].email) {
      return res.status(401).json({ error: "401 Unauthorized" });
    }
    DbService.deleteQuestion(req.body.id).then(r =>
      res
        .status(201)
        .location(`/api/v1/questions/${r}`)
        .json(r),
    );
  }
}
export default new Controller();
