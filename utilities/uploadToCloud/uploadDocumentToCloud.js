/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: utilities\uploadToCloud\uploadDocumentToCloud.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import selection_data from '../selection_data';
import encrypt from '../encrypt_decrypt/encryptText';

async function uploadDocumentToCloud(uploadData, session, isPhoto, from) {
  // console.log('uploadData.fileList==', uploadData.fileList);
  let cloudURL = null;
  const imageFile = uploadData.fileList.find(
    (file) =>
      file.type === 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg'
  );
  const pdfFile = uploadData.fileList.find(
    (file) => file.type === 'application/pdf'
  );
  if (imageFile) {
    // console.log('imageFile==', imageFile);
    const formProfileData = new FormData();
    formProfileData.append('file', imageFile);
    let publicId;
    // Test If the uploaded document is the photo
    isPhoto
      ? (publicId = `SISUsers/${session.user.name}-${
          session.user.ID
        }/photo/${from}/${imageFile.name.replace(/[àâäçéèêëîïôöùûü]/g, '-')}`)
      : (publicId = `SISUsers/${session.user.name}-${
          session.user.ID
        }/application/${from}/${imageFile.name.replace(
          /[àâäçéèêëîïôöùûü]/g,
          '-'
        )}`);

    formProfileData.append('public_id', publicId);
    formProfileData.append('upload_preset', selection_data.upload_preset);
    // console.log('formProfileData==', formProfileData);
    try {
      if (isPhoto) {
        // Delete old folder resources,
        const encryptedBody = encrypt(
          JSON.stringify({
            userName: session.user.name,
            userID: session.user.ID,
            folder: `photo/${from}`,
          })
        );
        try {
          await axios.post(
            '/api/cloud/deleteFolderInCloud',
            {
              data: encryptedBody,
            },
            {
              timeout: selection_data.axios_timeout,
            }
          );
        } catch (error) {
          console.error(error);
        }

        // Send the Profile Image to the Cloudinary
        cloudURL = await axios
          .post(selection_data.cloudinary_image_url, formProfileData, {
            timeout: selection_data.axios_timeout,
          })
          .then((res) => res.data.secure_url)
          .catch((error) => {
            console.log('Error on sending to cloud:', error);
          });

        console.log('image cloudURL===>>', cloudURL);

        // Test if the Cloudinary URL is not corrupted
        if (cloudURL !== null)
          await axios
            .get(cloudURL)
            .then(async (response) => {
              if (response.status >= 200 && response.status < 300) {
                console.log('File is not corrupted');
                // send the profile image to the local HardDisk
                await axios
                  .post(
                    '/api/CRUD_Op/sendprofile',
                    {
                      cloudURL,
                    },
                    {
                      timeout: selection_data.axios_timeout,
                    }
                  )
                  .then((res) => res.data.cloudURL);
              } else {
                console.log('File may be corrupted');
                cloudURL = null;
              }
            })
            .catch((error) => {
              console.log(`Error fetching file: ${error}`);
              cloudURL = null;
            });
        // // test if the image is not Blanck
        // await axios
        //   .post(
        //     `https://api.cloudinary.com/v1_1/${selection_data.cloud_Name}/moderate/detection`,
        //     {
        //       url: cloudURL,
        //       moderation: 'aws_rek',
        //       type: 'unsafe',
        //     }
        //   )
        //   .then((response) => {
        //     const isBlank =
        //       response.data.moderation[0].detection.nsfw.score < 0.1;
        //     if (isBlank) {
        //       // The image is considered blank
        //       console.log('The image is blank');
        //     } else {
        //       // The image is not blank
        //       console.log('The image is not blank');
        //     }
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error);
        //   });

        return cloudURL;
      } else {
        // Delete old folder resources,
        const encryptedBody = encrypt(
          JSON.stringify({
            userName: session.user.name,
            userID: session.user.ID,
            folder: `application/${from}`,
          })
        );
        try {
          await axios.post(
            '/api/cloud/deleteFolderInCloud',
            {
              data: encryptedBody,
            },
            {
              timeout: selection_data.axios_timeout,
            }
          );
        } catch (error) {
          console.error(error);
        }

        cloudURL = await axios
          .post(selection_data.cloudinary_image_url, formProfileData, {
            timeout: selection_data.axios_timeout,
          })
          .then((res) => res.data.secure_url)
          .catch((error) => {
            console.log('Error on sending to cloud:', error);
          });
        // Test if the Cloudinary URL is not corrupted
        if (cloudURL !== null)
          await axios
            .get(cloudURL)
            .then((response) => {
              if (response.status >= 200 && response.status < 300) {
                // console.log('File is not corrupted');
              } else {
                // console.log('File may be corrupted');
                cloudURL = null;
              }
            })
            .catch((error) => {
              console.log(`Error fetching file: ${error}`);
              cloudURL = null;
            });
        return cloudURL;
      }
    } catch (error) {
      console.error(error);
    }
  } else if (pdfFile) {
    const formDocData = new FormData();

    formDocData.append('file', pdfFile);

    const publicId = `SISUsers/${session.user.name}-${
      session.user.ID
    }/application/${from}/${pdfFile.name.replace(/[àâäçéèêëîïôöùûü]/g, '-')}`;
    formDocData.append('public_id', publicId);

    formDocData.append('upload_preset', selection_data.upload_preset);

    // Delete old folder resources,
    const encryptedBody = encrypt(
      JSON.stringify({
        userName: session.user.name,
        userID: session.user.ID,
        folder: `application/${from}`,
      })
    );
    try {
      await axios.post(
        '/api/cloud/deleteFolderInCloud',
        {
          data: encryptedBody,
        },
        {
          timeout: selection_data.axios_timeout,
        }
      );
    } catch (error) {
      console.error(error);
    }

    try {
      cloudURL = await axios
        .post(selection_data.cloudinary_image_url, formDocData, {
          timeout: selection_data.axios_timeout,
        })
        .then((res) => res.data.secure_url)
        .catch((error) => {
          console.log('Error on sending to cloud:', error);
        });
      console.log('PDF cloudURL====>> ', cloudURL);
      // Test if the Cloudinary URL is not corrupted
      if (cloudURL !== null)
        await axios
          .get(cloudURL)
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              // console.log('File is not corrupted');
            } else {
              // console.log('File may be corrupted');
              cloudURL = null;
            }
          })
          .catch((error) => {
            console.log(`Error fetching file: ${error}`);
            cloudURL = null;
          });
      return cloudURL;
    } catch (error) {
      console.error(error);
    }
  }
}

export default uploadDocumentToCloud;
