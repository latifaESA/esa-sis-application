/*
 * Created By:MohammadYassine
 * Project: SIS Application
 * File: components/Admin/settings/dropDownList/DropDownList.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
import nextConnect from 'next-connect';
import { ReadDropdown } from './queries';
import { connect, disconnect } from '../../../utilities/db';
import encrypt from '../../../utilities/encrypt_decrypt/encryptText';

const handler = nextConnect().get(async (req, res) => {
  const connection = await connect();
  const majors = await ReadDropdown(connection, 'major');
  const status = await ReadDropdown(connection, 'status');
  let response = { majors: majors, status: status };
  if (!response) {
    res.status(500).json({ message: 'failed' });
    await disconnect(connection);
  }
  const encryptedBody = encrypt(JSON.stringify(response));
  res.status(200).json({ message: 'success', data: encryptedBody });
  await disconnect(connection);
});
export default handler;
