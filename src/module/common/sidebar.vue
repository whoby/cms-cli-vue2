<template>
    <aside>
        <el-menu :router="true" :default-active="$route.fullPath" :default-openeds="defaultOpends">
            <div v-for="(item1, i) in sideMenu" :key="i">
                <el-menu-item :index="item1.path" v-if="!(item1.children && item1.children.length)" :class="(item1.path == util.routePath($route) ? 'is-active' : '')">{{ item1.title }}</el-menu-item>
                <el-submenu :index="item1.path" v-if="item1.children && item1.children.length">
                    <template slot="title">{{ item1.title }}</template>
                    <el-menu-item v-for="(item2, j) in item1.children" :key="j" :index="item2.path" :class="(item2.path == util.routePath($route) ? 'is-active' : '')">{{ item2.title }}</el-menu-item>
                </el-submenu>
            </div>
        </el-menu>
    </aside>
</template>
<script>
export default {
    name: 'sidebar',
    data() {
        return {
            defaultOpends: []
        }
    },
    computed: {
        sideMenu() {
            let menuList = this.$store.state.menuList
            let curPath = this.util.routePath(this.$route)
            let sideMenu = []

            menuList.some(function(item1) {
                if (curPath.indexOf(item1.path) === 0) {
                    sideMenu = item1.children
                    return true
                }

                let child1 = item1.children || []
                child1.some(function(item2) {
                    if (curPath === item2.path) {
                        sideMenu = item1.children
                        return true
                    }

                    let child2 = item1.children || []
                    child2.some(function(item3) {
                        if (curPath === item3.path) {
                            sideMenu = item1.children
                            return true
                        }
                    })
                })
            })

            return sideMenu
        }
    }
}
</script>
<style lang="scss">
aside {
    position: fixed;
    display: block;
    top: 60px;
    bottom: 0px;
    left: 0px;
    width: 12%;
    overflow-x: hidden;
    color: #333;
    z-index: 999;
    border-right: 1px solid #ddd;
    .el-menu {
        border-right: 0 none;
        background-color: transparent;
        .el-submenu,
        .el-menu-item {
            border-bottom: 1px solid #DCDFEA;
            &:hover {
                background-color: #E4E7E8;
            }
        }
        .el-submenu {
            li:last-child {
                border-bottom: 0;
            }
        }
    }
}
</style>
