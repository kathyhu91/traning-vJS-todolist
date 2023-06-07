// 5-[C]取得資料渲染畫面
// V 獲取data
function getTodosData(authToken) {
    axios
      .get(todosUrl, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((res) => {
        todosData = res?.data?.todos;
        currentTab = "all";
        todosNum = todosData?.length;
        todosNum === 0 ? renderEmptyMsg() : renderTodoList(todosData);
      })
      .catch((err) => {
        return alert(err);
      });
  }
  
  // V 渲染空資料畫面
  function renderEmptyMsg() {
    let emptyBoard = `<div class="todo__none" >
      <p class="todo__none__text">目前尚無待辦事項</p>
      <img src="../assets/empty.png" alt="" class="todo__none__img"></div>`;
    todoBoard.innerHTML = emptyBoard;
  }
  
  // V 
  

  // function init() {
//   if (token.length <= 0) {
//     alert("未確實登入");
//     return logout();
//   } else {
//     checkLoginState(token);
//   }
// }
// // V 確認登入狀態
// function checkLoginState(authToken) {
//   axios
//     .get(checkUrl, {
//       headers: {
//         Authorization: authToken,
//       },
//     })
//     .then((res) => {
//       nickname = localStorage.getItem("nickname");
//       userName.textContent = nickname;
//       getTodosData(token);
//     })
//     .catch((err) => {
//       alert(err);
//       logout();
//     });
// }

// // 5-[B]登出
// // V 移除token
// function logout() {
//   localStorage.removeItem("Authorization");
//   localStorage.removeItem("nickname");
//   setTimeout("location.href='../pages/login.html'", 500);
// }

// //V 登出
// function sendLogout(e) {
//   e.preventDefault();
//   if (e.target.getAttribute("id") === "logoutBtn") {
//     axios
//       .delete(logoutUrl, {
//         headers: {
//           Authorization: token,
//         },
//       })
//       .then((res) => {
//         alert(res.data.message);
//         return logout();
//       })
//       .catch((err) => {
//         alert("登出失敗");
//         return console.log(err.response);
//       });
//   }
// }

// 5-[C]取得資料渲染畫面
// V 獲取data
function getTodosData(authToken) {
    axios
      .get(todosUrl, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((res) => {
        todosData = res?.data?.todos;
        currentTab = "all";
        todosNum = todosData?.length;
        todosNum === 0 ? render.renderEmptyMsg() : render.renderTodoList(todosData);
      })
      .catch((err) => {
        return alert(err);
      });
  }
  
  // V 渲染空資料畫面
  function renderEmptyMsg() {
    let emptyBoard = `<div class="todo__none" >
      <p class="todo__none__text">目前尚無待辦事項</p>
      <img src="../assets/empty.png" alt="" class="todo__none__img"></div>`;
    todoBoard.innerHTML = emptyBoard;
  }
  
  // V 渲染todosList
  function renderTodoList(data) {
    let tabContent = renderTabBar(currentTab);
    let cardFooter = renderTodosNum(todosNum);
    console.log();
    let rawHtml = "";
    if (data.length === 0) {
      rawHtml = `<p class="card__text">無已完成項目</p>`;
    } else {
      data.forEach((item) => {
        let itemState = item.completed_at !== null ? "checked" : "";
        rawHtml += `
              <li class="card__item" data-id="${item.id}">
                <label class="card__label" for="${item.id}">
                    <input type="checkbox" class="card__checkbox ${itemState}" id="${item.id}"/>
                    <span class="card__text">${item.content}</span>
                </label>
                <a href="#" class="card__item__btn--del" data-type="del">
                </a>
            </li>`;
      });
    }
    todoBoard.innerHTML = `<div class="card todo__card">
    <ul class="tab__list" id="tabBar">${tabContent}</ul>
    <ul class="card__list"> ${rawHtml}</ul>
    ${cardFooter}</div>`;
  }
  
  // V 渲染tab列表
  function renderTabBar(tabState) {
    let rawHtml = "";
    tabData.forEach((item) => {
      let itemState = item.tab === tabState ? "active" : "";
      rawHtml += ` <li class="tab__item ${itemState}" data-type ="tab" data-tab="${item.tab}">${item.title}</li>`;
    });
    return rawHtml;
  }
  
  // V 渲染筆數
  function renderTodosNum(todosNum) {
    let rawHtml = `<div class="card__footer">
        <p class="card__footer__item">${todosNum}個待完成項目</p>
        <p class="card__footer__item card__footer__item--del" id="del-all">清除已完成項目</p>
      </div>`;
    return rawHtml;
  }
// 5-[D]事件處理
// 事件分流
function triggerBoard(e) {
    e.preventDefault();
    const target = e.target;
    if (target.dataset.type === "tab") {
      // 切換tab
      currentTab = target.dataset.tab;
      changeTab(currentTab);
      //   資料重新渲染
      let fillterTodos = "";
      if (target.dataset.tab === "all") {
        return render.renderTodoList(todosData);
      } else if (target.dataset.tab === "tbd") {
        filterTodos = todosData.filter((item) => item.completed_at === null);
        return render.renderTodoList(filterTodos);
      } else if (target.dataset.tab === "done") {
        filterTodos = todosData.filter((item) => item.completed_at !== null);
        return render.renderTodoList(filterTodos);
      }
    }
    //   } else if ("編輯") {
    //     // 觸發編輯
    //   } else if ("刪除") {
    //     // 觸發刪除
    //   } else if ("刪除全部") {
    //     // 觸發刪除全部api
    //   }
  }
  
  // 新增單筆
  function addTodoData(e) {
    e.preventDefault();
    const target = e.target;
    if (target.getAttribute("id") !== "addTodoBtn") return;
    const todoValue = document.querySelector("#todo_input").value;
    if (todoValue.length === 0) {
      return alert("請先輸入待辦事項");
    }
    currentTodo = todoValue;
    addTodoApi(token, currentTodo);
  }
  function addTodoApi(authToken, content) {
    console.log("addTodoApi", authToken, content);
    console.log("todosUr", todosUrl);
    axios
      .post(
        todosUrl,
        {
          todo: {
            content,
          },
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((res) => {
        if (res.status == 201) {
          alert("新增成功");
          getTodosData();
        }
      })
      .catch((err) => alert(err?.response?.data?.message));
  }
  
  // 編輯單筆
  function editTodoApi(id, authToken, data) {
    let editUrl = todoUrl(id);
    axios
      .put(
        editUrl,
        {
          headers: {
            Authorization: authToken,
          },
        },
        {
          todo: {
            content: data,
          },
        }
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  
  // 刪除單筆
  function delTodoApi(authToken, id) {
    let delUrl = todoUrl(id);
    axios
      .delete(todoUrl, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  
  // 刪除全部
  function delAllTodos(e) {
    console.log("刪除全部");
  }
  
  // V 切換tab
  function changeTab(tabState) {
    const tabBar = document.querySelector("#tabBar");
    let tabContent = render.renderTabBar(tabState);
    tabBar.innerHTML = tabContent;
  }  


  const token = localStorage.getItem("Authorization");
let tabData = [
  { tab: "all", title: "全部" },
  { tab: "tbd", title: "未完成" },
  { tab: "done", title: "已完成" },
];
let nickname = "";
let todosData = [];
let filterTodos = [];
let cardTitleHtml = "";
let currentTab = "";
let todosNum = "";
let currentTodo = "";