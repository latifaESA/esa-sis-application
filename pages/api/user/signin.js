/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\api\user\signin.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import { signIn } from 'next-auth/react';

async function handler(req, res) {
  const email = req.query.email;
  const password = req.query.password;
  // console.log(req.query);
  // const proto =
  //   req.headers['x-forwarded-proto'] || req.connection.encrypted
  //     ? 'https'
  //     : 'http';

  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    console.log('Result=', result);
    if (result.error) {
      res.status(400).json({
        message: 'signed in failed',
      });
    }
    // else {
    //   res.writeHead(302, {
    //     Location: `${proto}://${req.headers.host}/user/studentapplication/studentInfoStep_1`,
    //   });
    //   res.end();
    // }
  } catch (err) {
    res.status(400).json({
      message: 'signed in failed',
    });
  }

  // res.writeHead(302, {
  //   Location: `${proto}://${req.headers.host}/user/studentapplication/studentInfoStep_1`,
  // });
  // res.end();
}

export default handler;
