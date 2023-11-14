import express, { Request, Response } from 'express';
import {pool} from '../Config/dataBase'


const crypto = require('crypto');

export const createProject=async (req: Request, res: Response) => {
    try {
      const { name, description, users } = req.body;
      if (!name|| !users) {
        return res.status(400).json({ error: 'Please provide name, description, and users' });
      }
  
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO projects (name, description, users) VALUES ($1, $2, $3) RETURNING *',
        [name, description, JSON.stringify(users)]
      );
  
      const newProject = result.rows[0];
      client.release();
  
      res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  export const getProjectbyId=async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM projects WHERE id = $1';
      const result = await client.query(query, [id]);
  
      if (result.rows.length === 0) {
        res.status(404).send('Project not found');
        return;
      }
  
      const project = result.rows[0];
      res.json({ [project.id]: { name: project.name } });
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send('Internal Server Error');
    }
  };
export const getAllProject=async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM projects';
      const result = await client.query(query);
  
      const projects: { [key: number]: { name: string } } = {};
      result.rows.forEach((project: { id: number; name: string }) => {
        projects[project.id] = { name: project.name };
      });
  
      res.json(projects);
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send('Internal Server Error');
    }
  };
  export const assignToProject=async (req: Request, res: Response) => {
    const { userId, projectId } = req.body;
  
    try {
      const client = await pool.connect();
      const query = 'INSERT INTO assignments (userId, projectId) VALUES ($1, $2) RETURNING *';
      const values = [userId, projectId];
  
      const result = await client.query(query, values);
      const newAssignment = result.rows[0];
  
      client.release();
  
      res.json({
        assignmentId: newAssignment.id,
        userId: newAssignment.userId,
        projectId: newAssignment.projectId,
      });
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send('Internal Server Error');
    }
  };
  export const updateProjectbyId=async (req: Request, res: Response) => {
    try {
      const projectId = req.params.id;
      const { name, description, users } = req.body;
      if (!name || !description || !users) {
        return res.status(400).json({ error: 'Please provide name, description, and users' });
      }
  
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE projects SET name = $1, description = $2, users = $3 WHERE projectid = $4 RETURNING *',
        [name, description, JSON.stringify(users), projectId]
      );
  
      const updatedProject = result.rows[0];
      client.release();
  
      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }



  export const CreateTasks= async(req:Request,res:Response)=>{
       try{
        const{ProjectId,description,EndTime,StartTime}=req.body
        if(!ProjectId || !description || !EndTime || !StartTime){
          return res.status(400).json({error:'please provide all the details'})
        }
        const client=await pool.connect()
        const result= await client.query('INSERT INTO tasks(ProjectId,description,StartTime,EndTime) VALUES ($1,$2,$3,$4) RETURNING *',[ProjectId,description,new Date(StartTime),new Date(EndTime)])
        const newTask=result.rows[0]
        client.release();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
       }
       catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });

      }
  }

  export const GetAllTasks = async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM tasks');
        const allTasks = result.rows;
        client.release();
        res.status(200).json({ tasks: allTasks });
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

