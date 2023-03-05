/*
 * Created By: KANSO Adi
 * Project: SIS Application
 * File: utilities\NavbarRef\navigationRef.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */
function NavigationRef(role, major, locale) {
  let href;
  if (role === '1') {
    switch (true) {
      case major === 'BBA (Bachelor in Business Administration)': {
        locale === 'en-US'
          ? (href = `/user/studentapplication/studentInfoBBA`)
          : (href = `/${locale}/user/studentapplication/studentInfoBBA`);
        return href;
      }
      case major ===
        'MSM (Mastère de Spécialisation en Marketing et Communication)' ||
        major === 'EMFM (Executive Master in Financial Management)' ||
        major === 'MEMS (Master Executif en Management de la Santé)': {
        locale === 'en-US'
          ? (href = `/user/studentapplication/studentInfo_MSM_EMFM_MEMS`)
          : (href = `/${locale}/user/studentapplication/studentInfo_MSM_EMFM_MEMS`);
        return href;
      }
      case major === 'MENT (Masters in Entrepreneurship)' ||
        major === 'MIAD (Master in International Affairs and Diplomacy)' ||
        major === 'MIM (International Masters In Management)': {
        locale === 'en-US'
          ? (href = `/user/studentapplication/studentInfo_MENT_MIAD_MIM`)
          : (href = `/${locale}/user/studentapplication/studentInfo_MENT_MIAD_MIM`);
        return href;
      }
      case major === 'DBA (Doctorate in Business Administration)': {
        locale === 'en-US'
          ? (href = `/user/studentapplication/studentInfo_DBA`)
          : (href = `/${locale}/user/studentapplication/studentInfo_DBA`);
        return href;
      }
      case major === 'MBA (Master in Business Administration)' ||
        major === 'EMBA (Executive Masters in Business Administration)': {
        locale === 'en-US'
          ? (href = `/user/studentapplication/studentInfo_MBA_EMBA`)
          : (href = `/${locale}/user/studentapplication/studentInfo_MBA_EMBA`);
        return href;
      }
    }
  } else {
    href = '/admin/dashboard';
    return href;
  }
}
export default NavigationRef;
