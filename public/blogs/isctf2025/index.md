# MISC

### 小蓝鲨的神秘文件

下载解压出一个叫`ChsPinyinUDL.dat`<font style="color:rgb(51, 51, 51);">的文件</font>

<font style="color:rgb(51, 51, 51);">直接谷歌搜索可以得知是微软拼音的</font>**<font style="color:rgb(51, 51, 51);">自学习词库文件</font>**

> 在`C:\Users\username\AppData\Roaming\Microsoft\InputMethod\Chs`下有两个`ChsPinyinUDL.dat 和 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">ChsPinyinIH.dat</font>`文件里面有记录词频信息。

<font style="color:rgb(119, 119, 119);">依据上述基于数据流的逆向测试策略，对两个 DAT 用户词库文件进行结构分析，发现 ChsPinyinlH 和 ChsPiny­in­UDL 两个 DAT 文件存储的输入记录信息数据起始位置分别是在文件偏移地址 0x1400 处和 0x2400 处，每条用户输入记录信息的存储长度都是固定的，占用 60 个字节。</font>

结构如下

![](https://md-img.serverrlrow.workers.dev/img/1765028107344-00e64ba0-f782-4c15-a1b7-a554ff8922ca.png)<font style="color:rgb(51, 51, 51);">chsPinyinIH结构.jpg</font>

![](https://md-img.serverrlrow.workers.dev/img/1765028107723-65d6ac9c-5edf-4958-96ae-07df82d522ba.png)<font style="color:rgb(51, 51, 51);">ChsPinyinUDL结构.jpg</font>

<font style="color:rgb(51, 51, 51);">利用 </font>[<font style="color:rgb(65, 131, 196);">微软拼音自学习词库的导入导出算法</font>](https://github.com/studyzy/imewlconverter/issues/58)<font style="color:rgb(51, 51, 51);">中 @HowcanoeWang 的</font>[<font style="color:rgb(65, 131, 196);">脚本</font>](https://github.com/studyzy/imewlconverter/files/4365598/pinyin.zip)<font style="color:rgb(51, 51, 51);">，就能获得输入记录。</font>

<font style="color:rgb(51, 51, 51);">运行脚本得到</font>

> <font style="color:rgb(119, 119, 119);">帮我优化这段代码	bang wo you hua zhe duan dai ma	1不要乱动我的代码	bu yao luan dong wo de dai ma	1不要动我原来的代码	bu yao dong wo yuan lai de dai ma	1出题人说弗莱格在官网	chu ti ren shuo fu lai ge zai guan wang	1出题人说弗莱格在那里	chu ti ren shuo fu lai ge zai na li	1官网的新闻里	guan wang de xin wen li	1弗莱格	fu lai ge	1还有一些项目合作的机会	hai you yi xie xiang mu he zuo de ji hui	1福州蓝鲨信息技术有限公司	fu zhou lan sha xin xi ji shu you xian gong si	1机会是留给有准备的人	ji hui shi liu gei you zhun bei de ren	1看看官网的新闻吧	kan kan guan wang de xin wen ba	1你把简历投了再说	ni ba jian li tou le zai shuo	1你去看看新闻动态呢	ni qu kan kan xin wen dong tai ne	1你去找辅导员问问	ni qu zhao fu dao yuan wen wen	1你去蓝鲨官网看看呗	ni qu lan sha guan wang kan kan bei	1你这个脚本跑不了啊	ni zhe ge jiao ben pao bu liao a	1他们招实习的	ta men zhao shi xi de	1这次比赛你参加了吗	zhe ci bi sai ni can jia le ma	1真的可以去试试	zhen de ke yi qu shi shi	1在我原来的基础上修改	zai wo yuan lai de ji chu shang xiu gai	1</font>

<font style="color:rgb(51, 51, 51);">在小蓝鲨官网可以找到flag</font>

### 冲刺！偷摸零！

<font style="color:rgb(51, 51, 51);">下载下来是个jar包,可以直接运行,是个小游戏</font>

<font style="color:rgb(51, 51, 51);">用</font>`jadx-gui`<font style="color:rgb(51, 51, 51);">打开文件</font>

![](https://md-img.serverrlrow.workers.dev/img/1765028107916-cd4eb3e9-7ed4-4c0d-b3d6-c292488d29c1.png)

<font style="color:rgb(51, 51, 51);">一上来就有个</font>`ctf.db`<font style="color:rgb(51, 51, 51);">肯定不对劲</font>

<font style="color:rgb(51, 51, 51);">浏览整个文件可以发现很多</font>**<font style="color:rgb(51, 51, 51);">假flag</font>**<font style="color:rgb(51, 51, 51);">,实际上根据题意有</font>**<font style="color:rgb(51, 51, 51);">两段</font>**<font style="color:rgb(51, 51, 51);">,</font>

<font style="color:rgb(51, 51, 51);">所以可以确定</font>`PART1:ISCTF{Tom0R1_Dash`是第一段

![](https://md-img.serverrlrow.workers.dev/img/1765028107961-12b15d3e-af57-47e2-b2a4-a1b20dce1535.png)

<font style="color:rgb(51, 51, 51);">接下来根据游戏故意输了后的文字,</font>

<font style="color:rgb(51, 51, 51);">先打开源代码下的</font>`GameOverView`

![](https://md-img.serverrlrow.workers.dev/img/1765028108276-19417e94-76b8-48ce-9ead-0a0697dc7d3a.png)

<font style="color:rgb(51, 51, 51);">可以发现一段进行异或的数据</font>

```python
#加密数组
encrypted = [5, 20, 7, 1, 103, 111, 10, 18, 32, 18, 32, 10, 18, 20, 18, 20, 116, 116, 40]
#密钥
key = 85

#解密并拼接为字符串
result = "".join([chr(b ^ key) for b in encrypted])
print(result)
```

<font style="color:rgb(51, 51, 51);">得到第二段flag</font>

### 怎么这也能掉链子

<font style="color:rgb(51, 51, 51);">vmdk文件下载下来很小,才500kb,直接Gemini秒了</font>



> 文件系统分析
> <font style="color:rgb(119, 119, 119);">这个 VMDK 文件实际上包含了一个 </font>**<font style="color:rgb(119, 119, 119);">FAT32</font>**<font style="color:rgb(119, 119, 119);"> 文件系统。通过分析文件内容，我发现了两个非常关键的信息点：一段疑似密码的字符串和一个被隐藏/删除的图片文件。</font>
> <font style="color:rgb(119, 119, 119);">2. 关键线索发现</font>
> <font style="color:rgb(119, 119, 119);">线索 A：隐藏的字符串 (可能的密码)</font>
> <font style="color:rgb(119, 119, 119);">在文件偏移量较后的位置（Source 10118 附近），有一段明显的提示文字。这段文字是以宽字符（中间有空格/00字节）形式存在的：</font>
> <font style="color:rgb(119, 119, 119);"> o h y o u f i n d i t : E W N V T { R @ X 3 2 _ n a n x 5 d 5 p i x }</font>
> + **<font style="color:rgb(119, 119, 119);">提取内容：</font>**`oh you find it : EWNVT{R@X32_nanx5d5pix}`
> + **<font style="color:rgb(119, 119, 119);">分析：</font>**<font style="color:rgb(119, 119, 119);"> 这段文字的格式非常像 Flag，但结合题目提到的工具“静谧之眼”，这更可能是</font>**<font style="color:rgb(119, 119, 119);">Silent Eye 的解密密码（Passphrase）</font>**<font style="color:rgb(119, 119, 119);">。</font>
> <font style="color:rgb(119, 119, 119);">线索 B：被删除/隐藏的图片</font>
> <font style="color:rgb(119, 119, 119);">在文件系统的目录项区域（Source 10729 附近），发现了一个文件名为 </font>`THIS_IS_FLAG.JPG</font>`<font style="color:rgb(119, 119, 119);"> 的记录（短文件名显示为 </font>`THIS_I~1JPG`<font style="color:rgb(119, 119, 119);">）。</font>
> <font style="color:rgb(119, 119, 119);">紧接着在 Source 10769 处，可以看到 JPEG 图片的典型文件头：</font>
> `ÿØÿà JFIF`<font style="color:rgb(119, 119, 119);"> (对应十六进制 </font>`FF D8 FF E0`<font style="color:rgb(119, 119, 119);">)</font>
> <font style="color:rgb(119, 119, 119);">图片数据一直持续到 Source 10832 处的 JPEG 文件尾：</font>
> `ÿÙ`<font style="color:rgb(119, 119, 119);"> (对应十六进制 </font>`FF D9`<font style="color:rgb(119, 119, 119);">)</font>

<font style="color:rgb(51, 51, 51);">010打开分出来图片</font>![](https://md-img.serverrlrow.workers.dev/img/1765028108208-bb74ee56-ad2b-4ce1-8178-efdbf3510c45.png)

~~<font style="color:rgb(51, 51, 51);">n1tro的神秘大头</font>~~

<font style="color:rgb(51, 51, 51);">结合题意静谧之眼,可以知道是</font>`silenteye`

<font style="color:rgb(51, 51, 51);">拖进去打开我直接把EWNVT{R@X32_nanx5d5pix}当密钥了,笑死</font>

<font style="color:rgb(51, 51, 51);">问了下出题人,给了提示</font>

<font style="color:rgb(119, 119, 119);">没有改变过Passphrase</font>

<font style="color:rgb(51, 51, 51);">那就是默认密码,然后</font>`Header position`<font style="color:rgb(51, 51, 51);">设为top</font>

<font style="color:rgb(51, 51, 51);">得到</font>`welcomeisctf`<font style="color:rgb(51, 51, 51);">,让ai先猜出前面找到的字符串类似凯撒密码</font>

<font style="color:rgb(51, 51, 51);">现在又得到串新的,应该就是维吉尼亚加密的key</font>

<font style="color:rgb(51, 51, 51);">随波里填入key,解密得到flag</font>

### 消失的flag

一开始都死活连不上,没有任何回显

题目下架又上来后,才有了error回显

> <font style="color:rgb(227, 227, 227);background-color:rgb(40, 42, 44);">SSH-2.0-OpenSSH_8.6^M$</font>
>
> <font style="color:rgb(227, 227, 227);background-color:rgb(40, 42, 44);">Invalid SSH identification string.^M$</font>

然后

```bash
ssh qyy@challenge.bluesharkinfo.com -p 29145
```

回显

---

 |_ _/ __**| / **__**|_   _|  **__**|  
**__**  | |**__**_**__** **__**|**__** |     | | | |**__**  
**__**  | | **__**) | |**__**  | | |  **__**|  
**__** |**__**|**__/ ______| |_| |_|

Connection to challenge.bluesharkinfo.com closed.

问了下ai应该是" 用了特殊的颜色代码隐藏起来了  "

```bash
ssh qyy@challenge.bluesharkinfo.com -p 29145 | cat -A
```

![](https://md-img.serverrlrow.workers.dev/img/1765029007706-3e740f61-bd31-4cc5-95fd-70c807800c35.jpeg)

这个时候才显示出来

### Abnormal log

ai秒了

> ###分析过程
>
> 1. **数据碎片识别**： 日志中包含大量的 `[INFO] Attacker uploading segment X...` 和对应的 `[INFO] File data segment: <Hex String>`。这表明攻击者将一个文件切分成了 **116** 个段进行上传。 由于日志是乱序的（例如 Segment 1 后面可能紧跟着 Segment 30 的日志），我们需要根据 `segment ID` 对数据进行重新排序。
> 2. **加密/混淆分析**： 让我们观察 **Segment 1** 的数据： `327fb9aa22190501dfbff187e8080505...`
>
> 如果这只是单纯的二进制文件，我们通常会查看文件头（Magic Bytes）。常见的文件头如下：
>
>     - Zip: `50 4B 03 04`
>     - PNG: `89 50 4E 47`
>     - 7z: `37 7A BC AF`
>
> 对比 Segment 1 的开头 `32 7f b9 aa` 和 7z 的文件头 `37 7a bc af`，你会发现它们之间存在一个简单的 **异或 (XOR)** 关系：
>
>     - `0x32` XOR `0x05` = `0x37` ('7')
>     - `0x7f` XOR `0x05` = `0x7a` ('z')
>     - `0xb9` XOR `0x05` = `0xbc`
>     - `0xaa` XOR `0x05` = `0xaf`
>
> **结论**：攻击者上传的是一个 **7z 压缩包**，并且对所有字节进行了 **0x05 的异或加密**。
>
> ###解决方案
>
> 我为你编写了一个 Python 脚本，它可以自动完成以下工作：
>
> 1. 解析日志，提取所有数据段。
> 2. 按 Segment ID (1-116) 正确排序。
> 3. 将十六进制转换为字节。
> 4. 利用 `0x05` 密钥解密数据。
> 5. 生成最终的 `flag.7z` 文件。

```python
import re

def solve_ctf():
    log_file = "access.log"
    output_file = "flag.7z"
    xor_key = 0x05

    #用于存储段数据的字典 {id: hex_data}
    segments = {}
    
    current_seg_id = -1
    
    try:
        with open(log_file, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        for line in lines:
            #1. 捕捉段 ID (例如: Attacker uploading segment 1...)
            seg_match = re.search(r'Attacker uploading segment (\d+)', line)
            if seg_match:
                current_seg_id = int(seg_match.group(1))
                continue

            #2. 捕捉对应的数据 (例如: File data segment: 327fb9aa...)
            #逻辑：数据行通常紧跟在段声明行所在的块中
            data_match = re.search(r'File data segment: ([0-9a-fA-F]+)', line)
            if data_match and current_seg_id != -1:
                segments[current_seg_id] = data_match.group(1)
                #重置 ID 以防止数据错位（虽然此日志结构比较简单，但这更安全）
                current_seg_id = -1

        print(f"[+] 提取到 {len(segments)} 个数据段。")

        #3. 按顺序重组并解密
        full_hex = ""
        #检查是否找齐了所有段 (1 到 116)
        sorted_keys = sorted(segments.keys())
        if not sorted_keys:
            print("[-] 未找到任何数据段，请检查日志文件内容。")
            return

        print(f"[+] 段 ID 范围: {min(sorted_keys)} - {max(sorted_keys)}")

        final_bytes = bytearray()
        
        for i in sorted_keys:
            hex_str = segments[i]
            #将 Hex 转为 byte 数组
            chunk_bytes = bytes.fromhex(hex_str)
            #4. XOR 解密
            for b in chunk_bytes:
                final_bytes.append(b ^ xor_key)

        #5. 写入文件
        with open(output_file, "wb") as f:
            f.write(final_bytes)
            
        print(f"[+] 成功！文件已保存为: {output_file}")
        print("[+] 请解压该 7z 文件以获取 flag。")
        
        #验证一下文件头是否为 7z (37 7A BC AF)
        if final_bytes[:4] == b'\x37\x7a\xbc\xaf':
            print("[+] 文件头检测正确：检测到 7z 归档格式。")
        else:
            print("[-] 警告：文件头看起来不是 7z，可能需要检查异或密钥。")

    except FileNotFoundError:
        print(f"[-] 找不到文件 {log_file}，请确保脚本和日志在同一目录下。")

if __name__ == "__main__":
    solve_ctf()
```

### 小蓝鲨的千层FLAG

很简单的一个嵌套

写个脚本

```python
import pyzipper  #必须先安装: pip install pyzipper
import re
import os
import sys


def unzip_nested(start_filename):
    current_file = start_filename

    print(f"[*] 开始从 {current_file} 解压...")

    while True:
        try:
            #修改点】使用 pyzipper.AESZipFile 替代 zipfile.ZipFile
            #它可以处理 AES 加密和传统加密
            with pyzipper.AESZipFile(current_file, 'r') as zf:
                #1. 获取注释
                #有些时候注释可能是 None，做个防错处理
                if zf.comment:
                    comment = zf.comment.decode('utf-8', errors='ignore')
                else:
                    comment = ""

                #2. 如果没有注释，可能已经解压完了
                if not comment:
                    print(f"\n[+] 结束: 文件 {current_file} 没有注释。")
                    print("检查该文件内容，Flag 可能就在其中！")
                    break

                #3. 正则提取密码
                match = re.search(r'The password is\s+([^\s]+)', comment)

                if match:
                    password = match.group(1)
                    print(f"[-] 文件: {current_file} | 密码: {password}")

                    #4. 解压文件
                    #setpassword 可以处理 AES 密码
                    zf.setpassword(password.encode('utf-8'))
                    zf.extractall()

                    #5. 更新下一次的文件名
                    #获取压缩包内第一个文件的名字
                    next_file = zf.namelist()[0]
                    current_file = next_file
                else:
                    print(f"\n[!] 停止: 在 {current_file} 的注释中未找到密码模式。")
                    print(f"注释内容: {comment}")
                    break

        except RuntimeError as e:
            #捕获具体的解压密码错误
            if 'Bad password' in str(e):
                print(f"[x] 密码错误: {password}")
                break
            else:
                print(f"[x] 运行时错误: {e}")
                break
        except Exception as e:
            print(f"[x] 发生错误: {e}")
            break


if __name__ == "__main__":
    start_file = "flagggg999.zip"

    #切换到脚本所在目录，防止路径错误
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    if os.path.exists(start_file):
        unzip_nested(start_file)
    else:
        print(f"错误: 当前目录下未找到 {start_file}")
```

直到flagggg3.zip

打开发现里面是flagggg.zip

很明显是明文攻击![](https://md-img.serverrlrow.workers.dev/img/1765029637319-4e986ac5-e490-4c08-9720-b04fbfbe7d92.jpeg)

可以猜测2里面是flagggg1.zip,由zip特性,这段是flagggg2内一段明文

再加上zip的文件头504b0302,直接开始bkcrack爆破

得到密钥解密flaggg3

### Image_is_all_you_need

Gemini太强大了🖐️😭🤚

https://gemini.google.com/share/d90753b7c4a0

### 小蓝鲨的周年庆礼物

010打开`这里没有flag`全是混乱的数据,这个时候看一眼文件大小,ok固定10mb

没有特征就是最大的特征,很典型的VC加密容器

直接Vera crypt挂载,旁边的图片就作为密钥

打开文件,拖入随波发现有零宽隐写

按照出现了哪些零宽字符来解密,得到flag





# 应急

## hacker

wireshark打开之后直接协议分级,按分组排序,一个一个尝试交

## 奇怪的shell文件

解压之后,火绒直接报毒,找到shell文件,

由 代码中有一行注释：`//该密钥为连接密码32位md5值的前16位`

和

```php
$post=file_get_contents("php://input");
```

可以知道是冰蝎3

# 病毒分析

参考文章:

+ [清夜无尘の一方天地 | MSI TRANSFORMS技术分析](https://wander1ng.com/post/msi-transforms%E6%8A%80%E6%9C%AF%E5%88%86%E6%9E%90/)
+ [MSI Shenanigans. Part 1 – Offensive Capabilities Overview – mgeeky’s lair](https://mgeeky.tech/msi-shenanigans-part-1/)
+ [MSI文件滥用新趋势：新海莲花组织首度利用MST文件投递特马](https://ti.qianxin.com/blog/articles/new%20-trend-in-msi-file-abuse-new-oceanlotus-group-first-to-use-mst-files-to-deliver-special-trojan-cn/)

先让ai和云沙箱分析下

![](https://md-img.serverrlrow.workers.dev/img/1765098397456-4c936a23-2d70-450f-befc-c06133e4d123.jpeg)

> ### 样本概览与关联分析
>
> 你提供的三个文件看起来是一个攻击链的不同部分：
>
> 1. `**ISCTF基础规则说明文档.pdf.lnk**`: 这是一个 Windows 快捷方式文件 (LNK)。
> 2. `**fR6Wl**`: 一个 PE 格式的可执行文件（根据 `!This program cannot be run in DOS mode` 和 Zoom 签名判断）。
> 3. `**TJe1w**`: 一个包含大量安装程序表结构（MSI Database）数据的二进制文件。
>
> **推测的攻击逻辑：** 通常海莲花的攻击链如下： `LNK 快捷方式` -> `解压/释放文件` -> `运行合法的白文件 (fR6Wl)` -> `白文件加载恶意的 DLL (通常在同目录下)` -> `恶意 DLL 读取加密的 Payload` -> `内存加载 Shellcode`。

### 模仿的APT组织中文代号为

海莲花

### 第一阶段载荷中的入口文件全名为

**<font style="color:rgb(38, 38, 38);background-color:rgba(0, 0, 0, 0.06);">ISCTF基础规则说明文档.pdf.lnk</font>**

### 第一阶段中使用了一个带有数字签名的文件（非系统文件），其中签名者名称为

> #### `TJe1w` (Source 2226-2466)
>
> + **文件识别**: 这是一个 **Windows PE 文件** (DLL 或 EXE)。
> + **关键字符串**:
>     - `Zoom Remote Control Installer`
>     - `Zoom Video Communications, Inc.`
>     - `zRC.dll`, `zRCAppCore.dll`, `zNet.dll`
>     - `DigiCert Trusted Root G4` (数字签名信息)
> + **分析结论**: 这是一个 **合法的、带有数字签名的 Zoom 组件**。



很显然<font style="color:rgb(38, 38, 38);background-color:rgba(0, 0, 0, 0.06);">Zoom Video Communications, Inc.</font>

### 第一阶段中恶意载荷释放的文件名分别为（提交三次，每次一个文件名）

直接分析**<font style="color:rgb(38, 38, 38);background-color:rgba(0, 0, 0, 0.06);">fR6Wl</font>**

在网络上上搜索msi文件分析,可以先简单用7z解压



![](https://md-img.serverrlrow.workers.dev/img/1765100306392-7d6cca69-2d1f-4225-86d8-bf0b5fbad063.jpeg)

找到二进制文件binary.ztool

用ida-pro打开,启动mcp服务让ai分析![](https://md-img.serverrlrow.workers.dev/img/1765100449990-bd953a48-dd54-461b-b180-a7f9bd290be3.jpeg)

找到两个,第三个让re手找到是Isctf2025.pdf

### 第二阶段使用了一种常见的白加黑技巧，其中黑文件名为

三个都提交了看看,结果是\\ZoomRemoteControl\\bin\\zRCAppCore.dll

### 第二阶段对下一阶段载荷进行了简单的保护，保护使用的算法为

![](https://md-img.serverrlrow.workers.dev/img/1765100820272-2740430c-266b-488e-bbe5-7522c8e65663.jpeg)

就是异或,密钥也找到了但提交不对





# Reverse

[https://share.note.youdao.com/s/Z5BGNBru](https://share.note.youdao.com/s/Z5BGNBru)