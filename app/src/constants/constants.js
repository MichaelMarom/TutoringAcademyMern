// constants.js

export const hours = [
  { start: "12:00 am", end: "1:00 am", midnight: true },
  { start: "1:00 am", end: "2:00 am", midnight: true },
  { start: "2:00 am", end: "3:00 am", midnight: true },
  { start: "3:00 am", end: "4:00 am", midnight: true },
  { start: "4:00 am", end: "5:00 am", midnight: true },
  { start: "5:00 am", end: "6:00 am", midnight: true },
  { start: "6:00 am", end: "7:00 am", midnight: true },
  { start: "7:00 am", end: "8:00 am", midnight: true },
  { start: "8:00 am", end: "9:00 am" },
  { start: "9:00 am", end: "10:00 am" },
  { start: "10:00 am", end: "11:00 am" },
  { start: "11:00 am", end: "12:00 pm" },
  { start: "12:00 pm", end: "1:00 pm" },
  { start: "1:00 pm", end: "2:00 pm" },
  { start: "2:00 pm", end: "3:00 pm" },
  { start: "3:00 pm", end: "4:00 pm" },
  { start: "4:00 pm", end: "5:00 pm" },
  { start: "5:00 pm", end: "6:00 pm" },
  { start: "6:00 pm", end: "7:00 pm" },
  { start: "7:00 pm", end: "8:00 pm" },
  { start: "8:00 pm", end: "9:00 pm" },
  { start: "9:00 pm", end: "10:00 pm" },
  { start: "10:00 pm", end: "11:00 pm" },
  { start: "11:00 pm", end: "12:00 am (midnight)" },
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

export const loggedInAdmin = {}