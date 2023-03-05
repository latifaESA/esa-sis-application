/*
 * Created By: Moetassem Chebbo
 * Project: SIS Application
 * File: pages\api\CRUD_Op\sendprofile.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import * as dateFn from 'date-fns';
import axios from 'axios';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send({ message: 'Signin Required To Save Data' });
  }
  const { user } = session;

  // const secure_url = req.body;
  const cloudURL = req.body.cloudURL;

  console.log('cloudURL', typeof cloudURL, cloudURL);

  const photoFileName = `${user.name}_${user.ID}_Image_${dateFn.format(
    Date.now(),
    'dd-MM-yyyy'
  )}.png`;

  const directory = path.join(
    process.cwd(),
    'public',
    'Files',
    'Users',
    user.ID.toString(),
    'Photo'
  );

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  console.log(directory);
  const response = await axios.get(cloudURL, {
    responseType: 'arraybuffer',
  });

  // Write the report file to the directory
  const reportFilePath = path.join(directory, photoFileName);
  console.log('reportFilePath', reportFilePath);
  fs.writeFileSync(reportFilePath, response.data);
  // fs.writeFileSync(reportFilePath,secure_url);

  console.log('report saved to:', reportFilePath);

  // Return a response
  // res.status(200).send({ reportURL: `/api/get-report?filePath=${encodeURIComponent(reportFilePath)}` });
  res
    .status(200)
    .send({
      cloudURL: `/Files/Users/${user.ID.toString()}/Photo/${photoFileName}`,
    });
}

export default handler;
