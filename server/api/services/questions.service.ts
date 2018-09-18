import Promise from 'bluebird';
import { Client } from 'pg';
import L from '../../common/logger'

const client = new Client(`${process.env.DATABASE_URL}?ssl=true`);
client.connect();
client.query('CREATE TABLE questions(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, text VARCHAR(300) not null, difficulty INT, answer VARCHAR(200) not null)', (err, res) => {
  console.log(err && err.message, res);
});

let id = 0;
interface Example {
  id: number,
  name: string
};

const examples: Example[] = [
    { id: id++, name: 'example 0' }, 
    { id: id++, name: 'example 1' }
];

export class QuestionsService {
  all(): Promise<Example[]> {
    L.info(examples, 'fetch all examples');

    return new Promise((resolve, reject) => {
      client.query('SELECT * FROM questions ORDER BY id ASC;', (err, res) => {
        console.log(err && err.message, res && res.rows);
        return resolve(res.rows);
      });
    });
  }

  byId(id: number): Promise<Example> {
    L.info(`fetch example with id ${id}`);
    return this.all().then(r => r[id])
  }

  create(name: string): Promise<Example> {
    L.info(`create example with name ${name}`);
    const example: Example = {
      id: id++,
      name
    };
    examples.push(example)
    return Promise.resolve(example);
  }
}

export default new QuestionsService();