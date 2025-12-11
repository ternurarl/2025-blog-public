# 1.
来到现场后，通过上机初步检查，细心的你发现了一些线索，请分析一下攻击者IP 地址和入侵时间。
flag{IP DD/MM/YYYY}

桌面上有一个瑞友天翼控制台,可以检查瑞友天翼的日志![PixPin_2025-12-09_16-26-21](https://md-img.serverrlrow.workers.dev/img/20251209171624839.jpg)

可以结合桌面上的勒索文件的修改时间来确定读哪些日志

![PixPin_2025-12-09_16-33-50](https://md-img.serverrlrow.workers.dev/img/20251209171642478.jpg)

注意到这里sql注入了条,传了个webshell

```
flag{192.168.56.128 21/04/2025}
```

# 2.
在溯源的过程中，现场的运维告诉你，服务器不知道为什么多了个浏览器，并且这段时间服务器的流量有些异常，你决定一探究竟找找攻击者做了什么，配置了什么东西？

格式：flag{一大串字母}

由题意多了个浏览器,而桌面上有个edge的安装包,直接打开edge,在下载界面这里下载了东西,进去看看

![PixPin_2025-12-09_16-36-03](https://md-img.serverrlrow.workers.dev/img/20251209171656344.jpg)

是个用来挂载网盘的工具,结合题目说的流量异常，很大可能为攻击者用来窃取数据用的![PixPin_2025-12-09_16-37-06](https://md-img.serverrlrow.workers.dev/img/20251209171702437.jpg)

继续跟进这工具![PixPin_2025-12-09_16-39-15](https://md-img.serverrlrow.workers.dev/img/20251209172532902.jpg)

显然有一个conf配置文件,在appdata下找到



![PixPin_2025-12-09_15-55-12](https://md-img.serverrlrow.workers.dev/img/20251209171732327.jpg)

# 3.
现场的运维说软件的某个跳转地址被恶意的修改了，但是却不知道啥时候被修改的，请你找到文件（C:\Program Files (x86)\RealFriend\Rap Server\WebRoot\casweb\Home\View\Index\index.html ） 最后被动手脚的时间

可以用autospy分析,我这里图方便直接用luxe了![PixPin_2025-12-09_16-13-11](https://md-img.serverrlrow.workers.dev/img/20251209172532903.jpg)

然后luxe显示的是UTC-0时间,做国内题还得+8小时,秒数可能不准,前后几秒多试试

# 4.
一顿分析后，你决定掏出你的Windows安全加固手册对服务器做一次全面的排查，果然你发现了攻击者漏出的鸡脚(四只)
flag格式为：flag{part1+part2+part3+part4}

通过排查启动项、计划任务、账号排查、系统服务分别获得flag片段，最终组成完整的flag

* 计划任务

    ![PixPin_2025-12-09_16-46-32](https://md-img.serverrlrow.workers.dev/img/20251209172459311.jpg)

名字叫win更新还打开个ps1文件,

![PixPin_2025-12-09_16-48-09](https://md-img.serverrlrow.workers.dev/img/20251209172532904.jpg)

* 系统服务

输入msconfig，检查系统配置中的服务，勾选隐藏所有Microsoft后，发现可疑系统服务Windows Network Sync

<img src="https://md-img.serverrlrow.workers.dev/img/20251209172532905.jpg" alt="PixPin_2025-12-09_16-50-08" style="zoom:50%;" />

打开服务查看![PixPin_2025-12-09_16-51-28](https://md-img.serverrlrow.workers.dev/img/20251209172532906.jpg)

* 账户排查

    计算机管理-本地用户和组-用户

    ![PixPin_2025-12-09_16-54-09](https://md-img.serverrlrow.workers.dev/img/20251209172532908.jpg)

* 可疑进程

    打开任务管理器,查看详细信息,先看administrator管理员账户启动的程序![PixPin_2025-12-09_16-57-38](https://md-img.serverrlrow.workers.dev/img/20251209172532909.jpg)

直接找到

```
flag{zheshiyigenixiangbudaodeflag}
```

# 5.
轻轻松松的加固后，你需要写一份溯源分析报告，但是缺少了加密电脑文件的凶手(某加密程序)，这份报告客户是不会感到满意的，请你想方法让客户认可这份报告吧

flag格式为：flag{名称}

通过题目提示知道要找的是加密程序

在真实的应急响应中，寻找加密器主要通过

* 加密文件的修改时间、

* 加密器常见路径(启动项，music，temp，users等目录下)、

* 常见的加密器名称等线索排查加密器

    在这里我们可以上传一个everything方便查找，时间倒序,可以看到一个名为Encryptor123的程序，很明显这就是我们要找的目标

![PixPin_2025-12-09_17-04-11](https://md-img.serverrlrow.workers.dev/img/20251209172532910.jpg)

