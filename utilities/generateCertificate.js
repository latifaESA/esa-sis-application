// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const generateCertificate = async () => {
//   const doc = new jsPDF({
//     orientation: "landscape",
//     unit: "mm",
//     format: "a4"
//   });

//   // Add border
//   doc.setLineWidth(1.5);
//   doc.rect(10, 10, 277, 190);

//   // Add decorative lines
//   doc.setLineWidth(0.5);
//   doc.line(50, 45, 245, 45); // Under header
//   doc.line(50, 135, 245, 135); // Above signature

//   // Set main font styles
//   doc.setFontSize(28);
//   doc.setFont("helvetica", "bold");
//   doc.text("ESA BUSINESS SCHOOL", 148, 35, { align: "center" });

//   // Certificate text
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "normal");
//   doc.text("This is to certify that", 148, 60, { align: "center" });

//   // Recipient name
//   doc.setFontSize(32);
//   doc.setFont("helvetica", "bold");
//   doc.text("Sandra HITTI", 148, 85, { align: "center" });

//   // Certificate details
//   doc.setFontSize(20);
//   doc.setFont("helvetica", "normal");
//   doc.text("has successfully completed the", 148, 100, { align: "center" });
//   doc.setFont("helvetica", "bold");
//   doc.text("Digital Marketing Certificate", 148, 115, { align: "center" });

//   // Dates
//   doc.setFontSize(16);
//   doc.setFont("helvetica", "normal");
//   doc.text("March - May, 2024", 148, 130, { align: "center" });

//   // Signature section using autoTable
//   autoTable(doc, {
//     startY: 145,
//     body: [
//       [
//         {
//           content: "Maxence DUAULT\nGeneral Director\nESA Business School",
//           styles: { fontStyle: 'bold', halign: 'right' }
//         }
//       ]
//     ],
//     theme: 'plain',
//     styles: {
//       fontSize: 14,
//       cellPadding: 0,
//       lineColor: [0, 0, 0],
//       lineWidth: 0
//     }
//   });

//   // Save PDF
//   doc.save("esa-certificate.pdf");
// };

// export default generateCertificate;

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import selection_data from "./selection_data";

// const generateCertificate = async () => {
//   const doc = new jsPDF({
//     orientation: "landscape",
//     unit: "mm",
//     format: "a4"
//   });

//   // Add background decorative elements
//   // doc.setDrawColor(240, 240, 240);
//   // doc.line(0, 70, 210, 10); // Top diagonal line
//   // doc.line(210, 10, 0, 130); // Bottom diagonal line

//   // Add background decorative elements (diagonal lines)
//   doc.setDrawColor(240, 240, 240); // Light gray color
//   doc.setLineWidth(1);
//   doc.line(0, 70, 210, 10); // Top diagonal line
//   doc.line(210, 10, 0, 130); // Bottom diagonal line

//   // Add logo
//   // doc.setFontSize(30);
//   // doc.setTextColor(0, 72, 144); // Blue color
//   // doc.text("ESA", 148, 35, { align: "center" });
//   // doc.setFontSize(16);
//   // doc.text("BUSINESS SCHOOL", 148, 45, { align: "center" });

//   let old_height = 284;
//   let old_width = 177;
//   let aspect_ratio = old_width / old_height;
//   let new_width = 50;
//   let new_height = aspect_ratio * new_width;

//   doc.addImage(
//     '/esa.png',
//     "PNG",
//     130,
//     7,
//     new_height,
//     new_width,
//     undefined,
//     "FAST"
//   );

//   // Certificate text
//   doc.setFontSize(18);
//   doc.setTextColor(0, 0, 0);
//   doc.text("This is to certify that", 148, 60, { align: "center" });

//   // Recipient name
//   doc.setFontSize(32);
//   doc.text("Sandra HITTI", 148, 85, { align: "center" });

//   // Certificate details
//   doc.setFontSize(20);
//   doc.text("has successfully completed the", 148, 100, { align: "center" });
//   doc.setFontSize(24);
//   doc.setTextColor(0, 40, 87);
//   doc.setFont("helvetica", "bold"); // Set font to bold
//   doc.text("Digital Marketing Certificate", 148, 115, { align: "center" });

//   // Dates
//   doc.setFontSize(16);
//   doc.setTextColor(0, 0, 0);
//   doc.setFont("helvetica", "normal");
//   doc.text("March - May, 2024", 148, 130, { align: "center" });

//   doc.addImage(
//     '/images/signature-finale-maxence-bleue.png',
//     "PNG",
//     130,
//     135,
//     40,
//     20,
//     undefined,
//     "FAST"
//   );


//   // Signature section
//   doc.setFontSize(14);
//   doc.text("Maxence DUAULT", 148, 160, { align: "center" });
//   doc.setFontSize(12);
//   doc.text("General Director", 148, 170, { align: "center" });
//   doc.text("ESA Business School", 148, 178, { align: "center" });

  
//   // Add CCI Paris Ile-de-France Education shape
//   const cciOldWidth = 177; // Original image width (adjust accordingly)
//   const cciOldHeight = 284; // Original image height (adjust accordingly)
//   const cciAspectRatio = cciOldWidth / cciOldHeight;
//   const cciNewWidth = 35; // Desired display width
//   const cciNewHeight = cciNewWidth / cciAspectRatio;

//   doc.addImage(
//     '/cci-logo.png', // Ensure this path is correct
//     "PNG",
//     230, // X-coordinate (right side)
//     160, // Y-coordinate (above footer)
//     cciNewWidth,
//     cciNewHeight,
//     undefined,
//     "FAST"
//   );

//   // Add signature line
//   // doc.setLineWidth(0.5);
//   // doc.line(100, 150, 150, 150); // Signature line

//   // Save PDF
//   doc.save("esa-certificate.pdf");
// };

  const generateCertificate = async (name, date) => {
    const doc = new jsPDF({
      orientation: "landscape", // Adjust based on your template
      unit: "mm",
      format: "a4",
    });

    try {
      // Load certificate image (JPG template)
      const imgUrl = "/Certificate digital Marketing Empty template.jpg";
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      console.log('one')
      console.log('the blob: ', blob)
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        console.log('here')
        reader.readAsDataURL(blob);
      });

      // Add background image
      const imgProps = doc.getImageProperties(dataUrl);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
      
      doc.addImage(
        dataUrl,
        "JPEG",
        0,
        0,
        imgProps.width * ratio,
        imgProps.height * ratio
      );

      // Configure text styling
      doc.setFont("helvetica");
      // doc.setFontSize(16);

      // Add name (adjust x/y coordinates)
      // doc.text("name", 105, 120, { align: "center" }); // Center-aligned

      //   // Recipient name
  doc.setFontSize(32);
  doc.text(name, 148, 98, { align: "center" });

      // Add date (adjust y-coordinate)
      // doc.setFontSize(12);
      // doc.text(`Completed on: date`, 105, 140, { align: "center" });
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(date, 148, 145, { align: "center" });
      // Save PDF
      doc.save("digital-marketing-certificate.pdf");
    } catch (error) {
      console.error("Certificate generation failed:", error);
    }
  };
export default generateCertificate;