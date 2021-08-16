<template>
    <el-container>
        
        <!-- 失败重试用例模态框 -->
        <el-container>
            <el-main style="padding: 0; margin-left: 10px;">
                <!-- 删除 style 中 position: fixed; 否则不能显示在顶层 -->
                <div style="bottom: 0; right:0; left: 500px; top: 160px;">

                   <!-- 查看定时任务所选用例 -->
                    <el-dialog
                    :title='task_name + " - 失败用例"'
                    :visible.sync="dialogViewCaseVisible"
                    width="45%"
                    :modal-append-to-body="false"
                    @close="testData=[]"
                    >
                        <span slot="footer" class="dialog-footer">
                        
                            <div style="padding-top: 5px; padding-left: 30px;">
                                <el-button @click="dialogViewCaseVisible = false, testData=[]">取 消</el-button>
                                <el-button type="primary" @click="handleRetryRun(), dialogViewCaseVisible = false, testData=[]">失败重试</el-button>
                            </div>
                        </span>

                    <!-- 去掉height="calc(100%)" 防止无线滚动 -->
                    <el-table
                        :default-sort = "{prop: 'update_time', order: 'descending'}"
                        highlight-current-row
                        ref="multipleTable"
                        v-loading="loading"
                        :data="testData.results"
                        :show-header="testData.count !== 0 "
                        stripe
			            style="overflow-y: auto;"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                        @selection-change="handleSelectionCaseChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                        >
                        </el-table-column>

                        <el-table-column
                            label="序号"
                            width="70"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.$index + 1}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="用例名称"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.name}}</div>
                            </template>
                        </el-table-column>

                         <el-table-column
                         width="170"
                         label="维护人"
                        >
                            <template slot-scope="scope">
                                <div>{{scope.row.responsible}}</div>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-dialog>
            </div>
        </el-main>


        <el-header style="padding: 0; height: 50px; margin-top: 10px">
            <div style="padding-top: 8px; padding-left: 30px;">

                <el-row>
                    <el-col :span="6" v-if="reportData.count > 10">
                        <el-input placeholder="请输入任务名称" clearable v-model="search">
                            <el-button slot="append" icon="el-icon-search" @click="getReportList('is_input_search')"></el-button>
                        </el-input>
                    </el-col>

                    <el-col :span="1">
                        <el-button
                            v-show="reportData.count !== 0"
                            style="margin-left: 20px"
                            type="danger"
                            icon="el-icon-delete"
                            circle
                            size="mini"
                            @click="delSelectionReports"
                        ></el-button>
                    </el-col>

                    <el-col :span="7">
                        <el-pagination
                            :page-size="10"
                            v-show="reportData.count !== 0 "
                            background
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            layout="total, prev, pager, next, jumper"
                            :total="reportData.count"
                        >
                        </el-pagination>
                    </el-col>
                </el-row>

            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0; margin-left: 10px;">
                <div style="position: fixed; bottom: 0; right:0; left: 220px; top: 120px">
                    <el-table
                        highlight-current-row
                        :data="reportData.results"
                        :show-header="reportData.results.length !== 0 "
                        stripe
                        height="calc(100%)"
                        @cell-mouse-enter="cellMouseEnter"
                        @cell-mouse-leave="cellMouseLeave"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                        >
                        </el-table-column>

                        <el-table-column
                            label="报告类型"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <!-- <el-tag color="#2C3E50" style="color: white">{{ scope.row.execution_type === 0 ? '定时任务' :'失败重试' }}</el-tag> -->
                                <el-tag color="#003366" style="color: white" v-show="scope.row.execution_type === 0">定时任务</el-tag>
                                <el-tag color="#3399CC" style="color: white" v-show="scope.row.execution_type === 4">失败重试</el-tag>
                                <el-tag color="#99CCCC" style="color: white" v-show="scope.row.execution_type === 5">CICD任务</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="任务名称"
                            width="180"
                        >
                            <template slot-scope="scope">
                                <div>{{ scope.row.execution_name }}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="执行状态"
                        >
                            <template slot-scope="scope">
                                <el-tag v-show="scope.row.run_status === 1">执行中</el-tag>
                                <el-tag type="success" v-show="scope.row.run_status === 2">已完成</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="通过状态"
                        >
                            <template slot-scope="scope"
                            >
                                <div
                                    v-show="scope.row.run_status === 2"
                                    :class="{'pass': scope.row.success, 'fail':!scope.row.success}"
                                    v-text="scope.row.success === true ? 'Pass' :'Fail'"
                                ></div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="开始时间"
                        >
                            <template slot-scope="scope">
                                <div v-show="scope.row.name">{{scope.row.name}}</div>
                                <div v-show="!scope.row.name">{{scope.row.time.start_at|timestampToTime}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="结束时间"
                        >
                            <template slot-scope="scope">
                                <!-- <div v-show="scope.row.run_status === 2">{{scope.row.time.start_at|timestampToTime}}</div> -->
                                <div v-show="scope.row.run_status === 2">{{scope.row.time.start_at}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="持续时间"
                        >
                            <template slot-scope="scope">
                                <div v-show="scope.row.run_status === 2" v-text="scope.row.time.duration.toFixed(1)+' 秒'"></div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="100"
                            label="用例总数"
                        >
                            <template slot-scope="scope">
                                <el-tag>{{ scope.row.stat.case_total }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="100"
                            label="用例失败数"
                        >
                            <template slot-scope="scope">
                                <el-tag type="danger">{{ scope.row.stat.case_fail_total }}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column
                            width="100"
                            label="用例跳过数"
                        >
                            <template slot-scope="scope">
                                <el-tag type="info">0</el-tag>
                            </template>
                        </el-table-column>

						<el-table-column
                            label="执行人"
                        >
                            <template slot-scope="scope">
                                <div v-text="scope.row.executor_name"></div>

                            </template>
                        </el-table-column>

                        <el-table-column>
                            <template slot-scope="scope">
                                <el-row v-show="currentRow === scope.row">
                                    <el-button
                                        type="info"
                                        icon="el-icon-view"
                                        title="查看报告"
                                        circle size="mini"
                                        v-show="scope.row.run_status === 2"
                                        @click="handleWatchReports(scope.row)"
                                    >
                                    </el-button>

                                    <el-button
                                        type="primary"
                                        icon="el-icon-caret-right"
                                        title="失败重试"
                                        circle size="mini"
                                        v-show="scope.row.stat.case_fail_total !== 0 & scope.row.run_status === 2"
                                        @click="handleViewErrorCases(scope.row)"
                                    >
                                    </el-button>

                                    <el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        title="删除"
                                        circle size="mini"
                                        v-show="scope.row.run_status === 2"
                                        @click="handleDelReports(scope.row.id)"
                                    >
                                    </el-button>
                                </el-row>
                            </template>

                        </el-table-column>

                    </el-table>
                </div>
            </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>

    export default {


        data() {
            return {
                search: '',
                IsInputSearch: '',
                selectReports: [],
                currentRow: '',
                currentPage: 1,
                reportData: {
                    count: 0,
                    results: []
                },

                // 下面模态框相关
                dialogTableVisible: false,
                dialogViewCaseVisible: false,
                testData: {
                    count: 0,
                    results: []
                },
                loading: false,
                task_name: '',
                task_id: 0,
                error_cases_id: [],
                selectCases: [],
            }
        },
        methods: {
            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            },

            handleWatchReports(index) {
                console.log(index)
                if (index.type !== "WebUI") {
                            window.open(this.$api.baseUrl + "/api/stl/reports/" + index.id + "/")
                        } else {
                            window.open(index.stat.WebUIurl)
                        }
            },

            // 失败重试 查看
            handleViewErrorCases(row) {
                this.dialogViewCaseVisible = true;
                this.task_name = row.execution_name
                this.task_id = row.execution_id

                // 通过用例名称搜详情
                this.getCaseList(row.stat.error_cases_id);
            },

            // 失败重试error用例查询详情
            getCaseList(error_cases_id) {
                this.$api.testList(
                    {params: {
                        project: this.$route.params.id, 
                        task_id: this.task_id, 
                        error_cases_id: JSON.stringify(error_cases_id),
                        is_not_page: true
                        }}
                    ).then(resp => {
                        this.testData = {'results': resp};
                    })
            },

            // 通用的消息提示
            handleDefaultMsg(type, message){
                // type: 'info', 
                // message: `提示: ${ "执行中，请到【任务队列】查看报告" }`
                if(message){
                    this.$message({
                        type: type,
                        message: message
                    });
                }
            },
            
            handleTime2000Get(){
                this.timer = setTimeout(()=>{
                        this.getReportList();
                        this.currentPage = 1;
                    }, 2000);
            },

            // 失败重试 选择框
            handleSelectionCaseChange(val) {
                this.selectCases = val;
            },

            // 失败重试 运行
            handleRetryRun() {
                let select_error_cases_id = [];
                this.selectCases.map((result, index) => {
                    select_error_cases_id.push(result.id)
                })
                if(select_error_cases_id.length == 0){
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少勾选一个测试用例',
                        duration: 2000
                    })
                }else{
                    this.$api.runCrontab(this.task_id, 
                    {params: 
                        {task_name: this.task_name, 
                        error_cases_id: JSON.stringify(select_error_cases_id)}
                        }
                    ).then(resp => {
                        this.handleDefaultMsg('warning', resp.msg)
                    });
                    this.handleDefaultMsg('success', `提示: ${ "执行中，请到【任务队列】查看报告" }`);
                    this.handleTime2000Get();
                }
            }, 
            
            handleSelectionChange(val) {
                this.selectReports = val;
            },

            handleCurrentChange(val) {
                let search = this.search
                if(this.$route.query.searchName) {
                    search = this.$route.query.searchName
                }if(this.IsInputSearch){
                    search = this.search
                }
                this.$api.getReportsPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id,
                        search: search,
                        execution_type: JSON.stringify([0, 4, 5])  // 定时任务状态和失败重试状态
                    }
                }).then(resp => {
                    this.reportData = resp;
                })
            },

            handleDelReports(index) {
                this.$confirm('此操作将永久删除该测试报告，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteReports(index).then(resp => {
                        if (resp.success) {
                            this.getReportList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },

            delSelectionReports() {
                if (this.selectReports.length !== 0) {
                    this.$confirm('此操作将永久删除勾选的测试报告，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllReports({data: this.selectReports}).then(resp => {
                            this.getReportList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少勾选一个测试报告',
                        duration: 1000
                    })
                }
            },
            getReportList(IsInputSearch) {
                let search = this.search
                if(this.$route.query.searchName) {
                    search = this.$route.query.searchName
                } if(IsInputSearch){
                    // 如果需要忽略url傳參，搜索空内容等
                    search = this.search;
                    this.IsInputSearch = 'IsInputSearch'
                }
                this.$api.reportList({
                    params: {
                        project: this.$route.params.id,
                        search: search,
                        execution_type: JSON.stringify([0, 4, 5])  // 定时任务状态和失败重试状态
                    }
                }).then(resp => {
                    this.reportData = resp;
                })
                
            },
            
        },
        name: "TaskQueueList",

        mounted() {
            this.getReportList();
            if(this.timer){
                clearInterval(this.timer)
            }else{
                this.timer=setInterval(()=>{
                   this.handleCurrentChange();
                }, 1000000)
            }
        },
        //组件销毁时清除
        destroyed(){
            clearInterval(this.timer)
        },
    }
</script>

<style scoped>
    .pass {
        font-weight: bold;
        color: #13ce66;
    }
    .fail {
        font-weight: bold;
        color: red;
    }


</style>
