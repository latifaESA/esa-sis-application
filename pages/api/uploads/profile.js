/*
 * Created By: Ali Mroueh
 * Project: Online Application
 * File: pages\api\uploads\profile.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import formidable from "formidable";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { env } from "process";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  console.log('wsllll')
  if (req.method !== "POST") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  try{
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(200).send({ message: "Signin Required To Save Data" });
  }
  const { user } = session;

  // console.log('user from profile: ', user);
  // console.log('userId from profile: ', user.userid);
  const readFile = (file, saveLocally, place) => {
    const options = {};
    if (saveLocally) {
      options.uploadDir = place;

      // eslint-disable-next-line no-unused-vars
      options.filename = (name, ext, path1, form) => {
        if (
          path1.mimetype === "image/png" ||
          path1.mimetype === "image/jpeg" ||
          path1.mimetype === "image/jpg" 
        ) {
          let sourceDir = fs.readdirSync(place);

          sourceDir.forEach((file) => {
            const filePath = path.join(place, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
              fs.unlinkSync(filePath);
              // // console.log('Deleted file:', filePath);
            }
          });
          return Date.now().toString() + "_" + path1.originalFilename;
        } else {
          return res
            .status(200)
            .send({ status: 200, message: "file was not accepted" });
        }
      };
    }

    // options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
      form.parse(file, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });
  };

  const localDiskPath = path.parse(require("os").homedir()).root;
  // const directory = path.join(
  //   localDiskPath,
  //   'esa-applicants-data',
  //   'onlineUsers',
  //   `${user.name}-${user._id}`,
  //   'photo',
  //   'profile'
  // );
  const directory = path.join(
    localDiskPath,
    "sis-application-data",
    "Users",
    `PM3133`,
    "photo"
  );

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  await readFile(req, true, directory);

  let allimages = await fs.readdirSync(directory);
  // Return a response
  // return res.status(200).send({ secure_url: `${env.NEXTAUTH_URL}file/public/${user.name}-${user._id}/photo/profile/${allimages[0]}` });

  return res.status(200).send({
    secure_url: `${env.NEXTAUTH_URL}file/sis/Users/PM3133/photo/${allimages[0]}`,
  });

  }catch(error){
    console.log('the error is in profile.js in uploads in api : ', error)
    return
  }
  // return res.status(200).send(req)
}

export default handler;
