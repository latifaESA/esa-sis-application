/*
 * Created By:MohammadYassine
 * Project: SIS Application
 * File: components/Admin/settings/dropDownList/DropDownList.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
import nextConnect from 'next-connect';
import { getAll } from './queries';
import { connect, disconnect } from '../../../utilities/db';
import encrypt from '../../../utilities/encrypt_decrypt/encryptText';
import sis_app_logger from '../../api/logger';
import useragent from 'useragent';

// import cors from 'cors';
// // Add CORS middleware
// handler.use(
//   cors({
//     origin: 'http://localhost:3000',
//   })
// );

const handler = nextConnect().get(async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const userAgentinfo = useragent.parse(userAgent);

  const connection = await connect();

  if (!connection.success) {
    const message = connection.message;
    sis_app_logger.error(
      `${new Date()}=From settingdata,connection unsuccess=---=---=${message}=${
        userAgentinfo.os.family
      }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
        userAgentinfo.source
      }=${userAgentinfo.device.family}`
    );
    res.status(500).json({
      message: message,
    });
  } else {
    console.log('successfully reading appVar');
    const setting = await getAll(connection, 'settings');
    let response = { setting: setting };
    console.log("------",response.setting.rows[0])
    if (!response) {
      res.status(500).json({ message: 'failed' });
      await disconnect(connection);
    }
    const encryptedBody = encrypt(JSON.stringify(response.setting.rows[0]));
    res.status(200).json({ message: 'success', data: encryptedBody });
    await disconnect(connection);
  }
});
export default handler;
