export const baseUrl = "https://todoo.5xcamp.us";

// user
export const registerUrl = `${baseUrl}/users`;
export const loginUrl = `${registerUrl}/sign_in`;
export const logoutUrl = `${registerUrl}/sign_out`;
export const checkUrl = `${baseUrl}/check`;

// todo
export const todosUrl = `${baseUrl}/todos`;
export const todoUrl = (todo_id) => `${todosUrl}/${todo_id}`;
export const toggleTodoUrl = (todo_id) => `${todoUrl(`${todo_id}`)}/toggle`;
