/*
 * Created By: Ali Mroueh
 * Project: Online Application
 * File: pages\api\CRUD_Op\sendreport.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2022 ESA
 */
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { env } from "process";


export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  console.log("upload" , req)

  if (req.method !== 'POST') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send({ message: 'Signin Required To Save Data' });
  }
  const { user } = session;


  const readFile = (file, saveLocally, place) => {

   
    const options = {};
    if (saveLocally) {
      options.uploadDir = place;
      

      // eslint-disable-next-line no-unused-vars
      options.filename = (name, ext, path1, form) => {
        console.log("name",name)
        
        if (
          path1.mimetype === 'application/pdf' ||
          path1.mimetype === 'application/x-pdf' ||
          path1.mimetype === 'image/png' ||
          path1.mimetype === 'image/jpeg' ||
          path1.mimetype === 'image/jpg'
        ) {

          let sourceDir = fs.readdirSync(place);
          

          sourceDir.forEach((file) => {
            const filePath = path.join(place, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
              // fs.unlinkSync(filePath);
              // console.log('Deleted file:', filePath);
            }
          });
          const name = 'batoul'
          return 'attendance-' + Date.now().toString() + '_' + path1.name;
        } else {
          return res
            .status(200)
            .send({ status: 401, message: 'file was not accepted' });
        }
      };
    }

    // options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);
    
    return new Promise((resolve, reject) => {
     
      form.parse(file, (err, fields, files) => {
        if (err) reject(err);
        console.log("fields" , fields)
       
        resolve({ fields, files });
      });
      
    });

  };

  const localDiskPath = path.parse(require('os').homedir()).root;

  const directory = localDiskPath + '/sis-application-data/Sis-documents/attendance';

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  await readFile(req, true, directory);
  console.log(directory)

  let attendance_file = await fs.readdirSync(directory);
 
 
  // Return a response
  return res.status(200).send({ url: `${env.ONLINE_APPLICATION_URL}/file/sis/Sis-documents/attendance/${attendance_file.slice(-1)}` });

// return res.status(200).send(req)

}

export default handler;
