<template>
    <el-cascader ref="cascader" :options="distData" :props="props" :value="distValue" @active-item-change="onProvinceChange" @change="onSelectChange" clearable class="distPicker"></el-cascader>
</template>
<script>
export default {
    name: 'distPicker',
    mounted() {
        this.initProvince()
    },
    props: {
        distValue: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            stack: {
                cities: []
            },
            distData: [],
            props: {
                label: 'name',
                value: 'code',
                children: 'cities'
            },
            // 最终返回选择的数据
            selected: {
                province: {
                    code: '',
                    name: ''
                },
                city: {
                    code: '',
                    name: ''
                }
            }
        }
    },
    methods: {
        initProvince() {
            this.ajax.post('/common/provinces', {}, (res) => {
                this.distData = res.map(item => {
                    return {
                        name: item.province,
                        code: item.code,
                        cities: []
                    }
                })

                // 需求回显城市
                if (this.distValue.length > 1) {
                    this.onProvinceChange([this.distValue[0]])
                }
            })
        },
        onProvinceChange(value) {
            let provinceCode = value[0]
            this.ajax.post('/common/citys', { provinceCode }, (res) => {
                this.distData.some((item1, index) => {
                    if (item1.code === provinceCode) {
                        // 保存当前省份数据
                        this.selected.province = {
                            code: item1.code,
                            name: item1.name
                        }

                        // 找出当前省份下的城市
                        item1.cities = res.map(item2 => {
                            return {
                                code: item2.code,
                                name: item2.city
                            }
                        })

                        // 保存当前省份的所有城市，方便后面查找
                        this.stack.cities = item1.cities.slice()
                        return true
                    }
                })
            })
        },
        onSelectChange(values) {
            let cityCode = values[1]

            // 根据code从当前所有省份城市中找出选择的城市完整信息
            this.stack.cities.some(item => {
                if (item.code === cityCode) {
                    this.selected.city = {
                        code: item.code,
                        name: item.name
                    }
                    return true
                }
            })

            // 发送数据给事件回调
            this.$emit('onDistPick', this.selected)
        }
    }
}
</script>
<style lang="scss">
.distPicker {
    display: inline-block;
    .el-input {
        width: 280px;
    }
}
</style>
