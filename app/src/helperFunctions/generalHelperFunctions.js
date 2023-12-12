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
  return academyId.split('.')[0] + " "+academyId.split('.')[1][1]
}

export const unsavedChangesHelper = (fieldValues,tutor) => {
  // if(tutor.FirstName!==fieldValues.fname || tutor.LastName!==fieldValues.lname) {
  //   return true;
  // }
  return (
    tutor.AcademyId !== undefined && fieldValues.academyId !== undefined && tutor.AcademyId !== fieldValues.academyId ||
    tutor.Address1 !== undefined && fieldValues.add1 !== undefined && tutor.Address1 !== fieldValues.add1 ||
    tutor.Address2 !== undefined && fieldValues.add2 !== undefined && tutor.Address2 !== fieldValues.add2 ||
    tutor.BackgroundVerified !== undefined && fieldValues.backgroundVerified !== undefined && tutor.BackgroundVerified !== fieldValues.backgroundVerified ||
    tutor.CellPhone !== undefined && fieldValues.cell !== undefined && tutor.CellPhone !== fieldValues.cell ||
    tutor.CityTown !== undefined && fieldValues.city !== undefined && tutor.CityTown !== fieldValues.city ||
    tutor.Country !== undefined && fieldValues.country !== undefined && tutor.Country !== fieldValues.country ||
    tutor.FirstName !== undefined && fieldValues.fname !== undefined && tutor.FirstName !== fieldValues.fname ||
    tutor.GMT !== undefined && fieldValues.timeZone !== undefined && tutor.GMT !== fieldValues.timeZone ||
    tutor.Grades !== undefined && fieldValues.grades !== undefined && tutor.Grades !== fieldValues.grades ||
    tutor.HeadLine !== undefined && fieldValues.headline !== undefined && tutor.HeadLine !== fieldValues.headline ||
    tutor.Introduction !== undefined && fieldValues.intro !== undefined && tutor.Introduction !== fieldValues.intro ||
    tutor.LastName !== undefined && fieldValues.lname !== undefined && tutor.LastName !== fieldValues.lname ||
    tutor.MiddleName !== undefined && fieldValues.mname !== undefined && tutor.MiddleName !== fieldValues.mname ||
    tutor.Motivate !== undefined && fieldValues.motivation !== undefined && tutor.Motivate !== fieldValues.motivation ||
    tutor.Photo !== undefined && fieldValues.photo !== undefined && tutor.Photo !== fieldValues.photo ||
    tutor.ResponseHrs !== undefined && fieldValues.response_zone !== undefined && tutor.ResponseHrs !== fieldValues.response_zone ||
    tutor.StateProvince !== undefined && fieldValues.state !== undefined && tutor.StateProvince !== fieldValues.state ||
    tutor.Video !== undefined && fieldValues.video !== undefined && tutor.Video !== fieldValues.video ||
    tutor.ZipCode !== undefined && fieldValues.zipCode !== undefined && tutor.ZipCode !== fieldValues.zipCode
    // Add more checks for other fields as needed
  );
}