<template>
    <div class="app">
        <aym-header></aym-header>
        <div class="content">
            <aym-aside></aym-aside>
            <div class="main">
                <aym-breadcrumb></aym-breadcrumb>
                <div class="main-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import headbar from './headbar.vue'
import aside from './sidebar.vue'
import breadcrumb from './breadcrumb.vue'
export default {
    name: 'viewport',
    components: {
        'aym-header': headbar,
        'aym-aside': aside,
        'aym-breadcrumb': breadcrumb
    }
}
</script>
<style>
body {
    background-color: #fff!important;
}

.app {
    background-color: #fff;
}

.content {
    display: table;
    margin-top: 60px;
    padding: 0;
    width: 100%;
}

.main {
    padding: 20px;
    background-color: #fff;
    width: 88%;
    margin-left: 12%;
}

.main-content {
    padding: 0 20px 20px;
}
</style>
