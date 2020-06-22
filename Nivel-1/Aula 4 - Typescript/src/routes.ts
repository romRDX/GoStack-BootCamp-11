import { Request, Response, response } from 'express';
import createUser from './services/CreateUser';

export function HelloReact( request: Request, response: Response){
  const user = createUser({
    email: 'teste@gmail.com',
    password: '12345',
    techs: [ 'ReactJS', 'NodeJS', { title: 'RDX', experience: 100}],
  });

  return response.json({message: 'hello React'});
}