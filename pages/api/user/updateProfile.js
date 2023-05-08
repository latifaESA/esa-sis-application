/*
 * Created By: KANSO Adi/Mohammad Yassine
 * Project: SIS Application
 * File: pages\api\user\updateProfile.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
// import { getSession } from 'next-auth/react';

import bcryptjs from 'bcryptjs';
// import UserProfile from '../../../models/user/ProfileModel';
// import UserInfo from '../../../models/user/InfoModel';
import db from '../../../utilities/db';
import { UpdateUserpassword, UpdateData } from '../controller/queries';
import { connect, disconnect } from '../../../utilities/db';
import selection_data from '../../../utilities/selection_data';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import sis_app_logger from '../../api/logger';
import useragent from 'useragent';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  // FIXME:

  // const session = await getSession({ req });
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).send({ message: 'Signin Required To Update' });
  }

  const { user } = session;
  const { fname, lname, password, profileUrl } = req.body;

  // const profileUrl = req.body.profileUrl;

  const regularExpression =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;
  if (password && !regularExpression.test(password)) {
    res.status(422).json({
      message: 'Validation ERROR When Trying Update User Profile',
    });
    return;
  }
  const userAgent = req.headers['user-agent'];
  const userAgentinfo = useragent.parse(userAgent);
  if (selection_data.isMongoDb) {
    await db.connect();
    const toUpdateUser = await UserProfile.findById(user._id);

    if (fname) {
      toUpdateUser.fname = fname;
      await toUpdateUser.save();
    }
    if (lname) {
      toUpdateUser.lname = lname;
      await toUpdateUser.save();
    }
    if (password) {
      toUpdateUser.password = bcryptjs.hashSync(password.trim());
      await toUpdateUser.save();
    }
    if (profileUrl) {
      const updateProfileImage = await UserInfo.findOne({ user_id: user._id });
      updateProfileImage.profileUrl = profileUrl;
      await updateProfileImage.save();
      // sis_app_logger.info(
      //   `${new Date()}:updateprofile:${user.email}:${req.headers['user-agent']}`
      // );
    }
    sis_app_logger.info(
      `${new Date()}=${user.role}=update profile=${user.email}=${
        userAgentinfo.os.family
      }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
        userAgentinfo.source
      }=${userAgentinfo.device.family}`
    );

    await db.disconnect();
    res.send({
      message: 'User Profile Updated',
    });
  } else {
    // MySQL Code
    const connection = await connect();
    if (!connection.success) {
      const message = connection.message;
      sis_app_logger.error(
        `${new Date()}=From updateProfile page,connection unsuccess=1=${
          user.email
        }=${message}=${userAgentinfo.os.family}=${userAgentinfo.os.major}=${
          userAgentinfo.family
        }=${userAgentinfo.source}=${userAgentinfo.device.family}`
      );
      res.status(500).json({
        message: message,
      });
    } else {
      if (fname) {
        await UpdateData(
          connection,
          'user_personal_info',
          user._id,
          ['firstname', fname],
          ['lastname', lname]
        );
      }
      if (lname) {
        await UpdateData(
          connection,
          'user_personal_info',
          user._id,
          ['firstname', fname],
          ['lastname', lname]
        );
      }
      if (password) {
        await UpdateUserpassword(connection, password, fname, lname, user._id);
      }
      if (profileUrl) {
        await UpdateData(connection, 'user_document', user._id, [
          'profileUrl',
          profileUrl,
        ]);
      }

      await disconnect(connection);
      // sis_app_logger.info(
      //   `${new Date()}:updateprofile:${user.email}:${req.headers['user-agent']}`
      // );
      sis_app_logger.info(
        `${new Date()}=${user.role}=update profile=${user.email}=${
          userAgentinfo.os.family
        }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
          userAgentinfo.source
        }=${userAgentinfo.device.family}`
      );
      res.send({
        message: 'User Profile Updated',
      });
    }
  }
}

export default handler;
