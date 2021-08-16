import axios from 'axios'
import store from '../store/state'
import router from '../router'
import {Message} from 'element-ui';


// export const baseUrl = "http://192.168.126.104:5000";
// export const webUrl = "http://192.168.126.104:8001";
export const baseUrl = "http://127.0.0.1:80";
export const webUrl = "http://127.0.0.1:8000";

// export const baseUrl = "http://192.168.87.81:8000";
// export const webUrl = "http://192.168.87.81:8081";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseUrl;

axios.interceptors.request.use(function (config) {
    if (config.url.indexOf("/api/stl/project/?cursor=") !== -1 ) {
    }
    else if (!config.url.startsWith("/api/user/")) {
        // config.url = config.url + "?token=" + store.token;
        config.headers.Authorization = store.token;  // 必须添加在Authorization中否则出现跨域问题
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


axios.interceptors.response.use(function (response) {

    return response;
}, function (error) {
    try {
        if (error.response.status === 401) {
            router.replace({
                name: 'Login'
            })
        }

        if (error.response.status === 500) {
            Message.error({
                message: '服务器内部异常, 请检查',
                duration: 1000
            })

        }
    }
    catch (e) {
        Message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
        })
    }
});

// user api
export const register = params => {
    return axios.post('/api/user/register/', params).then(res => res.data)
};

export const forgetpassword = params => {
    return axios.patch('/api/user/forgetpassword/', params).then(res => res.data)
};

export const login = params => {
    return axios.post('/api/user/login/', params).then(res => res.data)
};


// stl api
export const addProject = params => {
    return axios.post('/api/stl/project/', params).then(res => res.data)
};

export const deleteProject = config => {
    return axios.delete('/api/stl/project/', config).then(res => res.data)
};

export const getProjectList = params => {
    // return axios.get('/api/stl/project/', {params}).then(res => res.data)
    return axios.get('/api/stl/project/', params).then(res => res.data)
};

export const getProjectDetail = pk => {
    return axios.get('/api/stl/project/' + pk + '/').then(res => res.data)
};

export const getLogText = params => {
    return axios.get('/api/stl/getLog' + '/', params).then(res => res.data)
};

export const getprojecName = params => {
    return axios.get('/api/stl/management/projectname/', params).then(res => res.data)
};

export const getusername = params => {
    return axios.get('/api/stl/management/username/', params).then(res => res.data)
};

export const getusertype = params => {
    return axios.get('/api/stl/management/type/', params).then(res => res.data)
};

export const changeManagement = params => {
    return axios.post('/api/stl/management/change/', params).then(res => res.data)
};

// export const getprojectstatus = params => {
//     return axios.get('/api/stl/projectstatus/', params).then(res => res.data)
// };

export const getPagination = url => {
    return axios.get(url).then(res => res.data)
};

export const updateProject = params => {
    return axios.patch('/api/stl/project/', params).then(res => res.data)
};

export const reportList = params => {
    return axios.get('/api/stl/reports/', params).then(res => res.data)
};

export const deleteReports = url => {
    return axios.delete('/api/stl/reports/' + url + '/').then(res => res.data)
};

export const getReportsPaginationBypage = params => {
    return axios.get('/api/stl/reports/', params).then(res => res.data)
};

export const delAllReports = params => {
    return axios.delete('/api/stl/reports/', params).then(res => res.data)
};

export const watchSingleReports = url => {
    return axios.get('/api/stl/reports/' + url + '/').then(res => res.data)
};

