import { useState } from "react";
import { useEffect } from "react";
import { get_tutor_rates, upload_form_three } from "../../axios/tutor";
import { IoMdCopy, IoMdRefresh } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import Tooltip from "../common/ToolTip";
import { copyToClipboard } from "../../helperFunctions/generalHelperFunctions";
import Actions from "../common/Actions";
import '../../styles/common.css'
import { toast } from "react-toastify";

const generateDiscountCode = () => {
  const length = 8;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

const Rates = () => {

  let [MultiStudentHourlyRate, setMultiStudentHourlyRate] = useState("");
  let [FreeDemoLesson, setFreeDemoLesson] = useState("");
  let [ActivateSubscriptionOption, setActivateSubscriptionOption] =
    useState("");
  let [SubscriptionPlan, setSubscriptionPlan] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [classTeaching, setClassTeaching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [discountCode, setDiscountCode] = useState(generateDiscountCode());
  const [loading, setLoading] = useState(false);

  const [dataFetched, setDataFetched] = useState(false)
  const [changesMade, setChangesMade] = useState(false);
  const [selectedCancellationPolicy, setSelectedCancPolicy] = useState('')
  const [ConsentRecordingLesson, setConsentRecordingLesson] = useState(false)
  const [IntroSessionDiscount, setIntroSessionDiscount] = useState(true)
  const [dbState, setDbState] = useState({});

  const fetchDataFromApi = () => {
    get_tutor_rates(window.localStorage.getItem("tutor_user_id"))
      .then((result) => {
        console.log(result[0]);
        if (Object.keys(result[0]).length) {
          setDbState(result[0]);
          setMultiStudentHourlyRate(result[0].MutiStudentHourlyRate);
          setSelectedCancPolicy(result[0].CancellationPolicy);
          setFreeDemoLesson(result[0].FreeDemoLesson);
          setConsentRecordingLesson(result[0].ConsentRecordingLesson);
          setActivateSubscriptionOption(result[0].ActivateSubscriptionOption);
          setSubscriptionPlan(result[0].SubscriptionPlan);
          setDiscountCode(result[0].DiscountCode)
          setClassTeaching(result[0].MultiStudent)
          setDiscountEnabled(result[0].CodeShareable)
          setIntroSessionDiscount(result[0].IntroSessionDiscount)

          let subscriptionPlan = document.querySelector("#subscription-plan");
          ActivateSubscriptionOption === "true"
            ? (subscriptionPlan.checked = true)
            : (subscriptionPlan.checked = false);

          let multiStudent = [...document.querySelectorAll("#multi-student")];

          multiStudent.map((item) => {
            if (
              MultiStudentHourlyRate.split(" ").splice(-1)[0] ===
              item.value.split(" ").splice(-1)[0]
            ) {
              item.checked = true;
            }
          });

          let studentSubscription = [
            ...document.querySelectorAll("#student-subscription"),
          ];

          studentSubscription.map((item) => {
            if (
              SubscriptionPlan.split(" ").splice(-1)[0] ===
              item.value.split(" ").splice(-1)[0]
            ) {
              item.checked = true;
            }
          });

          if (result[0].FreeDemoLesson === "yes") {
            document.querySelector("#freeDemoYes").checked = true;
            document.querySelector("#freeDemoNo").checked = false;
          } else {
            document.querySelector("#freeDemoYes").checked = false;
            document.querySelector("#freeDemoNo").checked = true;
          }

          if (result[0].ConsentRecordingLesson === "yes") {
            document.querySelector("#consentRecordingYes").checked = true;
            document.querySelector("#consentRecordingNo").checked = false;
          } else {
            document.querySelector("#consentRecordingYes").checked = false;
            document.querySelector("#consentRecordingNo").checked = true;
          }
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setDataFetched(true)
  }
  useEffect(() => {
    fetchDataFromApi()
  }, []);

  const currentState = {
    MutiStudentHourlyRate: MultiStudentHourlyRate,
    CancellationPolicy: selectedCancellationPolicy,
    FreeDemoLesson,
    ConsentRecordingLesson,
    ActivateSubscriptionOption,
    SubscriptionPlan,
    CodeShareable: discountEnabled,
    MultiStudent: classTeaching,
    DiscountCode: discountCode,
  };

  const compareStates = () => {
    for (const key in currentState) {
      console.log(key, currentState, dbState, currentState[key] !== dbState?.[key], 'comparison')
      if (currentState[key] !== dbState?.[key]) {
        setChangesMade(true);
        return;
      }
    }
    setChangesMade(false);
  };

  useEffect(() => {
    compareStates();
  }, [currentState, dbState]);

  let saver = async () => {
    let response = await upload_form_three(
      MultiStudentHourlyRate,
      selectedCancellationPolicy,
      FreeDemoLesson,
      ConsentRecordingLesson,
      ActivateSubscriptionOption,
      SubscriptionPlan,
      window.localStorage.getItem("tutor_user_id"),
      discountCode,
      discountEnabled,
      classTeaching,
      IntroSessionDiscount
    );

    return response;
  };


  useEffect(() => {
    let next = document.querySelector(".tutor-next");

    if (next && next.hasAttribute("id")) {
      next.removeAttribute("id");
    }
  }, []);

  let subscription_cols = [
    { Header: "Hours" },
    { Header: "Select" },
    { Header: "Discount" },
  ];
  let subscription_discount = [
    { discount: "0%", hours: '1-5' },
    { discount: "6.0%", hours: '6' },
    { discount: "12.0%", hours: '12' },
    { discount: "18.0%", hours: '18' },
    { discount: "24.0%", hours: '24' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let res = await saver()
    if (res.bool) {
      setChangesMade(false)
      fetchDataFromApi()
      toast.success(res.mssg)
    }
    else {
      toast.error("Failed to save record")
    }
    setLoading(false)
  }

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 7000);
  }, [copied]);

  return (
    <>
      <div className="tutor-popin"></div>
      <div className="save-overlay">
        <span className="save_loader"></span>
      </div>
      {changesMade && (
        <div className="green-bar w-100 bg-success text-white fs-5 text-decoration-underline d-flex justify-content-center m-0">
          <p className="m-2">You have made changes. Save them before moving to the next tab.</p>
        </div>
      )}
      <div className="tutor-tab-rates container">
        <div className="tutor-tab-rate-section">
          <form onSubmit={handleSubmit}>

            <div className="tutor-tab-rate-box" style={{ height: "80vh" }}>
              <h6>Subscription Plan</h6>

              <div
                style={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                }}
              >
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setActivateSubscriptionOption(e.target.checked ? true : false)
                  }
                  checked={ActivateSubscriptionOption === "true" || ActivateSubscriptionOption === true}
                  style={{ cursor: "pointer", height: "20px", width: "20px" }}
                  name="subscription-plan"
                  id="subscription-plan"
                />{" "}
                &nbsp;
                <label htmlFor="subscription-plan">
                  <h6>Activate subscription option</h6>
                </label>
              </div>

              <div className="highlight">
                You must check the box above to activate this option. Your student
                will select one option from the table below when he/she want to
                save by paying upfront on multi sessions. The Academy will forward
                you 50% from the discounted amount upfront. For example; student
                selects the 12 hours option, and you charge $45.00/hr, then $45.00
                X 12 = $540 -12% = $475.20 From this amount the academy will forward
                you 50% upfront, and the balance upon completion.
              </div>

              <div
                className="rate-table"
                style={{
                  pointerEvents: ActivateSubscriptionOption === "true"
                    || ActivateSubscriptionOption === true ? "auto" : "none",
                  opacity: "0.5",
                }}
              >
                <table>
                  <thead>
                    <tr>
                      {subscription_cols.map((item) => (
                        <th key={item.Header}>{item.Header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscription_discount.map((item, index) => (
                      <tr key={index}>
                        <td>{item.hours}</td>
                        <td>
                          <input
                            onInput={(e) => { setSubscriptionPlan(e.target.value) }}
                            type="radio"
                            value={item.hours}
                            checked={item.hours === "1-5"}
                            name="student-subscription"
                            id="student-subscription"
                            style={{
                              height: '20px',
                              width: '20px',
                            }}
                          />

                        </td>

                        <td>{item.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="">
                <div className="dropdown">
                  <label>Tutor Cancellation Policy</label>
                  <button
                    className="btn btn-secondary dropdown-toggle mr-3"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedCancellationPolicy.length ? `${selectedCancellationPolicy}hr   ` : " Select"}
                  </button>
                  {isOpen && (
                    <div className="dropdown-menu show">
                      <div className="dropdown-item" onClick={() => {
                        setSelectedCancPolicy('4')
                        setIsOpen(false)
                      }}>
                        4hr.

                      </div>
                      <div className="dropdown-item" onClick={() => {
                        setSelectedCancPolicy('8')
                        setIsOpen(false)
                      }}>
                        8hr.

                      </div>
                      <div className="dropdown-item" onClick={() => {
                        setSelectedCancPolicy('12')
                        setIsOpen(false)
                      }}>
                        12hr.
                      </div>

                      <div className="dropdown-item" onClick={() => {
                        setSelectedCancPolicy('24')
                        setIsOpen(false)
                      }}>
                        24hr
                      </div>
                      <div className="dropdown-item" onClick={() => {
                        setSelectedCancPolicy('48')
                        setIsOpen(false)
                      }}>
                        48 hr.
                      </div>
                    </div>
                  )}
                  <Tooltip text="How many hours before the lesson, you allow the student to cancel without penalty?" width="200px">
                    <FaInfoCircle size={20} color="#0096ff" />
                  </Tooltip>
                </div>
                <div className="form-check form-switch d-flex gap-3">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    role="switch"
                    onChange={() => setIntroSessionDiscount(!IntroSessionDiscount)}
                    checked={IntroSessionDiscount}
                  />
                  <label className="form-check-label mr-3" for="flexSwitchCheckChecked">
                    50% Intro Session
                  </label>
                  <Tooltip text="The academy mandate an |intro| sessions a for new student as a prerequisite to book further sessions with a new tutor. Your 50% discount motivate student to select you. " width="200px">
                    <FaInfoCircle size={20} color="#0096ff" />
                  </Tooltip>
                </div>
                <div className="form-check form-switch d-flex gap-3">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    role="switch"
                    onChange={() => setConsentRecordingLesson(!ConsentRecordingLesson)}
                    checked={ConsentRecordingLesson}
                  />
                  <label className="form-check-label" for="flexSwitchCheckChecked">
                    Consent Recording Session
                  </label>
                  <Tooltip text=" By default you must consent for recording Session with the student.">
                    <FaInfoCircle size={20} color="#0096ff" className=" mr-3" />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="p-4 w-50 float-end">
              <h6>Tutor's Own Students</h6>
              <div className="highlight">
                To tutor your own current students on plateform, forward the Code below to your students to be used with thier registration.
                That will reduce our service fee for these students by 10%. You need to generate new code for each of your students.

              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2">
                <input
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={() => setDiscountEnabled(!discountEnabled)}
                  checked={discountEnabled}
                />
                <label className="form-check-label" for="flexSwitchCheckChecked">
                  My Student's 10% markup
                </label>

                <Tooltip text="Provide the code below to be used at student's setup tab. It will reduce the platform service charge by 10%. You must generate new code for each of your students" width="200px">
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>
              {
                discountEnabled &&
                <div>
                  <h6 className="mt-4 d-inline">Your Student's new code</h6>
                  <Tooltip text="Generate New Code">
                    <IoMdRefresh
                      size={20}
                      className="d-inline"
                      onClick={() => setDiscountCode(generateDiscountCode())}
                    />
                  </Tooltip>
                  <div className="input-group w-50">
                    <input
                      type="text"
                      className="form-control m-0 h-100 p-2"
                      value={discountCode}
                      readOnly
                    />

                    <label
                      className="m-0 input-group-text"
                      type="button"
                      id="inputGroupFileAddon04"
                    >
                      <IoMdCopy
                        size={20}
                        color="#0096ff"
                        onClick={() => {
                          copyToClipboard(discountCode);
                          setCopied(true);
                        }}
                      />
                    </label>
                  </div>
                  {copied && (
                    <p className="text-success d-block">Code copied to clipboard!</p>
                  )}
                </div>}
              <div className="p-2 mt-4 highlight">

                The American public schools are suffering from accute shortage of teachers. if you hold teacher's certificate, and willing to teach full class of students, you are able to post your ad on the portal message board. and charge higher rate for your skills. Similarly, a school in a need for a substitute teacher, can find your account which is flagged accordingly.
              </div>
              <div className="form-check form-switch d-flex align-items-center gap-2 mt-4">
                <input
                  className="form-check-input "
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={() => setClassTeaching(!classTeaching)}
                  checked={classTeaching}
                />
                <label className="form-check-label" for="flexSwitchCheckChecked">
                  My hourly Charge for teaching a public or private school class (up to 30 students).
                </label>



                <Tooltip
                  text="Fill in your hourly amount for teaching a public 0r private school class (up to 30 students)."
                  direction="left"
                >
                  <FaInfoCircle size={20} color="#0096ff" />
                </Tooltip>
              </div>
              {
                classTeaching &&
                <>
                  <div className="input-group  w-50">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      required
                      className="form-control m-0 py-4"
                      aria-label="Amount (to the nearest dollar)"
                      value={MultiStudentHourlyRate}
                      onChange={(e) => {
                        if (e.target.value < 1000)
                          setMultiStudentHourlyRate(e.target.value)
                      }}
                    />
                    <span className="input-group-text">.00</span>
                  </div>
                  <span className="small text-secondary">Amount should be less than $999 </span>
                </>
              }
            </div>
            <Actions
              unSavedChanges={changesMade}
              loading={loading} />
          </form>
        </div>
      </div>
    </>
  );
};

export default Rates;
