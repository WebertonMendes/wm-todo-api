import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: CallableFunction,
) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(
      new HttpException(
        'Error saving file: Apenas arquivos PDF são permitidos!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: CallableFunction,
) => {
  const extension = file.originalname.split('.').pop();
  const fileName = `${req.query.task_id}.${extension}`;

  callback(null, fileName);
};

export const deleteFile = async (filename: string) => {
  try {
    await fs.promises.stat(filename);
  } catch (error) {
    return;
  }

  await fs.promises.unlink(filename);
};
