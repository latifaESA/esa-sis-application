/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\api\logger\sendErrorToLogger.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import decrypt from "../../../utilities/encrypt_decrypt/decryptText";
import sis_app_logger from "../logger";
import useragent from "useragent";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  try{
  const encryptedBody = req.body.data;
  // // console.log(encryptedBody);
  console.log('enc' . encryptedBody)
  const { email, role, info, error } = JSON.parse(decrypt(encryptedBody));
  const userAgent = req.headers["user-agent"];
  const userAgentinfo = useragent.parse(userAgent);
  sis_app_logger.error(
    `${new Date()}=${role}=${info}=${email}=${error}=${
      userAgentinfo.os.family
    }=${userAgentinfo.os.major}=${userAgentinfo.family}=${
      userAgentinfo.source
    }=${userAgentinfo.device.family}`
  );
  return res.send({
    message: "logged",
  });
  }catch(error){
    console.log('the error is in sendErrorToLogger.js in logger in api : ', error)
    return
  }
}
