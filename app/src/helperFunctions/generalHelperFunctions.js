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