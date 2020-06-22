interface TechObject {
  title: string;
  experience: number;
}

interface CreaterUserData {
  name?: string;
  email: string;
  password: string;
  techs: Array<string | TechObject>;
};

export default function createrUser({ name, email, password}: CreaterUserData){
  const user = {
    name,
    email,
    password,
  }

  return user;
}