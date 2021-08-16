import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Register from '@/pages/auth/Register'
import ForgetPassword from '@/pages/auth/ForgetPassword'
import Login from '@/pages/auth/Login'
import ProjectList from '@/pages/project/ProjectList'
import TaskQueueList from '@/pages/taskqueue/TaskQueueList'
import New_Login from '@/pages/user/New_Login'

Vue.use(Router);

export default new Router({
    mode:'history',
    // base: '/', //加上这一行
    // mode:'hash',
    routes: [
        {
            path: '/register',
            name: 'Register',
            component: Register,
            meta: {
                title: '用户注册'
            }
        }, {
            path: '/forgetpassword',
            name: 'ForgetPassword',
            component: ForgetPassword,
            meta: {
                title: '找回密码'
            }
        }, {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: '用户登录'
            }
        },
        {

            path: '/',
            name: 'Index',
            component: Home,
            meta: {
                title: '首页',
                requireAuth: true
            },
            children: [
                {
                    name: 'ProjectList',
                    path: 'project_list',
                    component: ProjectList,
                    meta: {
                        title: '项目列表',
                        requireAuth: true,
                    }
                },
                {
                    name: 'TaskQueue',
                    path: 'taskqueue/:id',
                    component: TaskQueueList,
                    meta: {
                        title: '任务队列',
                        requireAuth: true
                    }

                },
                {
                    name: 'New_Login',
                    path: '/new_login',
                    component: New_Login,
                    meta: {
                        title: '新登录页'
                    }
                },
            ]
        }
    ]
})

