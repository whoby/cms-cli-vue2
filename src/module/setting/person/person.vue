<template>
    <div class="page">
        <div class="row toolbar">
            <el-button type="info" @click="onEdit()">新建</el-button>
        </div>
        <el-table :data="gridData" :fit="true" stripe>
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <el-table-column prop="dept" label="所属部门" align="center"></el-table-column>
            <el-table-column prop="tel" label="手机号" align="center"></el-table-column>
            <el-table-column prop="createTime" label="新建时间" align="center"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="onEdit(scope.row.id)">编辑</el-button>
                    <el-button size="small" @click="onDel(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagerout" v-if="search.total">
            <el-pagination layout="total, prev, pager, next, jumper" :page-size="search.size" :total="search.total" @current-change="onPageChange"></el-pagination>
        </div>
        <el-dialog title="新建/编辑" :visible.sync="dialogVisible" width="500px" class="msg-single-dialog">
            <el-form :model="temp" :rules="rules" ref="dataForm" label-width="100px">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="temp.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="tel">
                    <el-input v-model="temp.tel" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="所属部门：" prop="dept">
                    <el-select v-model="temp.dept" placeholder="请选择所属部门" style="width: 190px">
                        <el-option v-for="(item, i) in deptList" :key="i" :label="item.name" :value="item.deptId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onEditSubmit">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'single',
    data() {
        return {
            url: {
                getDetail: '/api/personnel/byId',
                list: '/api/personnel/list',
                getDept: '/api/dept/list',
                del: '/api/personnel/del',
                add: '/api/personnel/add',
                edit: '/api/personnel/edit'
            },
            search: {
                total: 0,
                start: 0,
                size: 20
            },
            gridData: [],
            dialogVisible: false,
            dialogTitle: '新建',
            temp: {
                id: '',
                name: '',
                tel: '',
                dept: ''
            },
            rules: {
                name: [
                    { required: true, message: '真实姓名不能为空', trigger: 'change' },
                    { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '姓名只能输入中文和英文', trigger: 'change' }
                ],
                dept: [
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                tel: [
                    { required: true, message: '请输入手机号码', trigger: 'change' },
                    { pattern: /^\d{11}$/, message: '长度为11位的数字', trigger: 'blur' }
                ]
            },
            deptList: []
        }
    },
    mounted() {
        this.onSearch()
        this.getDepts()
    },
    methods: {
        onSearch() {
            this.ajax.post(this.url.list, this.search, (res) => {
                this.gridData = res.list || []
                this.search.total = ~~res.total
            })
        },
        onPageChange(curPage) {
            this.search.start = (curPage - 1) * this.search.size
            this.onSearch()
        },
        getDepts() {
            this.ajax.post(this.url.getDept, {}, (res) => {
                this.deptList = res.list || []
            })
        },
        onEdit(id) {
            if (this.$refs['dataForm'] !== undefined) {
                this.$refs['dataForm'].resetFields()
            }
            if (id) {
                this.ajax.post(this.url.getDetail, { id: id }, (res) => {
                    this.temp = {
                        id: res.id,
                        name: res.name,
                        dept: res.dept,
                        tel: res.tel
                    }
                })
            } else {
                this.temp = {
                    id: '',
                    name: '',
                    dept: '',
                    tel: ''
                }
            }
            this.dialogVisible = true
        },
        onDel(targetId) {
            this.$confirm('是否删除该人员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ajax.post(this.url.del, { id: targetId }, (res) => {
                    this.onSearch()
                    this.$message({
                        type: 'success',
                        message: '操作成功!',
                        showClose: true
                    })
                })
            }).catch(() => {})
        },
        onEditSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let { id, name, tel, dept } = this.temp
                    let param = {
                        id: id,
                        name: name,
                        tel: tel,
                        deptId: dept
                    }
                    let url = (id ? this.url.edit : this.url.add)
                    this.ajax.post(url, param, (res) => {
                        this.dialogVisible = false
                        this.onSearch()
                        this.$message({
                            type: 'success',
                            message: '操作成功!',
                            showClose: true
                        })
                    })
                }
            })
        }
    }
}
</script>
