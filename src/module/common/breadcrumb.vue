<template>
    <div class="breadcrumb">
        <span v-for="(item, i) in breadNames" :key="i">{{ item }}<i class="part" v-if="i !== breadNames.length-1">&gt;</i></span>
    </div>
</template>
<script>
export default {
    name: 'breadcrumb',
    computed: {
        breadNames() {
            let menuList = this.$store.state.menuList
            let curPath = this.util.routePath(this.$route)
            let breadNames = []

            // 通过当前路由path获取一二三级菜单名
            menuList.some(function(item1) {
                if (curPath === item1.path) {
                    breadNames.push(item1.title)
                    return true
                }

                let child1 = item1.children || []
                child1.some(function(item2) {
                    if (curPath === item2.path) {
                        breadNames.push(item1.title, item2.title)
                        return true
                    }

                    let child2 = item2.children || []
                    child2.some(function(item3) {
                        if (curPath === item3.path) {
                            breadNames.push(item1.title, item2.title, item3.title)
                            return true
                        }
                    })

                    if (breadNames.length) {
                        return true
                    }
                })

                if (breadNames.length) {
                    return true
                }
            })

            return breadNames
        }
    }
}
</script>
<style lang="scss">
.breadcrumb {
    padding: 8px 15px;
    margin-bottom: 20px;
    list-style: none;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-size: 14px;
    .part {
        margin: 0 6px;
        font-style: normal;
    }
}
</style>
