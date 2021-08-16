<template>
    <el-container>
        <el-header style="background: #F7F7F7; padding: 0; height: 50px">
            <div>
                <div style="padding-top: 10px; margin-left: 10px;">
                    <el-button type="primary"
                               size="small"
                               icon="el-icon-circle-plus"
                               @click="dialogVisible = true">
                        添加环境
                    </el-button>
                    <el-button type="primary"
                               size="small"
                               icon="el-icon-zoom-in"
                               @click="openprojectview">
                        查看环境执行情况
                    </el-button>

                    <el-button style="margin-left: 50px"
                               type="info"
                               round
                               size="small"
                               icon="el-icon-d-arrow-left"
                               :disabled="projectData.previous === null "
                               @click="getPagination(projectData.previous)"
                    >
                        上一页
                    </el-button>

                    <el-button type="info"
                               round
                               size="small"
                               :disabled="projectData.next === null"
                               @click="getPagination(projectData.next)"
                    >
                        下一页
                        <i class="el-icon-d-arrow-right"></i>
                    </el-button>

                    <el-dialog
                        title="添加环境"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form :model="projectForm"
                                 :rules="rules"
                                 ref="projectForm"
                                 label-width="100px"
                                 class="project">
                            <el-form-item label="环境名称" prop="name">
                                <el-input v-model="projectForm.name" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="环境描述" prop="desc">
                                <el-input v-model="projectForm.desc" clearable></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('projectForm')">确 定</el-button>
                      </span>
                    </el-dialog>

                    <el-dialog
                        title="各环境执行情况汇总图"
                        :visible.sync="dialogProject"
                        width="90%"
                        height="90%"
                        align="center"
                    >
                        <div id="projectChart" :style="{width: '100%', height: '700px', marginRight:'100%'}"></div>
                    </el-dialog>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px">
                <el-table
                    highlight-current-row
                    :data="projectData.results"
                    border
                    stripe
                    :show-header="projectData.results.length > 0"
                    style="width: 100%;"
                >
                    <el-table-column
                        label="环境名称"
                        width="250"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span
                                style="font-size: 18px; font-weight: bold; cursor: pointer;"
                                @click="handleCellClick(scope.row)"
                            >{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="负责人"
                        width="200"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.responsible }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="环境描述"
                        width="300"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.desc }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="更新时间"
                        width="260"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.update_time | datetimeFormat }}</span>
                        </template>
                    </el-table-column>


                    <el-table-column
                        label="操作"
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-button
                                size="medium"
                                @click="handleCellClick(scope.row)">详情
                            </el-button>

                            <el-button
                                size="medium"
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>

                            <el-dialog
                                title="编辑环境"
                                :visible.sync="editVisible"
                                width="30%"
                            >
                                <el-form :model="projectForm"
                                         :rules="rules"
                                         ref="projectForm"
                                         label-width="100px"
                                         class="project">
                                    <el-form-item label="环境名称" prop="name">
                                        <el-input v-model="projectForm.name" clearable></el-input>
                                    </el-form-item>
                                    <el-form-item label="环境描述" prop="desc">
                                        <el-input v-model="projectForm.desc" clearable></el-input>
                                    </el-form-item>
                                </el-form>
                                <span slot="footer" class="dialog-footer">
                        <el-button @click="editVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('projectForm')">确 定</el-button>
                      </span>
                            </el-dialog>
                            <el-button
                                size="medium"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
        </el-container>
    </el-container>


</template>

<script>
    export default {
        name: "ProjectList",
        inject:['reload'],
        data() {
            return {
                dialogVisible: false,
                editVisible: false,
                dialogProject: false,
                projectdataMap: {
                    "casestepdic": {},
                    "casedic": {},
                    "newcasedic": {},
                    "reportsuccessdic": {},
                    "reportfaildic": {},
                    "apidic": {},
                    "timeList":[],
                    "projectnameList":[],
                    "updateTime": ""
                },
                projectData: {
                    results: []
                },
                projectForm: {
                    name: '',
                    desc: '',
                    responsible: this.$store.state.user,
                    id: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入环境名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多不超过50个字符', trigger: 'blur'}
                    ],
                    desc: [
                        {required: true, message: '简要描述下该环境', trigger: 'blur'},
                        {min: 1, max: 100, message: '最多不超过100个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleCellClick(row) {
                //
                this.$store.commit('setRouterName', 'TaskQueue');
                this.setLocalValue("routerName",'TaskQueue');
                this.$router.push({name: 'TaskQueue', params: {id: row['id']}});
                this.timer = setTimeout(()=>{   //设置延迟执行
                    this.reload();
                },300);
            },

            handleEdit(index, row) {
                this.editVisible = true;
                this.projectForm.name = row['name'];
                this.projectForm.desc = row['desc'];
                this.projectForm.id = row['id'];
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该环境, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.deleteProject({data: {"id": row["id"]}}).then(resp => {
                        if (resp['success']) {
                            this.success(resp);
                            this.getProjectList();
                        } else {
                            this.failure(resp);
                        }
                    })
                })
            },
            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.editVisible = false;
                        let obj;

                        if (this.projectForm.id === '') {
                            obj = this.$api.addProject(this.projectForm);
                        } else {
                            obj = this.$api.updateProject(this.projectForm);
                        }
                        obj.then(resp => {
                            if (resp.success) {
                                this.success(resp);
                                this.getProjectList();
                            } else {
                                this.failure(resp);
                            }

                            this.projectForm.name = '';
                            this.projectForm.desc = '';
                            this.projectForm.id = '';
                        })
                    } else {
                        if (this.projectForm.id !== '') {
                            this.editVisible = true;
                        } else {
                            this.dialogVisible = true;
                        }
                        return false;
                    }
                });

            },
            success(resp) {
                this.$notify({
                    message: resp["msg"],
                    type: 'success',
                    duration: 1000
                });
            },
            failure(resp) {
                this.$notify.error({
                    message: resp["msg"],
                    duration: 1000
                });
            },
            getProjectList() {
                this.$api.getProjectList().then(resp => {
                    this.projectData = resp;
                })
            },
            getPagination(url) {
                this.$api.getPagination(url).then(resp => {
                    this.projectData = resp;
                })
            },
            // openprojectobj() {
            //     this.$api.getprojectstatus().then(resp => {
            //         this.projectdataMap["casestepdic"] = resp.msg["casestepdic"];
            //         this.projectdataMap["casedic"] = resp.msg["casedic"];
            //         this.projectdataMap["newcasedic"] = resp.msg["newcasedic"];
            //         this.projectdataMap["reportsuccessdic"] = resp.msg["reportsuccessdic"];
            //         this.projectdataMap["reportfaildic"] = resp.msg["reportfaildic"];
            //         this.projectdataMap["apidic"] = resp.msg["apidic"];
            //         this.projectdataMap["timeList"] = resp.msg["timeList"];
            //         this.projectdataMap["projectnameList"] = resp.msg["projectnameList"];
            //         this.projectdataMap["updateTime"] = resp.msg["updateTime"];
            //     });
            // },
            openprojectview() {
                this.dialogProject = true;

                this.$nextTick(function () {

                    this.drawLine()
                })

            },
            drawLine() {
                // console.log(this.projectdataMap.newcasedic[this.projectdataMap.timeList[0] + "sumnum"]);
                let proChart = this.$echarts.init(document.getElementById('projectChart'));
                var projectoption = {
                    baseOption: {
                        timeline: {
                            axisType: 'category',
                            // realtime: false,
                            // loop: false,
                            autoPlay: true,
                            currentIndex: 6,
                            playInterval: 3000,
                            // controlStyle: {
                            //     position: 'left'
                            // },
                            data: this.projectdataMap.timeList,
                            // label: {
                            //     formatter : function(s) {
                            //         return (new Date(s)).getFullYear();
                            //     }
                            // }
                        },
                        title: {
                            subtext: '数据来自接口自动化平台，更新于：' + this.projectdataMap.updateTime
                        },
                        tooltip: {
                        },
                        legend: {
                            left: 'right',
                            data: ['新增用例数', '运行结果成功', '运行结果失败', '接口总数', '用例Api总数', '用例集总数'],
                            selected: {
                                '接口总数': false, '用例Api总数': false, '用例集总数': false
                            }
                        },
                        calculable : true,
                        grid: {
                            top: 80,
                            bottom: 100,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow',
                                    label: {
                                        show: true,
                                        formatter: function (params) {
                                            return params.value.replace('\n', '').replace('\n\n', '');
                                        }
                                    }
                                }
                            }
                        },
                        xAxis: [
                            {
                                'type':'category',
                                'axisLabel':{'interval':0},
                                'data':this.projectdataMap.projectnameList,
                                splitLine: {show: false},
                                gridIndex: 0
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '数量（个）'
                            }
                        ],
                        series: [
                            {name: '新增用例数', type: 'bar', itemStyle: {normal: {color:'#E6A23C', label: {show: true, position: 'top',textStyle: {color: 'black',fontSize: 10}}}}},
                            {name: '运行结果成功', type: 'bar', itemStyle: {normal: {color:'#67C23A', label: {show: true, position: 'top',textStyle: {color: 'black',fontSize: 10}}}}},
                            {name: '运行结果失败', type: 'bar', itemStyle: {normal: {color:'#F56C6C', label: {show: true, position: 'top',textStyle: {color: 'black',fontSize: 10}}}}},
                            {name: '接口总数', type: 'bar', itemStyle: {normal: {color:'#9966CC', label: {show: true, position: 'top',textStyle: {color: 'black',fontSize: 10}}}}},
                            {name: '用例Api总数', type: 'bar', itemStyle: {normal: {color:'#3399FF', label: {show: true, position: 'top',textStyle: {color: 'black',fontSize: 10}}}}},
                            {name: '用例集总数', type: 'bar', itemStyle: {normal: {color:'#9999FF', label: {show: true, position: 'top',textStyle: {color: 'black',fontSize: 10}}}}},

                            {
                                name: '用例数量：',
                                type: 'pie',
                                center: ['80%', '25%'],
                                radius: '28%',
                                z: 100,
                                itemStyle:{
                                    normal:{
                                        label:{
                                            show: true,
                                            formatter: '{b} : {c} ({d}%)'
                                        },
                                        labelLine :{show:true}
                                    }
                                }
                            },

                        ]
                    },

                    options: [
                        // console.log(this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[0]][-1]),
                        {
                            title: {text: "日期：" + this.projectdataMap.timeList[0]},
                            series: [
                                {data: this.projectdataMap.newcasedic[this.projectdataMap.timeList[0]]},
                                {data: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[0]]},
                                {data: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[0]]},
                                {data: this.projectdataMap.apidic[this.projectdataMap.timeList[0]]},
                                {data: this.projectdataMap.casestepdic[this.projectdataMap.timeList[0]]},
                                {data: this.projectdataMap.casedic[this.projectdataMap.timeList[0]]},
                                {data: [
                                    {name: '新增用例数', value: this.projectdataMap.newcasedic[this.projectdataMap.timeList[0] + "sumnum"], itemStyle: {normal: {color:'#E6A23C'}}},
                                    {name: '运行结果失败', value: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[0] + "sumnum"], itemStyle: {normal: {color:'#F56C6C'}}},
                                    {name: '运行结果成功', value: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[0] + "sumnum"], itemStyle: {normal: {color:'#67C23A'}}}
                                ]},
                            ]
                        },
                        {
                            title: {text: "日期：" + this.projectdataMap.timeList[1]},
                            series: [
                                {data: this.projectdataMap.newcasedic[this.projectdataMap.timeList[1]]},
                                {data: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[1]]},
                                {data: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[1]]},
                                {data: this.projectdataMap.apidic[this.projectdataMap.timeList[1]]},
                                {data: this.projectdataMap.casestepdic[this.projectdataMap.timeList[1]]},
                                {data: this.projectdataMap.casedic[this.projectdataMap.timeList[1]]},
                                {data: [
                                    {name: '新增用例数', value: this.projectdataMap.newcasedic[this.projectdataMap.timeList[1] + "sumnum"], itemStyle: {normal: {color:'#E6A23C'}}},
                                    {name: '运行结果失败', value: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[1] + "sumnum"], itemStyle: {normal: {color:'#F56C6C'}}},
                                    {name: '运行结果成功', value: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[1] + "sumnum"], itemStyle: {normal: {color:'#67C23A'}}}
                                ]},
                            ]
                        },
                        {
                            title: {text: "日期：" + this.projectdataMap.timeList[2]},
                            series: [
                                {data: this.projectdataMap.newcasedic[this.projectdataMap.timeList[2]]},
                                {data: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[2]]},
                                {data: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[2]]},
                                {data: this.projectdataMap.apidic[this.projectdataMap.timeList[2]]},
                                {data: this.projectdataMap.casestepdic[this.projectdataMap.timeList[2]]},
                                {data: this.projectdataMap.casedic[this.projectdataMap.timeList[2]]},
                                {data: [
                                    {name: '新增用例数', value: this.projectdataMap.newcasedic[this.projectdataMap.timeList[2] + "sumnum"], itemStyle: {normal: {color:'#E6A23C'}}},
                                    {name: '运行结果失败', value: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[2] + "sumnum"], itemStyle: {normal: {color:'#F56C6C'}}},
                                    {name: '运行结果成功', value: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[2] + "sumnum"], itemStyle: {normal: {color:'#67C23A'}}}
                                ]},
                            ]
                        },
                        {
                            title: {text: "日期：" + this.projectdataMap.timeList[3]},
                            series: [
                                {data: this.projectdataMap.newcasedic[this.projectdataMap.timeList[3]]},
                                {data: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[3]]},
                                {data: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[3]]},
                                {data: this.projectdataMap.apidic[this.projectdataMap.timeList[3]]},
                                {data: this.projectdataMap.casestepdic[this.projectdataMap.timeList[3]]},
                                {data: this.projectdataMap.casedic[this.projectdataMap.timeList[3]]},
                                {data: [
                                    {name: '新增用例数', value: this.projectdataMap.newcasedic[this.projectdataMap.timeList[3] + "sumnum"], itemStyle: {normal: {color:'#E6A23C'}}},
                                    {name: '运行结果失败', value: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[3] + "sumnum"], itemStyle: {normal: {color:'#F56C6C'}}},
                                    {name: '运行结果成功', value: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[3] + "sumnum"], itemStyle: {normal: {color:'#67C23A'}}}
                                ]},
                            ]
                        },
                        {
                            title: {text: "日期：" + this.projectdataMap.timeList[4]},
                            series: [
                                {data: this.projectdataMap.newcasedic[this.projectdataMap.timeList[4]]},
                                {data: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[4]]},
                                {data: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[4]]},
                                {data: this.projectdataMap.apidic[this.projectdataMap.timeList[4]]},
                                {data: this.projectdataMap.casestepdic[this.projectdataMap.timeList[4]]},
                                {data: this.projectdataMap.casedic[this.projectdataMap.timeList[4]]},
                                {data: [
                                    {name: '新增用例数', value: this.projectdataMap.newcasedic[this.projectdataMap.timeList[4] + "sumnum"], itemStyle: {normal: {color:'#E6A23C'}}},
                                    {name: '运行结果失败', value: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[4] + "sumnum"], itemStyle: {normal: {color:'#F56C6C'}}},
                                    {name: '运行结果成功', value: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[4] + "sumnum"], itemStyle: {normal: {color:'#67C23A'}}}
                                ]},
                            ]
                        },
                        {
                            title: {text: "日期：" + this.projectdataMap.timeList[5]},
                            series: [
                                {data: this.projectdataMap.newcasedic[this.projectdataMap.timeList[5]]},
                                {data: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[5]]},
                                {data: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[5]]},
                                {data: this.projectdataMap.apidic[this.projectdataMap.timeList[5]]},
                                {data: this.projectdataMap.casestepdic[this.projectdataMap.timeList[5]]},
                                {data: this.projectdataMap.casedic[this.projectdataMap.timeList[5]]},
                                {data: [
                                    {name: '新增用例数', value: this.projectdataMap.newcasedic[this.projectdataMap.timeList[5] + "sumnum"], itemStyle: {normal: {color:'#E6A23C'}}},
                                    {name: '运行结果失败', value: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[5] + "sumnum"], itemStyle: {normal: {color:'#F56C6C'}}},
                                    {name: '运行结果成功', value: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[5] + "sumnum"], itemStyle: {normal: {color:'#67C23A'}}}
                                ]},
                            ]
                        },
                        {
                            title: {text: "日期：" + this.projectdataMap.timeList[6]},
                            series: [
                                {data: this.projectdataMap.newcasedic[this.projectdataMap.timeList[6]]},
                                {data: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[6]]},
                                {data: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[6]]},
                                {data: this.projectdataMap.apidic[this.projectdataMap.timeList[6]]},
                                {data: this.projectdataMap.casestepdic[this.projectdataMap.timeList[6]]},
                                {data: this.projectdataMap.casedic[this.projectdataMap.timeList[6]]},
                                {data: [
                                    {name: '新增用例数', value: this.projectdataMap.newcasedic[this.projectdataMap.timeList[6] + "sumnum"], itemStyle: {normal: {color:'#E6A23C'}}},
                                    {name: '运行结果失败', value: this.projectdataMap.reportfaildic[this.projectdataMap.timeList[6] + "sumnum"], itemStyle: {normal: {color:'#F56C6C'}}},
                                    {name: '运行结果成功', value: this.projectdataMap.reportsuccessdic[this.projectdataMap.timeList[6] + "sumnum"], itemStyle: {normal: {color:'#67C23A'}}}
                                ]},
                            ]
                        },
                    ]
                };
                proChart.setOption(projectoption)
            }
        },
        mounted() {
            this.getProjectList();
            // this.openprojectobj();
        },
        name: "ProjectList"
    }
</script>

<style scoped>

</style>
