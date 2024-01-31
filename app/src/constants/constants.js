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
export const slotPillDateFormat = 'MMM D, hh a';
export const monthFormatWithYYYY = 'MMM D, YYYY'

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

export const FACULTIES = [
  {
    "Id": 1,
    "Faculty": "Math"
  },
  {
    "Id": 2,
    "Faculty": "Computer"
  },
  {
    "Id": 3,
    "Faculty": "English"
  },
  {
    "Id": 4,
    "Faculty": "Languges"
  },
  {
    "Id": 5,
    "Faculty": "Elementary Education"
  },
  {
    "Id": 6,
    "Faculty": "Science"
  },
  {
    "Id": 7,
    "Faculty": "Business"
  },
  {
    "Id": 8,
    "Faculty": "Social Study"
  },
  {
    "Id": 9,
    "Faculty": "Programing"
  },
  {
    "Id": 10,
    "Faculty": "Test Preparation"
  },
  {
    "Id": 13,
    "Faculty": "Health"
  },
  {
    "Id": 14,
    "Faculty": "Life Skills"
  },
  {
    "Id": 15,
    "Faculty": "Art"
  },
  {
    "Id": 16,
    "Faculty": "Engineering"
  },
  {
    "Id": 17,
    "Faculty": "Aviation"
  },
  {
    "Id": 18,
    "Faculty": "Economics"
  },
  {
    "Id": 20,
    "Faculty": "History"
  },
  {
    "Id": 21,
    "Faculty": "Statistics"
  },
  {
    "Id": 22,
    "Faculty": "Chemistry"
  },
  {
    "Id": 23,
    "Faculty": "Biology"
  },
  {
    "Id": 24,
    "Faculty": "Physics"
  },
  {
    "Id": 25,
    "Faculty": "Music"
  },
  {
    "Id": 26,
    "Faculty": "Geography"
  },
  {
    "Id": 27,
    "Faculty": "Psychology"
  },
  {
    "Id": 28,
    "Faculty": "Photography"
  },
  {
    "Id": 29,
    "Faculty": "Graphic design"
  },
  {
    "Id": 30,
    "Faculty": "Geometry"
  },
  {
    "Id": 31,
    "Faculty": "Litrature"
  },
  {
    "Id": 32,
    "Faculty": "Business & Management"
  },
  {
    "Id": 33,
    "Faculty": "Artificial intelligence"
  },
  {
    "Id": 34,
    "Faculty": "Home Schooling"
  }
]

export const GMT = [
  {
    "id": 1,
    "GMT": "00        ",
    "Time Zone": "Greenwitch"
  },
  {
    "id": 2,
    "GMT": "+01       ",
    "Time Zone": "West Europe"
  },
  {
    "id": 3,
    "GMT": "+02       ",
    "Time Zone": "East Europe"
  },
  {
    "id": 4,
    "GMT": "+03       ",
    "Time Zone": "East Africa"
  },
  {
    "id": 5,
    "GMT": "+04       ",
    "Time Zone": "Golf Std"
  },
  {
    "id": 6,
    "GMT": "+05       ",
    "Time Zone": "Pakistan"
  },
  {
    "id": 7,
    "GMT": "+06       ",
    "Time Zone": "Bengladesh"
  },
  {
    "id": 8,
    "GMT": "+07       ",
    "Time Zone": "West Indonesia"
  },
  {
    "id": 9,
    "GMT": "+08       ",
    "Time Zone": "Singapore"
  },
  {
    "id": 10,
    "GMT": "+09       ",
    "Time Zone": "Korea, Japan"
  },
  {
    "id": 11,
    "GMT": "+10       ",
    "Time Zone": "Eastren AustraliaL"
  },
  {
    "id": 13,
    "GMT": "+11       ",
    "Time Zone": "Solomon Islands"
  },
  {
    "id": 14,
    "GMT": "+12       ",
    "Time Zone": "New Zeland Std."
  },
  {
    "id": 15,
    "GMT": "-01       ",
    "Time Zone": "Azures Std"
  },
  {
    "id": 16,
    "GMT": "-02       ",
    "Time Zone": "S. Georgia"
  },
  {
    "id": 17,
    "GMT": "-03       ",
    "Time Zone": "Argentina"
  },
  {
    "id": 18,
    "GMT": "-04       ",
    "Time Zone": "Atlantic Std."
  },
  {
    "id": 19,
    "GMT": "-05       ",
    "Time Zone": "Eastren Std."
  },
  {
    "id": 20,
    "GMT": "-06       ",
    "Time Zone": "Central Std."
  },
  {
    "id": 21,
    "GMT": "-07       ",
    "Time Zone": "Mountain Std."
  },
  {
    "id": 22,
    "GMT": "-08       ",
    "Time Zone": "Pacific Std."
  },
  {
    "id": 23,
    "GMT": "-09       ",
    "Time Zone": "Alaska Std."
  },
  {
    "id": 25,
    "GMT": "-10       ",
    "Time Zone": "Hawaii Std."
  },
  {
    "id": 26,
    "GMT": "-11       ",
    "Time Zone": "Niue"
  },
  {
    "id": 27,
    "GMT": "-12       ",
    "Time Zone": "Baker Island"
  }
]

export const GRADES = [
  {
    "id": 1,
    "Grade": "Pre K"
  },
  {
    "id": 2,
    "Grade": "1St"
  },
  {
    "id": 3,
    "Grade": "2nd"
  },
  {
    "id": 4,
    "Grade": "3rd"
  },
  {
    "id": 5,
    "Grade": "4th"
  },
  {
    "id": 6,
    "Grade": "5th"
  },
  {
    "id": 7,
    "Grade": "6th"
  },
  {
    "id": 8,
    "Grade": "7th"
  },
  {
    "id": 9,
    "Grade": "8th"
  },
  {
    "id": 10,
    "Grade": "9th"
  },
  {
    "id": 11,
    "Grade": "10th"
  },
  {
    "id": 12,
    "Grade": "11th"
  },
  {
    "id": 13,
    "Grade": "12th"
  },
  {
    "id": 14,
    "Grade": "Freshman"
  },
  {
    "id": 15,
    "Grade": "Sophmore"
  },
  {
    "id": 16,
    "Grade": "Junior"
  },
  {
    "id": 17,
    "Grade": "Senior"
  }
]

export const Countries = [
  {
    "Country": "USA"
  },
  {
    "Country": "Canada"
  },
  {
    "Country": "Greece"
  },
  {
    "Country": "Jordan"
  },
  {
    "Country": "Portugal"
  },
  {
    "Country": "Azrabijan"
  },
  {
    "Country": "Sweeden"
  },
  {
    "Country": "Hunduras"
  },
  {
    "Country": "UAE"
  },
  {
    "Country": "Hungary"
  },
  {
    "Country": "Tajikistan"
  },
  {
    "Country": "Belarus"
  },
  {
    "Country": "Austria"
  },
  {
    "Country": "papua"
  },
  {
    "Country": "Serbia"
  },
  {
    "Country": "Israel"
  },
  {
    "Country": "Switzerland"
  },
  {
    "Country": "Togo"
  },
  {
    "Country": "Sierra leone"
  },
  {
    "Country": "Hong Kong"
  },
  {
    "Country": "Laos"
  },
  {
    "Country": "Paraguay"
  },
  {
    "Country": "Bulgaria"
  },
  {
    "Country": "Libya"
  },
  {
    "Country": "Lebanon"
  },
  {
    "Country": "Nicaragua"
  },
  {
    "Country": "Kyrgyzstan"
  },
  {
    "Country": "El Salvador"
  },
  {
    "Country": "Turkemenistan"
  },
  {
    "Country": "Singapore"
  },
  {
    "Country": "Denmark"
  },
  {
    "Country": "Finland"
  },
  {
    "Country": "Congo"
  },
  {
    "Country": "Slovakia"
  },
  {
    "Country": "Norway"
  },
  {
    "Country": "Oman"
  },
  {
    "Country": "Palestine"
  },
  {
    "Country": "Costa Rica"
  },
  {
    "Country": "Liberia"
  },
  {
    "Country": "Ireland"
  },
  {
    "Country": "Central Africa Rep."
  },
  {
    "Country": "New Zeland"
  },
  {
    "Country": "Mauritania"
  },
  {
    "Country": "Panama"
  },
  {
    "Country": "Kuwait"
  },
  {
    "Country": "Croetia"
  },
  {
    "Country": "Moldova"
  },
  {
    "Country": "Georgia"
  },
  {
    "Country": "Eritrea"
  },
  {
    "Country": "Urugway"
  },
  {
    "Country": "Bosnia"
  },
  {
    "Country": "Mongolia"
  },
  {
    "Country": "Armenia"
  },
  {
    "Country": "Jamaica"
  },
  {
    "Country": "Qatar"
  },
  {
    "Country": "Albania"
  },
  {
    "Country": "Porto Rico"
  },
  {
    "Country": "lithuania"
  },
  {
    "Country": "Namibia"
  },
  {
    "Country": "Gambia"
  },
  {
    "Country": "Botswana"
  },
  {
    "Country": "Gabon"
  },
  {
    "Country": "lesoto"
  },
  {
    "Country": "macadonia"
  },
  {
    "Country": "Slovenia"
  },
  {
    "Country": "Guinea-bissau"
  },
  {
    "Country": "Latvia"
  },
  {
    "Country": "Bahrain"
  },
  {
    "Country": "Guinea Equitorial"
  },
  {
    "Country": "Trinidad"
  },
  {
    "Country": "Estonia"
  },
  {
    "Country": "Timor"
  },
  {
    "Country": "Mauritius"
  },
  {
    "Country": "Cyprus"
  },
  {
    "Country": "India"
  },
  {
    "Country": "China"
  },
  {
    "Country": "Indonesia"
  },
  {
    "Country": "Pakistan"
  },
  {
    "Country": "Brazil"
  },
  {
    "Country": "Nigeria"
  },
  {
    "Country": "Bangladesh"
  },
  {
    "Country": "Russia"
  },
  {
    "Country": "Mexico"
  },
  {
    "Country": "Japan"
  },
  {
    "Country": "Rthiopia"
  },
  {
    "Country": "Philippines"
  },
  {
    "Country": "Egypt"
  },
  {
    "Country": "Vietnam"
  },
  {
    "Country": "Congo DR"
  },
  {
    "Country": "Turkey"
  },
  {
    "Country": "Iran"
  },
  {
    "Country": "Germany"
  },
  {
    "Country": "Thailand"
  },
  {
    "Country": "UnitedKingdom"
  },
  {
    "Country": "France"
  },
  {
    "Country": "Italy"
  },
  {
    "Country": "Tanzania"
  },
  {
    "Country": "South Africa"
  },
  {
    "Country": "Myanmar"
  },
  {
    "Country": "Kenya"
  },
  {
    "Country": "S. Korea"
  },
  {
    "Country": "Spain"
  },
  {
    "Country": "Uganda"
  },
  {
    "Country": "Argentina"
  },
  {
    "Country": "Algeria"
  },
  {
    "Country": "Sudan"
  },
  {
    "Country": "Ukraine"
  },
  {
    "Country": "Iraq"
  },
  {
    "Country": "Afganistan"
  },
  {
    "Country": "Poland"
  },
  {
    "Country": "Morocco"
  },
  {
    "Country": "Saudi Arabia"
  },
  {
    "Country": "Uzbekistan"
  },
  {
    "Country": "peru"
  },
  {
    "Country": "Angola"
  },
  {
    "Country": "Malasyia"
  },
  {
    "Country": "Mozambique"
  },
  {
    "Country": "Ghana"
  },
  {
    "Country": "Yemen"
  },
  {
    "Country": "Nepal"
  },
  {
    "Country": "Venezuela"
  },
  {
    "Country": "Madagascar"
  },
  {
    "Country": "Cameron"
  },
  {
    "Country": "Cote D'Ivoire"
  },
  {
    "Country": "Australia"
  },
  {
    "Country": "Niger"
  },
  {
    "Country": "Sri Lanka"
  },
  {
    "Country": "Burkina Faso"
  },
  {
    "Country": "Mali"
  },
  {
    "Country": "Romania"
  },
  {
    "Country": "Malawi"
  },
  {
    "Country": "Chile"
  },
  {
    "Country": "Kazkhstan"
  },
  {
    "Country": "Zambia"
  },
  {
    "Country": "Guatemala"
  },
  {
    "Country": "Ecuador"
  },
  {
    "Country": "Syria"
  },
  {
    "Country": "Netherlands"
  },
  {
    "Country": "Senegal"
  },
  {
    "Country": "Columbia"
  },
  {
    "Country": "Chad"
  },
  {
    "Country": "Somalia"
  },
  {
    "Country": "Zimbabwe"
  },
  {
    "Country": "Guinea"
  },
  {
    "Country": "Rwanda"
  },
  {
    "Country": "Benin"
  },
  {
    "Country": "Burundi"
  },
  {
    "Country": "Tunisia"
  },
  {
    "Country": "Bolivia"
  },
  {
    "Country": "Belgium"
  },
  {
    "Country": "haiti"
  },
  {
    "Country": "Cuba"
  },
  {
    "Country": "Sudan South"
  },
  {
    "Country": "Dominican Republic"
  },
  {
    "Country": "Czech Republic"
  }
].sort((a, b) => a.Country.localeCompare(b.Country));

export const STATES = [
  {
    "Id": 1,
    "State": "AK"
  },
  {
    "Id": 2,
    "State": "AZ"
  },
  {
    "Id": 3,
    "State": "AR"
  },
  {
    "Id": 4,
    "State": "CA"
  },
  {
    "Id": 5,
    "State": "CZ"
  },
  {
    "Id": 6,
    "State": "CO"
  },
  {
    "Id": 7,
    "State": "CT"
  },
  {
    "Id": 8,
    "State": "DE"
  },
  {
    "Id": 9,
    "State": "DC"
  },
  {
    "Id": 10,
    "State": "FL"
  },
  {
    "Id": 11,
    "State": "GA"
  },
  {
    "Id": 12,
    "State": "GU"
  },
  {
    "Id": 13,
    "State": "HI"
  },
  {
    "Id": 14,
    "State": "ID"
  },
  {
    "Id": 15,
    "State": "IL"
  },
  {
    "Id": 16,
    "State": "IN"
  },
  {
    "Id": 17,
    "State": "IA"
  },
  {
    "Id": 18,
    "State": "KS"
  },
  {
    "Id": 19,
    "State": "KY"
  },
  {
    "Id": 20,
    "State": "LA"
  },
  {
    "Id": 21,
    "State": "ME"
  },
  {
    "Id": 22,
    "State": "MD"
  },
  {
    "Id": 23,
    "State": "MA"
  },
  {
    "Id": 24,
    "State": "MY"
  },
  {
    "Id": 25,
    "State": "MN"
  },
  {
    "Id": 26,
    "State": "MS"
  },
  {
    "Id": 27,
    "State": "MO"
  },
  {
    "Id": 28,
    "State": "MT"
  },
  {
    "Id": 29,
    "State": "NE"
  },
  {
    "Id": 30,
    "State": "NV"
  },
  {
    "Id": 31,
    "State": "NH"
  },
  {
    "Id": 32,
    "State": "NJ"
  },
  {
    "Id": 33,
    "State": "NM"
  },
  {
    "Id": 34,
    "State": "NY"
  },
  {
    "Id": 35,
    "State": "NC"
  },
  {
    "Id": 36,
    "State": "ND"
  },
  {
    "Id": 37,
    "State": "OH"
  },
  {
    "Id": 38,
    "State": "OK"
  },
  {
    "Id": 39,
    "State": "OR"
  },
  {
    "Id": 40,
    "State": "PA"
  },
  {
    "Id": 41,
    "State": "PR"
  },
  {
    "Id": 42,
    "State": "RI"
  },
  {
    "Id": 43,
    "State": "SC"
  },
  {
    "Id": 44,
    "State": "SD"
  },
  {
    "Id": 45,
    "State": "TN"
  },
  {
    "Id": 46,
    "State": "TX"
  },
  {
    "Id": 47,
    "State": "UT"
  },
  {
    "Id": 48,
    "State": "VT"
  },
  {
    "Id": 49,
    "State": "VI"
  },
  {
    "Id": 50,
    "State": "VA"
  },
  {
    "Id": 51,
    "State": "WV"
  },
  {
    "Id": 52,
    "State": "WI"
  },
  {
    "Id": 53,
    "State": "WY"
  },
  {
    "Id": 55,
    "State": "NL"
  },
  {
    "Id": 56,
    "State": "PE"
  },
  {
    "Id": 57,
    "State": "NS"
  },
  {
    "Id": 58,
    "State": "NB"
  },
  {
    "Id": 59,
    "State": "QC"
  },
  {
    "Id": 60,
    "State": "ON"
  },
  {
    "Id": 61,
    "State": "MB"
  },
  {
    "Id": 62,
    "State": "SK"
  },
  {
    "Id": 63,
    "State": "AB"
  },
  {
    "Id": 64,
    "State": "BC"
  },
  {
    "Id": 65,
    "State": "YT"
  },
  {
    "Id": 66,
    "State": "NT"
  },
  {
    "Id": 67,
    "State": "NU"
  }
]

export const RESPONSE = [
  {
    "id": 1,
    "Response": "4 Hours"
  },
  {
    "id": 2,
    "Response": "8 Hours"
  },
  {
    "id": 3,
    "Response": "12 Hours"
  },
  {
    "id": 4,
    "Response": "24 Hours"
  },
  {
    "id": 5,
    "Response": "48 Hours"
  },
  {
    "id": 6,
    "Response": "72 Hours"
  }
]

export const US_STATES = STATES.map(item => item.State)
export const AUST_STATES =
  [
    "ACT",
    "NSW",
    "NT",
    "QLD",
    "SA",
    "TAS",
    'VIC'
  ];
export const UK_STATES = [
  "BDF",
  "BKM",
  "BRK",
  "CAM",
  "CHS",
  "CON",
  "CUL",
  "DBY",
  "DEV",
  "DOR",
  "DUR",
  "ERY",
  "ESS",
  "GLS",
  "HAM",
  "HEF",
  "HRT",
  "HUN",
  "KEN",
  "LAN",
  "LEI",
  "LIN",
  "MDX",
  "NBL",
  "NFK",
  "NRY",
  "NTH",
  "NTT",
  "OXF",
  "RUT",
  "SAL",
  "SFK",
  "SOM",
  "SRY",
  "SSX",
  "STS",
  "WAR",
  "WES",
  "WIL",
  "WOR",
  "WRY",
  "YKS",
]

export const CAN_STATES = [
  "ALB",
  "BC",
  "LAB",
  "MAN",
  "NB",
  "NFD",
  "NFD",
  "NS",
  "NU",
  "NWT",
  "ONT",
  "PEI",
  "QUE",
  "SAS",
  "YT",

]

export const COMMISSION_DATA = [
  {
    lower: 0,
    higher: 60,
    time: "00-60 Hr",
    percent: 20,
  },
  {
    lower: 61,
    higher: 120,
    time: "61-120 Hr",

    percent: 18,
  },
  {
    lower: 121,
    higher: 180,
    time: "121-180 Hr",

    percent: 16,
  },
  {
    lower: 181,
    higher: 240,
    time: "181-240 Hr",

    percent: 14,
  },
  {
    lower: 241,
    higher: 300,
    time: "241-300 Hr",
    percent: 12,
  },
  {
    lower: 301,
    time: '301 > Hr',
    percent: 10,
  },
  {
    time: 'Demo Lesson',
    percent: '50%',
  }
]

const setDefaultHours = `
update  TutorSetup set disableHoursRange = '[["1:00 am","2:00 am"],["2:00 am","3:00 am"],["3:00 am","4:00 am"],["4:00 am","5:00 am"],["5:00 am","6:00 am"],["7:00 am","8:00 am"],["9:00 pm","10:00 pm"],["10:00 pm","11:00 pm"],["11:00 pm","12:00 am (midnight)"],["6:00 am","7:00 am"],["12:00 am","1:00 am","midnight"]]'
ALTER TABLE TutorSetup
add disableHoursRange VARCHAR(MAX) DEFAULT '[["1:00 am","2:00 am"],["2:00 am","3:00 am"],["3:00 am","4:00 am"],["4:00 am","5:00 am"],["5:00 am","6:00 am"],["7:00 am","8:00 am"],["9:00 pm","10:00 pm"],["10:00 pm","11:00 pm"],["11:00 pm","12:00 am (midnight)"],["6:00 am","7:00 am"],["12:00 am","1:00 am","midnight"]]'
`
export const loggedInAdmin = {}

export const languages = [
  'Afrikaans',
  'Albanian',
  'Arabic',
  'Armenian',
  'Basque',
  'Bengali',
  'Bulgarian',
  'Catalan',
  'Cambodian',
  'Chinese (Mandarin)',
  'Croatian',
  'Czech',
  'Danish',
  'Dutch',
  'English',
  'Estonian',
  'Fiji',
  'Finnish',
  'French',
  'Georgian',
  'German',
  'Greek',
  'Gujarati',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Icelandic',
  'Indonesian',
  'Irish',
  'Italian',
  'Japanese',
  'Javanese',
  'Korean',
  'Latin',
  'Latvian',
  'Lithuanian',
  'Macedonian',
  'Malay',
  'Malayalam',
  'Maltese',
  'Maori',
  'Marathi',
  'Mongolian',
  'Nepali',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Quechua',
  'Romanian',
  'Russian',
  'Samoan',
  'Serbian',
  'Slovak',
  'Slovenian',
  'Spanish',
  'Swahili',
  'Swedish',
  'Tamil',
  'Tatar',
  'Telugu',
  'Thai',
  'Tibetan',
  'Tonga',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Uzbek',
  'Vietnamese',
  'Welsh',
  'Xhosa',
];

export const STEPS = ['',
  'setup',
  'education',
  'rates',
  'accounting',
]

export const PROFILE_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under-review",
  ACTIVE: 'active',
  SUSPENDED: "suspended",
  CLOSED: "closed",
  DISAPPROVED: 'disapproved'
}

export const statesColours = {
  'pending': "#e2e222",
  'active': "#1fe010",
  "under-review": "#d5a414",
  "suspended": "#9210e0",
  "disapproved": "#dd1919",
  "closed": "#000",
}

export const DEFAULT_URL_AFTER_LOGIN = {
  admin: "/admin/tutor-data",
  tutor: "/tutor/intro",
  student: "/student/intro"
}
