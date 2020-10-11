<template>
  <div>
    <el-menu-item-group title="系统管理">
      <el-submenu index="account">
        <template slot="title">
          <i class="iconfont">&#xe613;</i>
          <span>账号管理</span>
        </template>
        <el-menu-item index="/account/index">账号列表</el-menu-item>
        <el-menu-item index="/account/add">新增账号</el-menu-item>
      </el-submenu>
      <el-submenu index="area">
        <template slot="title">
          <i class="iconfont">&#xe621;</i>
          <span>区域管理</span>
        </template>
        <el-menu-item index="/area/country">国家管理</el-menu-item>
        <el-menu-item index="/area/province">省份管理</el-menu-item>
        <el-menu-item index="/area/city">城市管理</el-menu-item>
        <el-menu-item index="/area/area">区县管理</el-menu-item>
      </el-submenu>
      <el-submenu index="system">
        <template slot="title">
          <i class="iconfont">&#xe622;</i>
          <span>系统基础管理</span>
        </template>
        <el-menu-item index="/system/index">系统参数配置</el-menu-item>
        <el-menu-item index="/system/menu/index">菜单管理</el-menu-item>
      </el-submenu>
      <el-submenu index="url">
        <template slot="title">
          <i class="iconfont">&#xe64e;</i>
          <span>短网址管理</span>
        </template>
        <el-menu-item index="/url/domain">域名管理</el-menu-item>
        <el-menu-item index="/url/short">短址管理</el-menu-item>
        <el-menu-item index="/url/dwz">短址解析</el-menu-item>
      </el-submenu>
      <el-menu-item index="/task/index">
        <i class="iconfont">&#xec35;</i>
        <span slot="title">久趣任务管理</span>
      </el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="资源管理">
      <el-submenu index="center">
        <template slot="title">
          <i class="iconfont">&#xe60e;</i>
          <span>中心管理</span>
        </template>
        <el-menu-item index="/center/index">中心列表</el-menu-item>
        <el-menu-item index="/center/add">新增中心</el-menu-item>
      </el-submenu>
      <el-submenu index="org">
        <template slot="title">
          <i class="iconfont">&#xe60e;</i>
          <span>机构管理</span>
        </template>
        <el-menu-item index="/org/index">机构列表</el-menu-item>
        <el-menu-item index="/org/add">新增机构</el-menu-item>
        <el-menu-item index="/org/registration/index">机构预报名</el-menu-item>
      </el-submenu>
      <el-submenu index="card">
        <template slot="title">
          <i class="iconfont">&#xe648;</i>
          <span>卡券管理</span>
        </template>
        <el-menu-item index="/card/index">卡券列表</el-menu-item>
        <el-menu-item index="/card/list">卡券明细</el-menu-item>
        <el-menu-item index="/card/add">新增卡券</el-menu-item>
        <el-menu-item index="/card/send">卡券发送</el-menu-item>
      </el-submenu>
      <el-submenu index="questionnaire">
        <template slot="title">
          <i class="iconfont">&#xe677;</i>
          <span>问卷管理</span>
        </template>
        <el-menu-item index="/questionnaire/header">表头管理</el-menu-item>
        <el-menu-item index="/questionnaire/topic">问题管理</el-menu-item>
        <el-menu-item index="/questionnaire/topic-item">题项管理</el-menu-item>
        <el-menu-item index="/questionnaire/feedback">反馈管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/complain/index">
        <i class="iconfont">&#xec35;</i>
        <span slot="title">建议投诉</span>
      </el-menu-item>
    </el-menu-item-group>
    <el-menu-item-group title="教研管理">
      <el-submenu index="course">
        <template slot="title">
          <i class="iconfont">&#xe60d;</i>
          <span>课程管理</span>
        </template>
        <el-menu-item index="/course/index">课程列表</el-menu-item>
        <el-menu-item index="/course/add">新增课程</el-menu-item>
      </el-submenu>
      <el-submenu index="course-package">
        <template slot="title">
          <i class="iconfont">&#xe60f;</i>
          <span>课程包管理</span>
        </template>
        <el-menu-item index="/course-package/index">课程包列表</el-menu-item>
        <el-menu-item index="/course-package/add">新增课程包</el-menu-item>
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
        <el-menu-item index="/class/audit/index">班级审核</el-menu-item>
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
    <el-menu-item-group title="文章管理">
      <el-submenu index="article">
        <template slot="title">
          <i class="iconfont">&#xe61a;</i>
          <span>文章管理</span>
        </template>
        <el-menu-item index="/article/index">文章列表</el-menu-item>
        <el-menu-item index="/article/add">新增文章</el-menu-item>
      </el-submenu>
    </el-menu-item-group>
  </div>
</template>
