# C-budejie
一个类似百思不得姐的微信小程序


### 介绍
1. 数据存储方案使用的是 [leancloud](https://leancloud.cn/)
2. 使用leancloud 一键登录微信小程序

### 开放api
首页 
http://api.budejie.com/api/api_open.php?a=list&c=data&type=1  
type=1 : 全部  
type=41 : 视频  
type=10 : 图片  
type=29 : 段子  
type=31 : 声音  
加载更多 : 添加两个字段  
page : 页码 (加载下一页需要)  
maxtime : 获取到的最后一条数据的maxtime字段 (加载下一页需要)  

评论列表  
http://api.budejie.com/api/api_open.php?a=dataList&c=comment&data_id=22062938&hot=1
data_id : 帖子ID  
hot : 获取到最热评论需要这个字段  
page : 页码 (加载下一页需要)  
lastcid : 获取到的最后一条评论的ID(加载下一页需要)  

推荐关注  
左侧列表 http://api.budejie.com/api/api_open.php?a=category&c=subscribe    
右侧列表 http://api.budejie.com/api/api_open.php?a=list&c=subscribe&category_id=35    
category_id : 左侧栏目 ID    
page : 当前页码 ,请求第一页数据的时候可不填    

### 功能
1. 首页左右滑动切换tab
2. 播放视频, 音频
3. 预览图片
4. 加载更多
5. 电话号码注册登录



#### 效果
<image src="/picture/GIF.gif" width="300"/>

#### 小程序码
<image src="/picture/code.jpg" width="300"/>
