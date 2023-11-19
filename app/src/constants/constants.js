// constants.js

export const hours = [
  ["12:00 am", "1:00 am", "midnight"],
  ["1:00 am", "2:00 am", "midnight"],
  ["2:00 am", "3:00 am", "midnight"],
  ["3:00 am", "4:00 am", "midnight"],
  ["4:00 am", "5:00 am", "midnight"],
  ["5:00 am", "6:00 am", "midnight"],
  ["6:00 am", "7:00 am", "midnight"],
  ["7:00 am", "8:00 am", "midnight"],
  ["8:00 am", "9:00 am"],
  ["9:00 am", "10:00 am"],
  ["10:00 am", "11:00 am"],
  ["11:00 am", "12:00 pm"],
  ["12:00 pm", "1:00 pm"],
  ["1:00 pm", "2:00 pm"],
  ["2:00 pm", "3:00 pm"],
  ["3:00 pm", "4:00 pm"],
  ["4:00 pm", "5:00 pm"],
  ["5:00 pm", "6:00 pm"],
  ["6:00 pm", "7:00 pm"],
  ["7:00 pm", "8:00 pm"],
  ["8:00 pm", "9:00 pm"],
  ["9:00 pm", "10:00 pm", "midnight"],
  ["10:00 pm", "11:00 pm", "midnight"],
  ["11:00 pm", "12:00 am (midnight)", "midnight"],
];


export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Holidays"
];


export const monthFormat = 'MMM D, YY';
export const wholeDateFormat = 'ddd, MMM D, hh:mm a';
export const slotPillDateFormat = 'MMM D, hh a'

export const loggedInStudent = {
  sid: 1,
  firstName: "Naomi",
  middleName: "C",
  lastName: "Marom",
  email: "ddiffo@gmail.com",
  password: "qwertyui",
  cell: 15166088464,
  language: "English",
  ageGrade: "9th",
  grade: "",
  address1: "476 Shotwell Rd",
  address2: "Ste 102",
  city: "Clayton",
  state: "CA",
  zipCode: "27527",
  country: "USA",
  gmt: "+03",
  parentEmail: "ddiffo@gmail.com",
  parentFirstName: "Marom",
  parentLastName: "Naomi",
  academyId: "Naomi. C. M8bc074",
  screenName: "Naomi. C. M",
  photo: "data:image/png;ba...", // Replace with actual image data
  status: "Active"
}
export const loggedInTutor = {
  SID: '1',
  Photo: "photo string",
  Video: "video string",
  FirstName: "Michael",
  MiddleName: "C",
  LastName: "Marom",
  Address1: "476 Shotwell Rd",
  Address2: "Ste 102",
  CityTown: "Clayton",
  StateProvince: "NC",
  ZipCode: "27520",
  Country: "USA",
  Email: "michael_marom@yahoo.com",
  CellPhone: "15166088464",
  GMT: "+07",
  ResponseHrs: "48 Hours",
  TutorScreenname: "Michael. C. M",
  HeadLine: "hello world",
  Introduction: "hello world",
  Motivate: "hello world",
  Password: "qwertyui",
  IdVerified: null,
  BackgroundVerified: null,
  AcademyId: "Michael. C. M5ea887",
  Status: "Active",
  Grades: ["8th grade", "9th grade", "7th grade", "10th grade"]
}

const setDefaultHours = `
update  TutorSetup set disableHoursRange = '[["1:00 am","2:00 am"],["2:00 am","3:00 am"],["3:00 am","4:00 am"],["4:00 am","5:00 am"],["5:00 am","6:00 am"],["7:00 am","8:00 am"],["9:00 pm","10:00 pm"],["10:00 pm","11:00 pm"],["11:00 pm","12:00 am (midnight)"],["6:00 am","7:00 am"],["12:00 am","1:00 am","midnight"]]'
ALTER TABLE TutorSetup
add disableHoursRange VARCHAR(MAX) DEFAULT '[["1:00 am","2:00 am"],["2:00 am","3:00 am"],["3:00 am","4:00 am"],["4:00 am","5:00 am"],["5:00 am","6:00 am"],["7:00 am","8:00 am"],["9:00 pm","10:00 pm"],["10:00 pm","11:00 pm"],["11:00 pm","12:00 am (midnight)"],["6:00 am","7:00 am"],["12:00 am","1:00 am","midnight"]]'
`
export const loggedInAdmin = {}