// 0
import {
  checkUrl,
  logoutUrl,
  todosUrl,
  todoUrl,
  toggleTodoUrl,
} from "./api.js";

// 1 dom
const logoutBtn = document.querySelector("#logoutBtn");
const userName = document.querySelector("#userName");
const todoBoard = document.querySelector("#todoBoard");
const addTodoBtn = document.querySelector("#addTodoBtn");

// 2 data
const token = localStorage.getItem("Authorization");
const typeData = {
  tab: [
    { tab: "all", title: "全部" },
    { tab: "tbd", title: "未完成" },
    { tab: "done", title: "已完成" },
  ],
};
const data = {
  nickname: "",
  todosData: [],
  tbdData: [],
  doneData: [],
  tbdNum: "",
  currentTab: "",
  currentTodo: "",
};

// 4 function
const api = {
  checkLogin(authToken) {
    axios
      .get(checkUrl, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((res) => {
        data.nickname = localStorage.getItem("nickname");
        userName.textContent = data.nickname;
        axios.defaults.headers.common["Authorization"] = token;
        api.getTodosData(token);
      })
      .catch((err) => {
        alert(err);
        account.removeToken();
      });
  },
  logout() {
    axios
      .delete(logoutUrl)
      .then((res) => {
        alert(res.data.message);
        return account.removeToken();
      })
      .catch((err) => {
        alert("登出失敗");
        return alert(err.response);
      });
  },
  getTodosData() {
    axios
      .get(todosUrl)
      .then((res) => {
        data.todosData = res?.data?.todos;
        data.currentTab = "all";
        if (data.todosData.length === 0) {
          return render.emptyMsg();
        } else {
          data.tbdData = data.todosData.filter(
            (item) => item.completed_at === null
          );
          data.doneData = data.todosData.filter(
            (item) => item.completed_at !== null
          );
          data.tbdNum = data.tbdData.length;
          return render.todoList(data.todosData, data.currentTab);
        }
      })
      .catch((err) => {
        return alert(err);
      });
  },
  addTodo(content) {
    axios
      .post(todosUrl, {
        todo: {
          content,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          alert("新增成功");
          data.currentTodo = "";
          api.getTodosData();
        }
      })
      .catch((err) => alert(err?.response?.data?.message));
  },
  toggleTodo(id) {
    let targetUrl = toggleTodoUrl(id);
    axios
      .patch(targetUrl)
      .then((res) => {
        data.currentTodo = "";
        api.getTodosData();
      })
      .catch((err) => alert(err?.response?.data?.message));
  },
  delTodo(id) {
    let targetUrl = todoUrl(id);
    axios
      .delete(targetUrl)
      .then((res) => {
        alert(res.data.message);
        data.currentTodo = "";
        return api.getTodosData();
      })
      .catch((err) => alert(err?.response?.data?.message));
  },
  delAllTodos(todosId) {
    const delUrlArr = todosId.map((item) => todoUrl(item));
    delAll(delUrlArr)
      .then((res) => {
        if (res.length !== 0) {
          alert("成功刪除已完成項目");
          return api.getTodosData();
        } else {
          alert("刪除失敗");
        }
      })
      .catch((err) => {
        alert("刪除失敗");
        alert(err);
      });
    function delAll(arrUrl) {
      return Promise.allSettled(arrUrl.map(fetchData));
    }

    function fetchData(itemUrl) {
      return axios
        .delete(itemUrl)
        .then((res) => {
          return true;
        })
        .catch((err) => {
          alert("fetchData", err);
          return false;
        });
    }
  },
  editTodo(id, content) {
    let targetUrl = todoUrl(id);
    axios
      .put(targetUrl, {
        todo: {
          content,
        },
      })
      .then((res) => {
        data.currentTodo = "";
        alert("修改成功");
        return api.getTodosData();
      })
      .catch((err) => alert(err?.response?.data?.message));
  },
};

const render = {
  emptyMsg() {
    let emptyBoard = `<div class="todo__none" >
      <p class="todo__none__text">目前尚無待辦事項</p>
      <img src="../assets/empty.png" alt="" class="todo__none__img"></div>`;
    todoBoard.innerHTML = emptyBoard;
  },
  todoList(todos, tab) {
    let tabContent = render.tabBar(tab);
    let cardFooter = render.tbdNum(data.tbdNum);
    let rawHtml = "";
    if (todos.length === 0) {
      let msg = tab === "tbd" ? "待完成" : "已完成";
      rawHtml = `<p class="card__text">無${msg}項目</p>`;
    } else {
      todos.forEach((item) => {
        let itemState = item.completed_at !== null ? "checked" : "";
        rawHtml += `
              <li class="card__wrap">
             <div class="card__item" data-id="${item.id}">
                <label class="card__label" for="${item.id}">
                    <input type="checkbox" class="card__checkbox"  ${itemState} data-id="${item.id}" data-type="checkBox"/>
                    <span class="card__text">${item.content}</span>
                </label>  
                <a href="#" class="card__item__btn--edit" data-type="edit" data-id="${item.id}"></a>
                <a href="#" class="card__item__btn--del" data-type="del" data-id="${item.id}">
                </a>
                </div>
                <div data-type="editBox" data-editBox="${item.id}" class="todo__edit"></div>
            </li>
            
            `;
      });
    }
    todoBoard.innerHTML = `<div class="card todo__card">
    <ul class="tab__list" id="tabBar">${tabContent}</ul>
    <ul class="card__list"> ${rawHtml}</ul>
    ${cardFooter}</div>`;
  },
  tabBar(tabState) {
    let rawHtml = "";
    typeData.tab.forEach((item) => {
      let itemState = item.tab === tabState ? "active" : "";
      rawHtml += ` <li class="tab__item ${itemState}" data-type ="tab" data-tab="${item.tab}">${item.title}</li>`;
    });
    return rawHtml;
  },
  tbdNum(num) {
    let rawHtml = `<div class="card__footer">
        <p class="card__footer__item">${num}個待完成項目</p>
        <p class="card__footer__item card__footer__item--del" id="del-all" data-type="delAll">清除已完成項目</p>
      </div>`;
    return rawHtml;
  },
  editBox(targetId) {
    const editBoxDom = document.querySelector(`[data-editBox="${targetId}"]`);
    editBoxDom.style.display = "block";
    let rawHtml = `<div class="todo__edit__container"><input type="text" name="edit_input" placeholder="輸入修改內容" class="form__input todo__edit__input" data-type="editInput" data-id="${targetId}"/>
      <div class=" todo__edit__setting">
        <a type="button" class="todo__edit__btn todo__edit__btn--save" data-type="editSave" data-id="${targetId}">save</a>
        <a type="button" class="todo__edit__btn todo__edit__btn--cancel" data-type="editCancel" data-id="${targetId}">cancel</a></div>`;
    editBoxDom.innerHTML = rawHtml;
  },
  closeEdit(targetId) {
    const editBoxDom = document.querySelector(`[data-editBox="${targetId}"]`);
    editBoxDom.innerHTML = "";
    editBoxDom.style.display = "none";
    data.currentTodo = "";
  },
};

const event = {
  logout(e) {
    e.preventDefault();
    if (e.target.getAttribute("id") === "logoutBtn") {
      api.logout();
    }
  },
  addTodoData(e) {
    e.preventDefault();
    const target = e.target;
    if (target.getAttribute("id") !== "addTodoBtn") return;
    const todoValue = document.querySelector("#todo_input").value;
    if (todoValue.length === 0) {
      return alert("請先輸入待辦事項");
    }
    data.currentTodo = todoValue;
    api.addTodo(data.currentTodo);
  },
  triggerBoard(e) {
    e.preventDefault();
    let target = e.target;
    let targetType = target.dataset.type;
    let targetId = target.dataset.id ? target.dataset.id : "";
    if (targetType === "tab") {
      data.currentTab = target.dataset.tab;
      event.changeTab(data.currentTab);
    } else if (targetType === "checkBox") {
      api.toggleTodo(targetId);
    } else if (targetType === "del") {
      api.delTodo(targetId);
    } else if (targetType === "delAll") {
      event.delAllTodos(data.doneData);
    } else if (targetType === "edit") {
      render.editBox(targetId);
    } else if (targetType === "editSave") {
      return event.editTodo(targetId);
    } else if (targetType === "editCancel") {
      return render.closeEdit(targetId);
    }
  },
  changeTab(tabState) {
    const tabBar = document.querySelector("#tabBar");
    let tabContent = render.tabBar(tabState);
    tabBar.innerHTML = tabContent;
    //   資料重新渲染
    if (tabState === "all") {
      return render.todoList(data.todosData, data.currentTab);
    } else if (tabState === "tbd") {
      return render.todoList(data.tbdData, data.currentTab);
    } else if (tabState === "done") {
      return render.todoList(data.doneData, data.currentTab);
    }
  },
  delAllTodos(doneData) {
    if (doneData.length === 0) {
      return alert("無已完成項目");
    }
    const todosId = doneData.map((item) => item.id);
    api.delAllTodos(todosId);
  },
  editTodo(targetId) {
    const todoValue = document.querySelector(`[data-type="editInput"]`).value;
    if (todoValue.length === 0) {
      return alert("請先輸入修改內容");
    }
    data.currentTodo = todoValue;
    return api.editTodo(targetId, data.currentTodo);
  },
};

const account = {
  init() {
    if (token.length <= 0) {
      alert("未確實登入");
      return account.removeToken();
    } else {
      api.checkLogin(token);
    }
  },
  removeToken() {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("nickname");
    setTimeout("window.location.href='../pages/login.html'", 500);
  },
};

// 3 init
account.init();

// 5 event listener
todoBoard.addEventListener("click", event.triggerBoard);
addTodoBtn.addEventListener("click", event.addTodoData);
logoutBtn.addEventListener("click", event.logout);
