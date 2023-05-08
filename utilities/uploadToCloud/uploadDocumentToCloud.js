/*
 * Created By: Moetassem Chebbo
 * Project: SIS Application
 * File: utilities\uploadToCloud\uploadToCloudBBA.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import selection_data from '../selection_data';


async function uploadDocumentToCloud(uploadData, session, isPhoto) {
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
      ? (publicId = `SIS/users/${session.user.name}-${
          session.user.ID
        }/photo/${imageFile.name.replace(/[àâäçéèêëîïôöùûü]/g, '-')}`)
      : (publicId = `SIS/users/${session.user.name}-${
          session.user.ID
        }/application/${imageFile.name.replace(/[àâäçéèêëîïôöùûü]/g, '-')}`);

    formProfileData.append('public_id', publicId);
    formProfileData.append('upload_preset', selection_data.upload_preset);
    // console.log('formProfileData==', formProfileData);
    try {
      let cloudURL  = await axios.post(
        selection_data.cloudinary_image_url,

        formProfileData
      ).then((res) => res.data.secure_url);
     
       cloudURL=await axios.post('/api/CRUD_Op/sendprofile',{
        cloudURL,
}).then(res => res.data.cloudURL);
console.log("cloudURL",cloudURL)
      return cloudURL;
    } catch (error) {
      console.error(error);
    }
  } else if (pdfFile) {
    // // Parse the PDF file
    // const fileUrl = URL.createObjectURL(pdfFile);
    // const pdf = await pdfjsLib.getDocument(fileUrl).promise;
    // const numPages = pdf.numPages;
    // // Render the first page of the PDF as an image
    // const images = [];
    // for (let pagenum = 1; pagenum <= numPages; pagenum++) {
    //   const page = await pdf.getPage(pagenum);
    //   const scale = 2;
    //   const viewport = page.getViewport({ scale });
    //   const canvas = document.createElement("canvas");
    //   const context = canvas.getContext("2d");
    //   canvas.height = viewport.height;
    //   canvas.width = viewport.width;
    //   await page.render({ canvasContext: context, viewport }).promise;

    //   // Convert the canvas to a data URL and send it to Cloudinary
    //    images.push(canvas.toDataURL("image/png"));
    //    console.log(`Page ${pagenum}: ${images}`);
    // }

    //   const formCVData = new FormData();
    //  images.forEach(image => formCVData.append("file", image));
    //   formCVData.append("upload_preset", selection_data.upload_preset);
    //   try {
    //     const response = await axios.post(
    //       selection_data.cloudinary_document_url,
    //       formCVData
    //     );
    //     const cloudURL = response.data.secure_url;
    //     return cloudURL;

    //   } catch (error) {
    //     console.error(error);
    //   }

    const formDocData = new FormData();

    formDocData.append('file', pdfFile);

    const publicId = `SIS/users/${session.user.name}-${session.user.ID}/application/${pdfFile.name}`;
    formDocData.append('public_id', publicId);

    formDocData.append('upload_preset', selection_data.upload_preset);

    try {
      const response = await axios.post(
        selection_data.cloudinary_image_url,

        formDocData
      );
      const cloudURL = response.data.secure_url;
      return cloudURL;
    } catch (error) {
      console.error(error);
    }
  }
}

export default uploadDocumentToCloud;
