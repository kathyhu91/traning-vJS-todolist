// 0
import { registerUrl } from "./api.js";
import { validateRule, errMsg } from "./accountRule.js";

// 1 DOM node
const registerBtn = document.querySelector("#registerBtn");

// 3 data
const registerData = {
  user: {
    email: "",
    nicknamel: "",
    password: "",
  },
};

// 4
// 4-1 觸發註冊事件
function register(e) {
  e.preventDefault();
  const target = e.target;
  if (target.getAttribute("id") !== "registerBtn") return;
  let validateRegisterData = validateData();
  if (validateRegisterData) {
    return sendRegisterData(registerData);
  }
}

// 4-2 表單驗證
function validateData() {
  const inputAll = document.querySelectorAll(".form__input");
  let rawPassword = "";
  // 驗證
  inputAll.forEach((item) => {
    const itemType = item.dataset.type;
    const itemValue = item.value.trim();
    const msg = document.querySelector(`[data-msg=${itemType}]`);
    // 空值
    if (itemValue.length === 0) {
      msg.textContent = errMsg.empty;
      return false;
    } else {
      msg.textContent = "";
      // 非空值＋驗證規則
      if (itemType === "email") {
        const result = validateRule.email.test(itemValue);
        result
          ? (registerData.user.email = itemValue)
          : (msg.textContent = errMsg.email);
      }

      if (itemType === "nickname") {
        const result = validateRule.nickname.test(itemValue);
        result
          ? (registerData.user.nickname = itemValue)
          : (msg.textContent = errMsg.nickname);
      }

      if (itemType === "password") {
        const result = validateRule.password.test(itemValue);
        result
          ? (rawPassword = itemValue)
          : (msg.textContent = errMsg.password);
      }
      if (itemType === "password-check") {
        // 密碼再次確認
        if (rawPassword.length === 0) {
          msg.textContent = errMsg.passwordCheckState;
        } else if (itemValue !== rawPassword) {
          msg.textContent = errMsg.passwordCheck;
        } else if (itemValue === rawPassword) {
          registerData.user.password = itemValue;
        }
      }
    }
  });
  // 確認是否都有值
  if (
    registerData?.user?.email?.length > 0 &&
    registerData?.user?.nickname?.length > 0 &&
    registerData?.user?.password?.length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

// 4-3 註冊請求
function sendRegisterData(data) {
  axios
    .post(registerUrl, data)
    .then((res) => {
      alert(res.data.message);
      // 頁面跳轉
      setTimeout("window.location.href='../pages/login.html'", 500);
    })
    .catch((err) => alert(err.response.data.message));
}

// 2 event listener
registerBtn.addEventListener("click", register);
