import QuestionsService from '../../services/questions.service';
import { Request, Response } from 'express';

export class Controller {
  all(req: Request, res: Response): void {
    QuestionsService.all().then(r => res.json(r));
  }

  create(req: Request, res: Response): void {
    QuestionsService.create(req.body).then(r =>
      res
        .status(201)
        .location(`/api/v1/questions/${r}`)
        .json(r),
    );
  }
}
export default new Controller();
