import AuthorizationService from '../../services/authorization.service';
import { Request, Response } from 'express';

export class Controller {
  login(req: Request, res: Response): void {
    AuthorizationService.getUserInfo(req.body.token)
      .then(r => {
        if (r) {
          req['session'].given_name = r.given_name;
        }
        return res.json(r)
      });
  }
}
export default new Controller();
