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
    console.log(err && err.message || res);
    client.query('CREATE TABLE questions(' +
      'id SERIAL PRIMARY KEY, ' +
      'name VARCHAR(40) not null, ' +
      'text VARCHAR(300) not null, ' +
      'difficulty INT, ' +
      'answer VARCHAR(200) not null, ' +
      'category INT, ' +
      'FOREIGN KEY (category) REFERENCES categories(id))', (err, res) => {
        console.log(err && err.message || res);
      });
  });

interface Question {
  id: number,
  name: string,
  text: string,
  difficulty: number,
  answer: string,
  category: number,
};

interface Category {
  id: number,
  name: string,
  parent: string,
};

export class DbService {
  getAllQuestions(): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      client.query('SELECT * FROM questions ORDER BY id ASC;', (err, res) => {
        L.info(res.rows, 'fetch all questions');
        console.log(err && err.message || (res && res.rows));
        return resolve(res.rows);
      });
    });
  }

  createQuestion(question: Question): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      L.info(`create question`, question);
      client.query(`INSERT INTO questions(name, text, difficulty, answer, category) ` +
        `values('${question.name}', '${question.text}', '${question.difficulty}', '${question.answer}', '${question.category}')`, (err, res) => {
          console.log(err && err.message || (res && res.rows));
          return this.getAllQuestions()
            .then((rows: Question[]) => {
              resolve(rows);
            });
        });
    });
  }

  updateQuestion(question: Question): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      L.info(`update question`, question);
      client.query(`UPDATE questions ` +
        `SET name = '${question.name}', ` +
        `text = '${question.text}', ` +
        `difficulty = '${question.difficulty}', ` +
        `answer = '${question.answer}', ` +
        `category = '${question.category}' ` +
        `WHERE id = '${question.id}'`, (err, res) => {
          console.log(err && err.message || (res && res.rows));
          return this.getAllQuestions()
            .then((rows: Question[]) => {
              resolve(rows);
            });
        });
    });
  }

  
  deleteQuestion(id): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      L.info(`delete question`, id);
      client.query(`DELETE FROM questions ` +
        `WHERE id = '${id}'`, (err, res) => {
          console.log(err && err.message || (res && res.rows));
          return this.getAllQuestions()
            .then((rows: Question[]) => {
              resolve(rows);
            });
        });
    });
  }

  getAllCategories(): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      client.query('SELECT * FROM categories ORDER BY id ASC;', (err, res) => {
        L.info(res.rows, 'fetch all categories');
        console.log(err && err.message || (res && res.rows));
        return resolve(res.rows);
      });
    });
  }

  createCategory(category: Category): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      L.info(`create category`, category);
      client.query(`INSERT INTO categories(name, parent) ` +
        `values('${category.name}', '${category.parent}')`, (err, res) => {
          console.log(err && err.message || (res && res.rows));
          return this.getAllCategories()
            .then((rows: Category[]) => {
              resolve(rows);
            });
        });
    });
  }

  updateCategory(category: Category): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      L.info(`update category`, category);
      client.query(`UPDATE categories ` +
        `SET name = '${category.name}', ` +
        `parent = '${category.parent}' ` +
        `WHERE id = '${category.id}'`, (err, res) => {
          console.log(err && err.message || (res && res.rows));
          return this.getAllCategories()
            .then((rows: Category[]) => {
              resolve(rows);
            });
        });
    });
  }

  deleteCategory(id): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      L.info(`delete category`, id);
      client.query(`DELETE FROM categories ` +
        `WHERE id = '${id}'`, (err, res) => {
          console.log(err && err.message || (res && res.rows));
          return this.getAllCategories()
            .then((rows: Category[]) => {
              resolve(rows);
            });
        });
    });
  }
}

export default new DbService();