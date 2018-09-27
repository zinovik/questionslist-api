import Promise from 'bluebird';
import { Client } from 'pg';
import L from '../../common/logger';

const client = new Client(`${process.env.DATABASE_URL}?ssl=true`);
client.connect();
client.query('CREATE TABLE categories(' +
  'id SERIAL PRIMARY KEY, ' +
  'name VARCHAR(40) not null, ' +
  'created VARCHAR(70) not null, ' +
  'modified VARCHAR(70) not null, ' +
  'parent INT, ' +
  'FOREIGN KEY (parent) REFERENCES categories(id))', (err, res) => {
    if (err) {
      L.info(err.message);
    } else {
      L.info(res);
    }
    client.query('CREATE TABLE questions(' +
      'id SERIAL PRIMARY KEY, ' +
      'name VARCHAR(40) not null, ' +
      'text VARCHAR(300) not null, ' +
      'difficulty INT not null, ' +
      'answer VARCHAR(200) not null, ' +
      'tags VARCHAR(200), ' +
      'created VARCHAR(70) not null, ' +
      'modified VARCHAR(70) not null, ' +
      'category INT, ' +
      'FOREIGN KEY (category) REFERENCES categories(id))', (err, res) => {
        if (err) {
          L.info(err.message);
        } else {
          L.info(res);
        }
      });
  });

interface Question {
  id: number,
  name: string,
  text: string,
  difficulty: number,
  answer: string,
  category: number,
  tags: string,
  created: string,
  modified: string,
};

interface Category {
  id: number,
  name: string,
  parent: string,
  created: string,
  modified: string,
};

export class DbService {
  getAllQuestions(): Promise<{ error: string, data: Question[] }> {
    return new Promise((resolve, reject) => {
      L.info('fetch all questions');
      client.query('SELECT * FROM questions ORDER BY id ASC;', (err, res) => {
        if (err) {
          L.error(err.message);
        } else {
          L.info(res && res.rows);
        }
        return resolve({ error: err && err.message, data: res.rows });
      });
    });
  }

  createQuestion(question: Question, session): Promise<{ error: string, data: Question[] }> {
    return new Promise((resolve, reject) => {
      L.info(`create question`, question);
      client.query(`INSERT INTO questions(name, text, difficulty, answer, category, tags, created, modified) ` +
        `values('${question.name}', '${question.text}', '${question.difficulty}', '${question.answer}', ` +
        `'${question.category}', '${question.tags}', '${session && session.email}', '${session && session.email}')`, (err, res) => {
          if (err) {
            L.error(err.message);
          }
          return this.getAllQuestions()
            .then(({ error, data }) => {
              resolve({ error: err && err.message || error, data: data });
            });
        });
    });
  }

  updateQuestion(question: Question, session): Promise<{ error: string, data: Question[] }> {
    return new Promise((resolve, reject) => {
      L.info(`update question`, question);
      client.query(`UPDATE questions ` +
        `SET name = '${question.name}', ` +
        `text = '${question.text}', ` +
        `difficulty = '${question.difficulty}', ` +
        `answer = '${question.answer}', ` +
        `tags = '${question.tags}', ` +
        `category = '${question.category}', ` +
        `modified = '${session && session.email}' ` +
        `WHERE id = '${question.id}'`, (err, res) => {
          if (err) {
            L.error(err.message);
          }
          return this.getAllQuestions()
            .then(({ error, data }) => {
              resolve({ error: err && err.message || error, data: data });
            });
        });
    });
  }


  deleteQuestion(id): Promise<{ error: string, data: Question[] }> {
    return new Promise((resolve, reject) => {
      L.info(`delete question`, id);
      client.query(`DELETE FROM questions ` +
        `WHERE id = '${id}'`, (err, res) => {
          if (err) {
            L.error(err.message);
          }
          return this.getAllQuestions()
            .then(({ error, data }) => {
              resolve({ error: err && err.message || error, data: data });
            });
        });
    });
  }

  getAllCategories(): Promise<{ error: string, data: Category[] }> {
    return new Promise((resolve, reject) => {
      L.info('fetch all categories');
      client.query('SELECT * FROM categories ORDER BY id ASC;', (err, res) => {
        if (err) {
          L.error(err.message);
        } else {
          L.info(res && res.rows);
        }
        return resolve({ error: err && err.message, data: res.rows });
      });
    });
  }

  createCategory(category: Category, session): Promise<{ error: string, data: Category[] }> {
    return new Promise((resolve, reject) => {
      L.info(`create category`, category);
      const isEmptyParent = (category.parent === null || category.parent === "null");
      client.query(`INSERT INTO categories(name, ${isEmptyParent ? '' : 'parent, '}created, modified) ` +
        `values('${category.name}', ${isEmptyParent ? '' : `'${category.parent}', `}'${session && session.email}', '${session && session.email}')`, (err, res) => {
          if (err) {
            L.error(err.message);
          }
          return this.getAllCategories()
            .then(({ error, data }) => {
              resolve({ error: err && err.message || error, data: data });
            });
        });
    });
  }

  updateCategory(category: Category, session): Promise<{ error: string, data: Category[] }> {
    return new Promise((resolve, reject) => {
      L.info(`update category`, category);
      const isEmptyParent = (category.parent === null || category.parent === "null");
      console.log(isEmptyParent);
      client.query(`UPDATE categories ` +
        `SET name = '${category.name}'` +
        (isEmptyParent ? `, parent = NULL ` : `, parent = '${category.parent}', `) +
        `modified = '${session && session.email}' ` +
        `WHERE id = '${category.id}'`, (err, res) => {
          if (err) {
            L.error(err.message);
          }
          return this.getAllCategories()
            .then(({ error, data }) => {
              resolve({ error: err && err.message || error, data: data });
            });
        });
    });
  }

  deleteCategory(id): Promise<{ error: string, data: Category[] }> {
    return new Promise((resolve, reject) => {
      L.info(`delete category`, id);
      client.query(`DELETE FROM categories ` +
        `WHERE id = '${id}'`, (err, res) => {
          if (err) {
            L.error(err.message);
          }
          return this.getAllCategories()
            .then(({ error, data }) => {
              resolve({ error: err && err.message || error, data: data });
            });
        });
    });
  }
}

export default new DbService();