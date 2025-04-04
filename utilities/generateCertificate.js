import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import selection_data from "./selection_data";


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
      doc.save(`${name}.pdf`);
    } catch (error) {
      console.error("Certificate generation failed:", error);
    }
  };
export default generateCertificate;