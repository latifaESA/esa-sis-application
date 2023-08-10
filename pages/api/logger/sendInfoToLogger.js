/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: pages\api\logger\sendInfoToLogger.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import decrypt from "../../../utilities/encrypt_decrypt/decryptText";
import sis_app_logger from "../logger";
import useragent from "useragent";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  const encryptedBody = req.body.data;
  // // console.log(encryptedBody);
  const { email, role, info } = JSON.parse(decrypt(encryptedBody));
  const userAgent = req.headers["user-agent"];
  const userAgentinfo = useragent.parse(userAgent);
  sis_app_logger.info(
    `${new Date()}=${role}=${info}=${email}=${userAgentinfo.os.family}=${
      userAgentinfo.os.major
    }=${userAgentinfo.family}=${userAgentinfo.source}=${
      userAgentinfo.device.family
    }`
  );
  res.send({
    message: "logged",
  });
}
