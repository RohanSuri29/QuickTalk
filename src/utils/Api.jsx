const BASE_URL = import.meta.env.VITE_API_URL;

export const authEndpoints = {

    User_login_api: BASE_URL + '/api/v1/auth/login',
    User_signup_api: BASE_URL + '/api/v1/auth/signup',
    User_logout_api: BASE_URL + '/api/v1/auth/logout',
    User_getUser_api: BASE_URL + '/api/v1/auth/getUser',
    User_resetPasswordToken_api: BASE_URL + '/api/v1/auth/forgot-password',
    User_resetPassword_api: BASE_URL + '/api/v1/auth/update-password',
    User_getAllusers_api: BASE_URL + '/api/v1/auth/getAllUsers',
    User_deleteAccount_api: BASE_URL + '/api/v1/auth/delete'
}

export const projectEndpoints = {
    Project_create_api: BASE_URL + '/api/v1/project/create',
    Project_getAllProjects_api: BASE_URL + '/api/v1/project/getAllProjects',
    Project_getProject_api: BASE_URL + '/api/v1/project/getProject',
    Project_addUser_api: BASE_URL + '/api/v1/project/addUser',
    Project_deleteProject_api: BASE_URL + '/api/v1/project/delete',
    Project_updateFileTree_api: BASE_URL + '/api/v1/project/update-fileTree',
    Project_getMessages_api: BASE_URL + '/api/v1/project/getMessages'
}

export const aiEndpoints = {
    Gemini_getResult_api: BASE_URL + '/api/v1/ai/get-result'
}