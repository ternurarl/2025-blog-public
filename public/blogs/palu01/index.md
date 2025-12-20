## 1.提交堡垒机中留下的flag

标签列表

![palucup2025IR-20](https://md-img.serverrlrow.workers.dev/img/20251220220532859.png)

```
palu{2025_qiandao_flag}
```

## 2.提交WAF中隐藏的flag

身份验证->配置![palucup2025IR-21](https://md-img.serverrlrow.workers.dev/img/20251220220532860.png)

```
palu{2025_waf}
```

## 3.提交Mysql中留下的flag

从说明手册找到MySQL的登录信息`root/mysql_QPiS8y`，用Navicat连

![img](https://md-img.serverrlrow.workers.dev/img/20251220220532861.webp)

## 6.提交web服务泄露的关键文件名

在waf的防护应用下,四个服务的应用路由里找

![PixPin_2025-12-20_18-52-31](https://md-img.serverrlrow.workers.dev/img/20251220220532862.webp)

## 7.提交泄露的邮箱地址作为flag进行提交

这个细心一点在第一行末尾找到

![PixPin_2025-12-20_18-53-07](https://md-img.serverrlrow.workers.dev/img/20251220220532863.webp)

```
parloo@parloo.com
```



## 9.提交攻击者使用的提权的用户和密码

从攻击者已经拿下的sshserver进行分析：192.168.20.108 ubuntu/Skills@sshserver

查看用户信息

![PixPin_2025-12-20_19-20-17](https://md-img.serverrlrow.workers.dev/img/20251220220532865.jpg)

复制出来用[john](https://github.com/openwall/john-packages/releases)破解

```
K:\misc_tool\JtR\run> ./john.exe hash.txt
parloo           (parloo)
```

```
parloo/parloo
```

## 10.提交攻击者留下的的文件内容作为flag提交

既然攻击者创建了个账户去home看看

![PixPin_2025-12-20_19-26-40](https://md-img.serverrlrow.workers.dev/img/20251220220532866.webp)

```
palu{hi_2025_parloo_is_hack}
```

## 11.提交权限维持方法服务的名称

```
systemctl list-units --type=service --state=running
或者
systemctl list-unit-files --type=service | grep enabled
```

查看正在运行的服务

![PixPin_2025-12-20_19-54-04](https://md-img.serverrlrow.workers.dev/img/20251220220532867.webp)

把rootset两个服务都看一下,发现内容一样

```
# /etc/systemd/system/rootset.service
[Unit]
Description=rootset
ConditionFileIsExecutable=/usr/bin/b4b40c44ws
[Service]
StartLimitInterval=5
StartLimitBurst=10
ExecStart=/usr/bin/b4b40c44ws
Restart=always
RestartSec=120
EnvironmentFile=-/etc/sysconfig/rootset

[Install]
WantedBy=multi-user.target
```

一般来说文件名都是易阅读的,`/usr/bin/b4b40c44ws`这个混淆的文件可以说特征明显了

再加上`Restart=always`,可以确定是攻击者用来维持后门的

两个尝试提交下,后一个对了

```
rootset
```

## 12.提交攻击者攻击恶意服务器连接地址作为flag提交

接着上面权限维持服务的分析

把文件拖到云沙箱分析![PixPin_2025-12-20_20-11-58](https://md-img.serverrlrow.workers.dev/img/20251220220532868.jpg)

```
47.101.213.153
```

## 13.找到系统中被劫持的程序程序名作为flag提交

查看最近被修改过的程序

```
root@ubuntu:/home/parloo# ls -lt /usr/bin | head -n 10
total 162700
-rwxrwxr-x 1 ubuntu ubuntu      9800 May  8  2025 id
-rw-r--r-- 1 root   root        1767 May  7  2025 result.txt
-rwxr-xr-x 1 root   root        9848 May  7  2025 b4b40c44ws
-rwxr-xr-x 1 root   root      137816 Apr 22  2025 scp
-rwxr-xr-x 1 root   root      154280 Apr 22  2025 sftp
lrwxrwxrwx 1 root   root           3 Apr 22  2025 slogin -> ssh
-rwxr-xr-x 1 root   root      846888 Apr 22  2025 ssh
-rwxr-xr-x 1 root   root      301488 Apr 22  2025 ssh-add
-rwxr-sr-x 1 root   _ssh      309688 Apr 22  2025 ssh-agent
```

发现最近的id被修改了,尝试输入也没有反应

```
id
```

## 14.找到系统中存在信息泄露的服务运行端口作为flag提交

![img](https://md-img.serverrlrow.workers.dev/img/20251220220532869.jpg)

首先在waf界面查看上游服务器基本是server服务器

从资产手册里打开网站管理1panel

![PixPin_2025-12-20_20-34-11](https://md-img.serverrlrow.workers.dev/img/20251220220532870.jpg)

第一个103:8081进去发现两个文件![PixPin_2025-12-20_20-34-57](https://md-img.serverrlrow.workers.dev/img/20251220220532871.webp)

直接浏览器访问看看,存在信息泄露<img src="https://md-img.serverrlrow.workers.dev/img/20251220220532872.jpg" alt="PixPin_2025-12-20_20-35-40" style="zoom:50%;" />

```
8081
```

## 15.提交Parloo公司项目经理的身份证号作为flag提交

上题中的员工信息找到

```
310105198512123456
```

## 16.提交存在危险功能的操作系统路径作为flag提交

继续查看server开启的其他端口发现弱密码

![PixPin_2025-12-20_20-49-20](https://md-img.serverrlrow.workers.dev/img/20251220220532873.jpg)

继续看
在3000端口打开一个git代码平台,探索页面有个文件

![PixPin_2025-12-20_21-04-21](https://md-img.serverrlrow.workers.dev/img/20251220220532874.webp)

```
/admin/parloo
```

## 17.提交近源机器中恶意程序的MD5作为flag进行提交

根据资产手册打开palu03

![img](https://md-img.serverrlrow.workers.dev/img/20251220220532875.png)

传个火绒剑过去,分析出是未知文件

一通搜索在temp找到,显然系统程序是不会放在temp里,明显有问题![PixPin_2025-12-20_21-15-28](https://md-img.serverrlrow.workers.dev/img/20251220220532876.webp)

```
0f80a82621b8c4c3303d198d13776b34
```

## 18.提交攻击者留下的恶意账户名称md5后作为flag进行提交

明显是登陆时显示的hack

```
d78b6f30225cdc811adfe8d4e7c9fd34
```

## 19.提交内部群中留下的flag并提交

打开聊天记录![PixPin_2025-12-20_21-31-28](https://md-img.serverrlrow.workers.dev/img/20251220220532877.jpg)

```\
palu{nbq_nbq_parloo}
```

## 20.请提交攻击者使用维护页面获取到的敏感内容作为flag进行提交

进入之前的在源码里提到的维护页面http://192.168.20.102:8081/admin/parloo

我们不知道获取到的敏感内容是什么，就得查一下攻击者用过哪些命令

![img](https://md-img.serverrlrow.workers.dev/img/20251220220532878.webp)发现可能有日志记录

![PixPin_2025-12-20_21-38-19](https://md-img.serverrlrow.workers.dev/img/20251220220532879.jpg)

```
palu{Server_Parloo_2025}
```

## 21.提交获取敏感内容IP的第一次执行命令时间作为flag进行提交

从之前查看的日志可以找到,第一条命令的时间就是

```
2025-05-04 15:30:38
```

## 22.提交攻击者使用的恶意ip和端口flag格式为

从之前找到信息的地方发现黑客写了个反弹shell

![PixPin_2025-12-20_21-43-03](https://md-img.serverrlrow.workers.dev/img/20251220220532880.jpg)

```
10.12.12.13/9999
```



## 23.提交重要数据的明文内容作为flag提交

在PC3桌面找到`重要的数据.txt`，密文如下：

```
c3a1c3c13e326020c3919093e1260525045e
```

想到之前代码平台还有一个叫hack的用户,可能放了东西,于是先打开server服务器的1panel管理面板

找到gitea的容器,然后进入终端,一开始提示root用户不能改,换别的就行了

```
su git
gitea admin user change-password --username admin --password 12345678
```

这里直接改管理员的

![PixPin_2025-12-20_21-53-15](https://md-img.serverrlrow.workers.dev/img/20251220220532881.jpg)

现在直接用admin/12345678登录

<img src="https://md-img.serverrlrow.workers.dev/img/20251220220532882.webp" alt="PixPin_2025-12-20_21-59-39" style="zoom:50%;" />

此时再进入发现有了文件

让ai写个脚本,提示其明文开头可能是：palu{ 

但是在算密钥的时候太慢了，密钥长度为10位：MySecretKey

```python
def custom_decrypt(ciphertext, key):
  """根据提供的加密算法实现解密"""
    encrypted_bytes = [int(ciphertext[i:i + 2], 16) for i in range(0, len(ciphertext), 2)]
    decrypted = []
    key_bytes = [ord(c) for c in key]
    for i, byte in enumerate(encrypted_bytes):
        # 逆向替换操作：交换高4位和低4位
        unsubstituted = ((byte & 0x0F) << 4) | ((byte & 0xF0) >> 4)
        # 逆向异或操作
        xor_key = key_bytes[i % len(key_bytes)]
        unxored = unsubstituted ^ xor_key
        # 逆向位移操作
        original = unxored - (i % 5 + 1)
        # 转换回字符
        decrypted.append(chr(original))
    return ''.join(decrypted)

# 已知的密文和密钥
ciphertext = "c3a1c3c13e326020c3919093e1260525045e"
key = "MySecretKey"

decrypted_text = custom_decrypt(ciphertext, key)
print(f"使用密钥 '{key}' 解密后的明文:")
print(decrypted_text)
```

得到

```
palu{Password-000}
```



今天就写道这了......
