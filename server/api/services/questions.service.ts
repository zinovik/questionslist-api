import Promise from 'bluebird';
import { Client } from 'pg';
import L from '../../common/logger'

const client = new Client(`${process.env.DATABASE_URL}?ssl=true`);
client.connect();
client.query('CREATE TABLE categories(' +
  'id SERIAL PRIMARY KEY, ' +
  'name VARCHAR(40) not null, ' +
  'parent INT, ' +
  'FOREIGN KEY (parent) REFERENCES categories(id))', (err, res) => {
    console.log(err && err.message, res);
    client.query('CREATE TABLE questions(' +
      'id SERIAL PRIMARY KEY, ' +
      'name VARCHAR(40) not null, ' +
      'text VARCHAR(300) not null, ' +
      'difficulty INT, ' +
      'answer VARCHAR(200) not null, ' +
      'category INT, ' +
      'FOREIGN KEY (category) REFERENCES categories(id))', (err, res) => {
        console.log(err && err.message, res);
      });
  });

let id = 0;
interface Question {
  id: number,
  name: string,
  text: string,
  difficulty: number,
  answer: string,
};

export class QuestionsService {
  all(): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      client.query('SELECT * FROM questions ORDER BY id ASC;', (err, res) => {
        L.info(res.rows, 'fetch all questions');
        console.log(err && err.message, res && res.rows);
        return resolve(res.rows);
      });
    });
  }

  create(question: Question): Promise<Question> {
    L.info(`create question ${question}`);
    return Promise.resolve(<Question>{ id: 12 });
  }
}

export default new QuestionsService();