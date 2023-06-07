export const validateRule = {
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  nickname: /^[A-Za-z0-9]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6}$/,
};

export const errMsg = {
  empty: "此欄位不得為空",
  email: "email格式不正確",
  nickname: "暱稱為英數任意混合，不可有特殊符號",
  password: "密碼為6碼，數字與英文大小寫至少各一，不可有特殊符號",
  passwordCheck: "密碼不相符，請重新輸入",
  passwordCheckState :"請先輸入正確的密碼"
};
