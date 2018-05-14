<template>
    <div class="page">
        <div class="row toolbar">
            <label>用户ID：</label>
            <el-input type="text" clearable v-model="search.id" class="mr10" placeholder="请输入用户ID"></el-input>
            <label>用户昵称：</label>
            <el-input type="text" clearable v-model="search.nickname" class="mr10" placeholder="请输入用户昵称"></el-input>
            <el-button type="warning" @click="onSearch">查询</el-button>
        </div>
        <el-table :data="gridData" :fit="true" stripe>
            <el-table-column prop="headpic" label="用户头像" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.headpic" width="40" height="40" />
                </template>
            </el-table-column>
            <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
            <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
            <el-table-column prop="friendNum" label="好友数量" align="center"></el-table-column>
            <el-table-column prop="groupNum" label="群聊数量" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.groupNum === '0'">{{ scope.row.groupNum }}</div>
                    <div v-else>
                        <el-button type="text" @click="toDetail(scope.row.id)">{{ scope.row.groupNum }}</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagerout" v-if="search.total">
            <el-pagination layout="total, prev, pager, next, jumper" :page-size="search.size" :total="search.total" @current-change="onPageChange"></el-pagination>
        </div>
        <!-- 群聊明细 -->
        <el-dialog title="群聊明细" :visible.sync="detailShow">
            <el-table :data="detailData">
                <el-table-column prop="groupName" label="群名" align="center"></el-table-column>
                <el-table-column prop="groupId" label="群ID" align="center"></el-table-column>
                <el-table-column prop="memberNum" label="群成员数量" align="center"></el-table-column>
            </el-table>
            <div class="pagerout" v-if="detailParam.total">
                <el-pagination layout="total, prev, pager, next, jumper" :page-size="detailParam.size" :total="detailParam.total" @current-change="onDetailPageChange"></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'chatList',
    mounted() {
        // 初始化
        this.onSearch()
    },
    data() {
        return {
            url: {
                list: '/api/account/list',
                detail: '/api/group/accountGroups',
                num: '/api/account/getNum'
            },
            search: {
                nickname: '',
                id: '',
                total: 0,
                start: 0,
                size: 20
            },
            detailParam: {
                accountId: '',
                total: 0,
                start: 0,
                size: 10
            },
            gridData: [],
            detailData: [],
            detailShow: false
        }
    },
    methods: {
        onSearch() {
            this.ajax.post(this.url.list, this.search, (res) => {
                this.gridData = res.list || []
                this.search.total = ~~res.total
            })
        },
        toDetail(id) {
            this.detailParam.accountId = id
            this.toDetailShow()
        },
        toDetailShow() {
            this.detailShow = true
            this.ajax.post(this.url.detail, this.detailParam, (res) => {
                this.detailData = res.list
                this.detailParam.total = ~~res.total
            })
        },
        // 列表分页
        onPageChange(curPage) {
            this.search.start = (curPage - 1) * this.search.size
            this.onSearch()
        },
        // 群聊明细分页
        onDetailPageChange(curPage) {
            this.detailParam.start = (curPage - 1) * this.detailParam.size
            this.toDetailShow()
        }
    }
}
</script>
