import _ from 'lodash'

export const formatName = (firstName, lastName) => {
  return `${firstName} ${lastName[0].toUpperCase()}.`;
};

export const isEqualTwoObjectsRoot = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

export const copyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  document.execCommand("copy");

  document.body.removeChild(textArea);
};

export const convertTutorIdToName = (academyId) => {
  return academyId.split('.')[0] + " " + academyId.split('.')[1][1]
}

function isArrayStringEqual(array, strArray) {
  try {
    console.log(array, strArray)
    const parsedArray = JSON.parse(strArray);

    return JSON.stringify(array.sort()) === JSON.stringify(parsedArray.sort());
  } catch (error) {
    console.log('Error parsing JSON:', error);
    return false;
  }
}

export const unsavedChangesHelper = (fieldValues, tutor) => {
  console.log(fieldValues, tutor)
  return (
    // tutor.AcademyId !== undefined && fieldValues.academyId !== undefined && tutor.AcademyId !== fieldValues.academyId ||
    tutor.Address1 !== undefined && fieldValues.add1 !== undefined && tutor.Address1 !== fieldValues.add1 ||
    tutor.Address2 !== undefined && fieldValues.add2 !== undefined && tutor.Address2 !== fieldValues.add2 ||
    tutor.CellPhone !== undefined && fieldValues.cell !== undefined && tutor.CellPhone !== fieldValues.cell ||
    tutor.CityTown !== undefined && fieldValues.city !== undefined && tutor.CityTown !== fieldValues.city ||
    tutor.Country !== undefined && fieldValues.country !== undefined && tutor.Country !== fieldValues.country ||
    tutor.FirstName !== undefined && fieldValues.fname !== undefined && tutor.FirstName !== fieldValues.fname ||
    tutor.GMT !== undefined && fieldValues.timeZone !== undefined && tutor.GMT !== fieldValues.timeZone ||
    tutor.Grades !== undefined && fieldValues.tutorGrades !== undefined && !isArrayStringEqual(fieldValues.tutorGrades, tutor.Grades)
    ||
    tutor.HeadLine !== undefined && fieldValues.headline !== undefined && tutor.HeadLine !== fieldValues.headline ||
    tutor.Introduction !== undefined && fieldValues.intro !== undefined && tutor.Introduction !== fieldValues.intro ||
    tutor.LastName !== undefined && fieldValues.lname !== undefined && tutor.LastName !== fieldValues.lname ||
    tutor.MiddleName !== undefined && fieldValues.mname !== undefined && tutor.MiddleName !== fieldValues.mname ||
    tutor.Motivate !== undefined && fieldValues.motivation !== undefined && tutor.Motivate !== fieldValues.motivation ||
    tutor.ResponseHrs !== undefined && fieldValues.response_zone !== undefined && tutor.ResponseHrs !== fieldValues.response_zone ||
    tutor.StateProvince !== undefined && fieldValues.state !== undefined && tutor.StateProvince !== fieldValues.state ||
    tutor.ZipCode !== undefined && fieldValues.zipCode !== undefined && tutor.ZipCode !== fieldValues.zipCode ||
    // tutor.StartVacation !== undefined && fieldValues.start !== undefined && tutor.StartVacation !== fieldValues.start ||
    // tutor.EndVacation !== undefined && fieldValues.end !== undefined && tutor.EndVacation !== fieldValues.end ||
    tutor.VacationMode !== undefined && fieldValues.vacation_mode !== undefined && tutor.VacationMode !== fieldValues.vacation_mode
  );
}

export const unsavedEducationChangesHelper = (fieldValues, tutor) => {
  return (
    (tutor?.EducationalLevel !== undefined && fieldValues.level !== undefined && tutor?.EducationalLevel !== fieldValues.level) ||
    (tutor?.BachCountry !== undefined && fieldValues.countryForAssociate !== undefined && tutor?.BachCountry !== fieldValues.countryForAssociate) ||
    (tutor?.CertCountry !== undefined && fieldValues.countryForCert !== undefined && tutor?.CertCountry !== fieldValues.countryForCert) ||
    (tutor?.MastCountry !== undefined && fieldValues.countryForMast !== undefined && tutor?.MastCountry !== fieldValues.countryForMast) ||
    (tutor?.DocCountry !== undefined && fieldValues.countryForDoc !== undefined && tutor?.DocCountry !== fieldValues.countryForDoc) ||
    (tutor?.DegCountry !== undefined && fieldValues.countryForDeg !== undefined && tutor?.DegCountry !== fieldValues.countryForDeg) ||
    (tutor?.College1 !== undefined && fieldValues.university1 !== undefined && tutor?.College1 !== fieldValues.university1) ||
    (tutor?.College2 !== undefined && fieldValues.university2 !== undefined && tutor?.College2 !== fieldValues.university2) ||
    (tutor?.DoctorateCollege !== undefined && fieldValues.university3 !== undefined && tutor?.DoctorateCollege !== fieldValues.university3) ||
    (tutor?.College1State !== undefined && fieldValues.state2 !== undefined && tutor?.College1State !== fieldValues.state2) ||
    (tutor?.College2State !== undefined && fieldValues.state3 !== undefined && tutor?.College2State !== fieldValues.state3) ||
    (tutor?.DoctorateState !== undefined && fieldValues.doctorateState !== undefined && tutor?.DoctorateState !== fieldValues.doctorateState) ||
    (tutor?.DegreeState !== undefined && fieldValues.state4 !== undefined && tutor?.DegreeState !== fieldValues.state4) ||
    (tutor?.Certificate !== undefined && fieldValues.certificate !== undefined && tutor?.Certificate !== fieldValues.certificate) ||
    (tutor?.CertificateState !== undefined && fieldValues.state5 !== undefined && tutor?.CertificateState !== fieldValues.state5) ||
    (tutor?.EducationalLevelExperience !== undefined && fieldValues.experience !== undefined && tutor?.EducationalLevelExperience !== fieldValues.experience) ||
    (tutor?.College1Year !== undefined && fieldValues.graduateYr1 !== undefined && tutor?.College1Year !== fieldValues.graduateYr1) ||
    (tutor?.College2StateYear !== undefined && fieldValues.graduateYr2 !== undefined && tutor?.College2StateYear !== fieldValues.graduateYr2) ||
    (tutor?.DegreeYear !== undefined && fieldValues.graduagteYr3 !== undefined && tutor?.DegreeYear !== fieldValues.graduagteYr3) ||
    (tutor?.DoctorateGradYr !== undefined && fieldValues.doctorateGraduateYear !== undefined && tutor?.DoctorateGradYr !== fieldValues.doctorateGraduateYear) ||
    (tutor?.CertificateExpiration !== undefined && fieldValues.expiration !== undefined && tutor?.CertificateExpiration !== fieldValues.expiration) ||
    (tutor?.WorkExperience !== undefined && fieldValues.workExperience !== undefined && tutor?.WorkExperience !== fieldValues.workExperience) ||
    tutor?.ThingsReferences !== undefined && fieldValues.references !== undefined && tutor?.ThingsReferences !== fieldValues.references ||
    (tutor?.Resume !== undefined && fieldValues.resumePath !== undefined && tutor?.Resume !== fieldValues.resumePath)
  );
}

export const capitalizeFirstLetter = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
}


export function getFileExtension(filename) {
  return filename.split('.').pop();
}

/**
 * 
 * @param {{}} dbState Db Values
 * @param {{}} currentState LocalCurrent Values
 * @returns Boolean - if dbValues = localValues
 */
export const compareStates = (dbState, currentState) => {
  console.log(dbState, currentState)
  if (!(Object.keys(dbState).length)) return false;

  for (const key in currentState) {
    // console.log(currentState[key], key, dbState?.[key], currentState[key] !== dbState?.[key], !_.isEqual(currentState[key], dbState[key]))
    if (_.isObject(currentState[key]) && !_.isEqual(currentState[key], dbState[key])) return true
    if (!_.isObject(currentState[key]) &&
      currentState[key] !== dbState?.[key]) {
      return true
    }
  }
  return false
};

