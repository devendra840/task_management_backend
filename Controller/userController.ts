import express, { Request, Response } from 'express';
import {pool} from '../Config/dataBase'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const crypto = require('crypto');

export const Register=async (req: Request, res: Response) => {
    console.log(req.body);
  
    try {
      const client = await pool.connect();
      const { email,username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (email,username, password) VALUES ($1, $2, $3)';
      const values = [email,username, hashedPassword];
  
      await client.query(query, values);
      client.release();
  
      res.send({ msg: 'User saved' });
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send(error);
    }
  };

  export const Login=async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        res.status(401).send('Invalid credentials');
        return;
      }
  
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
          
        res.status(401).send('Invalid credentials');
        return;
      }
  
      const accessToken = jwt.sign({ username: user.username }, crypto.randomBytes(64).toString('hex'));
      res.json({ accessToken: accessToken });
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send('Internal Server Error');
    }
  };