<template>
  <div>
    <el-menu-item-group title="资源管理">
      <el-submenu index="card">
        <template slot="title">
          <i class="iconfont">&#xe648;</i>
          <span>卡券管理</span>
        </template>
        <el-menu-item index="/card/list">卡券明细</el-menu-item>
        <el-menu-item index="/card/send">卡券发送</el-menu-item>
      </el-submenu>
    </el-menu-item-group>
    <el-menu-item-group title="教务管理">
      <el-submenu index="student">
        <template slot="title">
          <i class="iconfont">&#xe614;</i>
          <span>学员管理</span>
        </template>
        <el-menu-item index="/student/index">学员列表</el-menu-item>
        <el-menu-item index="/student/add">新增学员</el-menu-item>
      </el-submenu>
      <el-submenu index="class">
        <template slot="title">
          <i class="iconfont">&#xe617;</i>
          <span>班级管理</span>
        </template>
        <el-menu-item index="/class/index">班级列表</el-menu-item>
        <el-menu-item index="/class/add">新增班级</el-menu-item>
      </el-submenu>
      <el-submenu index="course-plan">
        <template slot="title">
          <i class="iconfont">&#xe610;</i>
          <span>排课管理</span>
        </template>
        <el-menu-item index="/course-plan/index">排课列表</el-menu-item>
      </el-submenu>
      <el-submenu index="leave">
        <template slot="title">
          <i class="iconfont">&#xe618;</i>
          <span>放课管理</span>
        </template>
        <el-menu-item index="/leave/index">放课记录</el-menu-item>
        <el-menu-item index="/leave/add">新增放课</el-menu-item>
      </el-submenu>
    </el-menu-item-group>
  </div>
</template>
