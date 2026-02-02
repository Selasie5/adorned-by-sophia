import {nanoid} from 'nanoid';


export const genPassword =(length:number=12): string =>
{
  return nanoid(length);
}
