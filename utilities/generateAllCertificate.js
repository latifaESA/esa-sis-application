import jsPDF from "jspdf";

const generateAllCertificates = async (students) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  try {
    // Load certificate template image
    const imgUrl = "/Certificate digital Marketing Empty template.jpg";
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });



    // Loop through each student and generate a certificate
    students.forEach((student, index) => {
      // Format first name: capitalize first letter, lowercase the rest
      const formattedFirstName = student.student_firstname.charAt(0).toUpperCase() + student.student_firstname.slice(1).toLowerCase();

      // Format last name: all uppercase
      const formattedLastName = student.student_lastname.toUpperCase();
      // Extract month and year from academic_year (assuming format "Apr-25")
      const startMonth = student.academic_year.split(' ')[0];
      const year = student.academic_year.split(' ')[1];
      // Extract only the month from graduated_year (assuming format "April 2025")
      const endMonth = student.graduated_year.split(' ')[0];

      // Format as "Apr-May, 2025"
      const date = `${startMonth}-${endMonth}, ${year}`;
      if (index !== 0) doc.addPage(); // Add new page for each certificate except the first

      const imgProps = doc.getImageProperties(dataUrl);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);

      doc.addImage(dataUrl, "JPEG", 0, 0, imgProps.width * ratio, imgProps.height * ratio);

      // Student name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.text(`${formattedFirstName} ${formattedLastName}`, 148, 98, { align: "center" });

      // Graduation date
      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text(date, 148, 145, { align: "center" });
    });

    // Save as single PDF file
    doc.save("All_Students_Certificates.pdf");
  } catch (error) {
    console.error("Error generating certificates:", error);
  }
};

export default generateAllCertificates;
