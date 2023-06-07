// 0
import { loginUrl } from "./api.js";
import { validateRule, errMsg } from "./accountRule.js";

// 1 DOM node
const registerBtn = document.querySelector("#login-btn");

// 3 data
const loginData = {
  user: {
    email: "",
    password: "",
  },
};

// 4
// 4-1 觸發
function login(e) {
  console.log("login")
  e.preventDefault();
  const target = e.target;
  if (target.getAttribute("id") !== "login-btn") return;
  let validateLoginData = validateData();
  if (validateLoginData) {
    return sendLoginData(loginData);
  }
}

// 4-2 表單驗證
function validateData() {
  console.log("validateData")
  // dom
  const emailValue = document.querySelector("#login-email").value;
  const passwordValue = document.querySelector("#login-password").value;
  const emailErrMsg = document.querySelector("[data-msg='email']");
  const passwordErrMsg = document.querySelector("[data-msg='password']");
  
  
  // email
  if (emailValue?.length <= 0) {
    emailErrMsg.textContent = errMsg.empty;
  } else {
    
    const result = validateRule.email.test(emailValue);
    if (result) {
      emailErrMsg.textContent = "";
      loginData.user.email = emailValue
    } else {
      emailErrMsg.textContent = errMsg.email
    }
  }
  // password
  if (passwordValue?.length <= 0) {
    passwordErrMsg.textContent = errMsg.empty;
  } else {
    const result = validateRule.password.test(passwordValue);
    
    if(result) {
      passwordErrMsg.textContent = "";
      loginData.user.password = passwordValue
    } else {
      passwordErrMsg.textContent = errMsg.password
    }
  }
  // 確認是否都有值
  if (
    loginData?.user?.email?.length > 0 &&
    loginData?.user?.password?.length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

// 4-3 發送遠端請求
function sendLoginData(data) {
  axios
    .post(loginUrl, data)
    .then((res) => {
      const token = res.headers.authorization
      localStorage.setItem("Authorization", token);
      localStorage.setItem("nickname", res.data.nickname);
      alert(res.data.message);
      //   跳轉
      setTimeout("window.location.href='../pages/todoList.html'", 500);
    })
    .catch((err) => {
      alert(err?.response?.data?.message)
    });
}

// 2 event listener
registerBtn.addEventListener("click", login);
