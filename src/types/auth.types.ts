
// import { Categories } from "@prisma/client";
export interface signUpTypes{
    name: string;
    email: string;
    password: string;
    conformPassword: string;
    EmplyID:string;
    DateOfJoining?: Date;
}

export interface loginTypes{
    EmplyID: string;
    password: string;
}


export interface createArticleTypes{
    title: string;
    content: string;
    thumbnail: string;
    description: string;
    categories:Categories;
    tags: string[];
}
export enum Categories {
  RESULT,
  JOB,
  ADMITCARD,
  ANSWERKEY,
  ADMISSION,
  SYLLABUS,
  CERTIFICATE
}
 