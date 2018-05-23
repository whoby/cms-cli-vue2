<template>
    <div class="page">
        <div class="row toolbar">
            <label>群发ID：</label>
            <el-input type="text" v-model="search.id" placeholder="请输入群发ID"></el-input>
            <label>任务名称：</label>
            <el-input type="text" v-model="search.name" placeholder="请输入任务名称"></el-input>
            <label>群发类型：</label>
            <el-select v-model="search.msgTypeCode" placeholder="请选择" clearable>
                <el-option v-for="(item, i) in stack.msgTypes" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <label>发送结果：</label>
            <el-select v-model="search.status" placeholder="请选择" clearable>
                <el-option v-for="(item, i) in stack.status" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
        </div>
        <div class="row toolbar">
            <label>群发内容：</label>
            <el-input type="text" v-model="search.content" placeholder="请输入群发内容"></el-input>
            <label>目标群聊ID：</label>
            <el-input type="text" v-model="search.groupOpenId" placeholder="请输入目标群聊ID"></el-input>
            <label>操作人：</label>
            <el-input type="text" v-model="search.operatorName" placeholder="请输入操作人"></el-input>
            <label>操作人ID：</label>
            <el-input type="text" v-model="search.operatorId" placeholder="请输入操作人ID"></el-input>
        </div>
        <div class="row toolbar">
            <label>开始时间：</label>
            <el-date-picker v-model="stack.startTimeRange" type="datetimerange" :picker-options="datePickerOpt" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            <label>新建时间：</label>
            <el-date-picker v-model="stack.createTimeRange" type="datetimerange" :picker-options="datePickerOpt" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            <el-button type="warning" @click="onSearch">查询</el-button>
        </div>
        <div class="row toolbar">
            <el-button type="info" @click="onTaskEdit()">新建</el-button>
        </div>
        <el-table :data="gridData" :fit="true" stripe>
            <el-table-column prop="id" label="群发ID" width="80px"></el-table-column>
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="msgTypeCode" label="群发类型">
                <template slot-scope="scope">{{getMsgTypeName(scope.row.msgTypeCode)}}</template>
            </el-table-column>
            <el-table-column prop="status" label="发送结果">
                <template slot-scope="scope">{{stack.status[scope.row.status].name}}</template>
            </el-table-column>
            <el-table-column prop="failNum" label="未完成群">
                <template slot-scope="scope">
                    <a href="javascript:;" @click="onShowSendDetail(scope.row.id, '1')">{{scope.row.failNum}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="totalNum" label="目标群">
                <template slot-scope="scope">
                    <a href="javascript:;" @click="onShowSendDetail(scope.row.id, '')">{{scope.row.totalNum}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="群发内容" show-overflow-tooltip></el-table-column>
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column prop="createTime" label="新建时间"></el-table-column>
            <el-table-column prop="operatorName" label="操作人"></el-table-column>
            <el-table-column prop="operatorId" label="操作人ID"></el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button size="small" v-if="scope.row.status==3" @click="doTaskAction(scope.row.id, 'start')">启动</el-button>
                    <el-button size="small" v-if="scope.row.status==0" @click="doTaskAction(scope.row.id, 'pause')">暂停</el-button>
                    <el-button type="primary" size="small" v-if="scope.row.status==0 || scope.row.status==3" @click="onTaskEdit(scope.row.id, scope.row.status)">编辑</el-button>
                    <el-button size="small" v-if="scope.row.status!=2 && scope.row.status!=4" @click="doTaskAction(scope.row.id, 'close')">取消</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagerout" v-if="search.total">
            <el-pagination small layout="total, prev, pager, next, jumper" :page-size="search.size" :total="search.total" @current-change="onPageChange"></el-pagination>
        </div>
        <!-- 查看发送情况 dialog -->
        <el-dialog :title="(sendDetail.type==='1' ? '未完成' : '目标') + '群发任务列表'" :visible.sync="sendDialogShow" :close-on-click-modal="false" width="40%">
            <el-table :data="sendDetail.gridData" :fit="true" stripe>
                <el-table-column prop="groupName" label="群名"></el-table-column>
                <el-table-column prop="groupId" label="群ID"></el-table-column>
                <el-table-column prop="total" label="群成员数量"></el-table-column>
            </el-table>
            <div class="pagerout" v-if="search.total">
                <el-pagination small layout="total, prev, pager, next, jumper" :page-size="sendDetail.size" :total="sendDetail.total" @current-change="onSendPageChange"></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="sendDetail.type==='1'" @click="onReSend">重 发</el-button>
                <el-button @click="sendDialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!-- add/edit dialog -->
        <el-dialog title="新增/编辑群发" :visible.sync="addDialogShow" :close-on-click-modal="false" width="45%" class="addForm">
            <el-form :model="addForm">
                <el-form-item label="任务名称" required>
                    <el-input v-model="addForm.name" placeholder="请输入任务名称" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="群发类型" required>
                    <el-select v-model="addForm.msgTypeCode" placeholder="请选择" clearable>
                        <el-option v-for="(item, i) in stack.msgTypes" :key="i" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目标群聊" required>
                    <el-input v-model="addForm.groupOpenIds" placeholder="请选择目标群" auto-complete="off"></el-input>
                    <el-button @click="onShowGroupList">选择</el-button>
                </el-form-item>
                <el-form-item label="群发内容" required>
                    <div class="group-content">
                        <el-input id="content" type="textarea" :rows="3" placeholder="请输入群发内容" v-model="addForm.content"></el-input>
                    </div>
                    <el-button @click="onShowVarsList">插入变量</el-button>
                </el-form-item>
                <el-form-item label="开始时间" required>
                    <el-date-picker v-model="addForm.startTime" type="datetime" :picker-options="datePickerOpt" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间">></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSave">确 定</el-button>
                <el-button @click="addDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 目标群选择 dialog -->
        <el-dialog title="新增/编辑群发" :visible.sync="groupDialogShow" :close-on-click-modal="false" width="40%">
            <el-transfer :titles="['群列表', '目标群']" v-model="group.selectIds" :data="group.list"></el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="onSelectGroup">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 变量列表 dialog -->
        <el-dialog title="变量预览" :visible.sync="varsDialogShow" :close-on-click-modal="false" width="40%">
            <el-table :data="vars.gridData" :fit="true" stripe>
                <el-table-column prop="name" label="变量名称"></el-table-column>
                <el-table-column prop="id" label="变量ID"></el-table-column>
                <el-table-column prop="value" label="变量值"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="onSelectVars(scope.row.id)">插入</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagerout" v-if="vars.total">
                <el-pagination small layout="total, prev, pager, next, jumper" :page-size="vars.size" :total="vars.total" @current-change="onVarsPageChange"></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'group',
    mounted() {
        this.getMsgTypeList()
        this.renderGrid()
    },
    data() {
        return {
            url: {
                list: '/task/list',
                typeList: '/task/type/list',
                add: '/task/add',
                detail: '/task/detail',
                sendDetail: '/task/sendDetail',
                reSend: '/task/reSend',
                start: '/task/start',
                pause: '/task/pause',
                close: '/task/close',
                groupList: '/group/groupList',
                varsList: '/variable/variableList'
            },
            stack: {
                msgTypes: [],
                status: [{
                    name: '待发送',
                    code: 0
                }, {
                    name: '发送中',
                    code: 1
                }, {
                    name: '已发送',
                    code: 2
                }, {
                    name: '已暂停',
                    code: 3
                }, {
                    name: '已取消',
                    code: 4
                }],
                startTimeRange: [],
                createTimeRange: []
            },
            search: {
                id: '',
                name: '',
                msgTypeCode: '',
                status: '',
                content: '',
                groupOpenId: '',
                operatorName: '',
                operatorId: '',
                startTimeStart: '',
                startTimeEnd: '',
                createTimeStart: '',
                createTimeEnd: '',
                total: 0,
                start: 0,
                size: 20
            },
            gridData: [],
            // 查看发送列表
            sendDetail: {
                taskId: '',
                gridData: [],
                type: '',
                total: 0,
                start: 0,
                size: 10
            },
            sendDialogShow: false,
            addForm: {
                name: '',
                msgTypeCode: '',
                groupOpenIds: '',
                content: '',
                startTime: ''
            },
            addDialogShow: false,
            // 选择群组
            group: {
                list: [],
                selectIds: []
            },
            groupDialogShow: false,
            // 选择变量
            vars: {
                gridData: [],
                total: 0,
                start: 0,
                size: 10
            },
            varsDialogShow: false,
            datePickerOpt: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }]
            }
        }
    },
    methods: {
        onSearch() {
            this.renderGrid()
        },
        // 获取消息类型
        getMsgTypeList() {
            this.ajax.post(this.url.typeList, {}, (res) => {
                this.stack.msgTypes = res || []
            })
        },
        // 根据类型显示名称
        getMsgTypeName(msgTypeCode) {
            let name = ''
            this.stack.msgTypes.some((item) => {
                if (item.code === msgTypeCode) {
                    name = item.name
                    return true
                }
            })
            return name
        },
        renderGrid() {
            let [startTimeStart, startTimeEnd] = this.stack.startTimeRange || []
            let [createTimeStart, createTimeEnd] = this.stack.createTimeRange || []

            let params = Object.assign(this.search, {
                startTimeStart,
                startTimeEnd,
                createTimeStart,
                createTimeEnd
            })

            this.ajax.post(this.url.list, params, (res) => {
                this.gridData = res.list || []
                this.search.total = ~~res.total
            })
        },

        // 查看发送情况列表
        onShowSendDetail(id, type) {
            this.sendDialogShow = true

            this.sendDetail.taskId = id
            this.sendDetail.type = type

            let params = {
                id: id,
                status: type,
                start: this.sendDetail.start,
                size: this.sendDetail.size
            }
            this.ajax.post(this.url.sendDetail, params, (res) => {
                this.sendDetail.gridData = res.list || []
                this.sendDetail.total = ~~res.total
            })
        },
        onSendPageChange(curPage) {
            this.sendDetail.start = (curPage - 1) * this.sendDetail.size
            this.onShowSendDetail(this.sendDetail.taskId, this.sendDetail.type)
        },
        // 失败任务部分重发
        onReSend() {
            let params = {
                id: this.sendDetail.taskId
            }
            this.ajax.post(this.url.reSend, params, (res) => {
                this.sendDialogShow = false
                this.renderGrid()
            })
        },
        // 选择目标群
        onShowGroupList() {
            this.groupDialogShow = true

            if (this.group.list.length) {
                return
            }
            this.ajax.post(this.url.groupList, {}, (res) => {
                let list = res.list || []
                list.forEach((item) => {
                    this.group.list.push({
                        key: item.id,
                        label: item.name
                    })
                })

                // 过滤掉为空字符情况
                if (this.addForm.groupOpenIds) {
                    this.group.selectIds = this.addForm.groupOpenIds.split(',')
                }
            })
        },
        onSelectGroup() {
            this.groupDialogShow = false
            this.addForm.groupOpenIds = this.group.selectIds.join()
        },
        // 显示变量列表
        onShowVarsList() {
            this.varsDialogShow = true

            if (this.vars.gridData.length) {
                return
            }

            let params = {
                start: this.vars.start,
                size: this.vars.size
            }
            this.ajax.post(this.url.varsList, params, (res) => {
                this.vars.gridData = res.list || []
                this.vars.total = ~~res.total
            })
        },

        // 选择插入变量
        onSelectVars(varId) {
            let index = document.getElementById('content').selectionStart
            this.addForm.content = this.util.getTextInsert(index, this.addForm.content, `{${varId}}`)
            this.varsDialogShow = false
        },
        onVarsPageChange(curPage) {
            this.vars.start = (curPage - 1) * this.vars.size
            this.onShowVarsList(this.vars.id)
        },
        // 启动/暂停/关闭
        doTaskAction(id, action) {
            let typeText = {
                start: '启动',
                pause: '暂停',
                close: '关闭'
            }[action]

            this.$confirm(`确定要${typeText}当前任务吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ajax.post(this.url[action], { id }, (res) => {
                    this.$message({
                        type: 'success',
                        message: res || '操作成功！'
                    })
                    this.renderGrid()
                })
            }).catch(() => {})
        },
        // 新建/编辑
        onTaskEdit(id, status) {
            if (!id) {
                this.addDialogShow = true
                // 恢复默认值
                for (let key in this.addForm) {
                    this.addForm[key] = ''
                }
                return
            }

            this.ajax.post(this.url.detail, { id }, (res) => {
                this.addDialogShow = true
                this.addForm = {
                    id,
                    ...res
                }
            })
        },
        onValidate() {
            for (let key in this.addForm) {
                if (!this.addForm[key]) {
                    this.$message({
                        type: 'error',
                        message: '表单填写不完整，请检查！'
                    })
                    return false
                }
            }
            return true
        },
        onSave() {
            if (!this.onValidate()) {
                return
            }

            let params = {
                ...this.addForm
            }

            if (!this.addForm.id) {
                Reflect.deleteProperty(params, 'id')
            }

            this.ajax.post(this.url.add, params, (res) => {
                this.addDialogShow = false
                this.$message({
                    type: 'success',
                    message: '保存成功！'
                })
                this.renderGrid()
            })
        },
        onPageChange(curPage) {
            this.search.start = (curPage - 1) * this.search.size
            this.onSearch()
        }
    }
}
</script>
<style lang="scss">
.addForm {
    .group-content {
        display: inline-block;
        border: 1px solid #ddd;
        p {
            margin: 0px;
            line-height: 30px;
            border-bottom: 1px solid #ddd;
        }
        i {
            display: inline-block;
            margin-left: 10px;
            width: 16px;
        }
        textarea {
            overflow: hidden;
            border: 0 none!important;
        }
    }
}
</style>
