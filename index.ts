import express, { Request, Response } from 'express';
import {pool} from './Config/dataBase'
import { createTableQuery } from './Model/userModel';
import { Register,Login} from './Controller/userController';
import { createProject,getProjectbyId,getAllProject,assignToProject, updateProjectbyId, CreateTasks, GetAllTasks} from './Controller/projectController';
const crypto = require('crypto');

const app = express();



app.use(express.json());


pool.query(createTableQuery, (err, res) => {
  if (err) {
    console.error('Error creating table', err);
  } else {
    console.log('tables are ready');
  }
});


  app.post('/register', Register);

  app.post('/login', Login);


  app.post('/project', createProject);
  app.get('/project/:id', getProjectbyId);
  app.get('/project', getAllProject);

  app.post('/assign-to-project', assignToProject);
  app.put('/project/:id',updateProjectbyId);

  app.post('/create-task',CreateTasks);
  app.get('/allTasks',GetAllTasks)



pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');

  app.listen(8000, () => {
    console.log('Server is started');
  });
});
