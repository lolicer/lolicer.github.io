---
title: "命令行版Linux通过校园网认证并SSH方案"
description: "使用香橙派联网时遇到了问题，校园网的身份认证需要打开网页，而香橙派安装的是服务器版的Linux镜像，无法使用GUI浏览器直接打开网页。"
publishDate: 2025-03-21 
tags: []
draft: false
heroImage:
    src: ./assets/mygo.avif
---

使用香橙派联网时遇到了问题，校园网的身份认证需要打开网页，而香橙派安装的是服务器版的Linux镜像，无法使用GUI浏览器直接打开网页。经多种方法尝试，花了几乎一整天的时间，终于成功。

### 型号与版本说明
<table><thead><tr><th>名称</th><th>型号/版本</th></tr></thead><tbody><tr><td>香橙派</td><td>香橙派4A，arm架构</td></tr><tr><td>Linux</td><td>Ubuntu 22.04.5 LTS</td></tr><tr><td>Python</td><td>python3.11（与官方推荐版本不对应，但可以使用）</td></tr><tr><td>selenium</td><td>4.29.0</td></tr><tr><td>firefox</td><td>Mozilla Firefox 136.0.2</td></tr><tr><td>gekodriver</td><td>geckodriver 0.35.0 (9f0a0036bea4 2024-08-03 07:11 +0000)</td></tr></tbody></table>

### 一、使用 `curl` 命令联网

起初搜索时只找到了这种办法， `curl` 命令可用于发送请求、下载文件等。

> 参考链接：[Linux服务器用命令行来验证校园网（复旦大学为例） - CSDN](https://blog.csdn.net/weixin_43933424/article/details/139415433)

然而我校的校园网认证页面比较复杂， `<input>` 标签输入的账号密码并没有直接放在 `<form>` 表单里提交，而是通过JS代码进行加密后，放到另外的隐藏表单里提交。本人的前端水平有限，经过多次尝试，无法使用。

### 二、使用命令行版的浏览器

> 参考链接：[使用命令行浏览器在 Linux 终端上网浏览 | Linux 中国 - 知乎](https://zhuanlan.zhihu.com/p/306587459)

#### 1. w3m

在Windows下，普通访问认证网址 `http://10.10.100.102/` 时，会自动跳转到 `http://10.10.100.102/eportal/index.jsp?xxx=xxx&xxx=xxx&xxx...` 进行登录。但 `w3m` 的功能似乎没有那么强大，不会自动跳转（**或许是我不会用**）。

起初我以为是我输入的网址不准确，又尝试访问了 `http://10.10.100.102/eportal/index.jsp` 、 `http://10.10.100.102/eportal/` 等多个网页。访问其中一个时成功显示账号和密码输入框，但还有额外的验证码输入框。而使用串口接收的来自命令行版Linux的消息无法显示图片。无法使用。

#### 2. Carbonyl

> 参考链接：[Carbonyl ，一个可以在终端里运行的浏览器 - CSDN](https://blog.csdn.net/Akanarika520/article/details/134692376)

再之后找到了 `Carbonyl` ，可以在终端中用色块显示高糊图片，尝试后确实能加载图片，但验证码太糊了，看不清。再之后发现是访问的网页有问题，多次尝试后，在一次网址的 `?` 后面的参数没删干净的情况下访问到了一次正确的网页，但不知道怎么点击登录按钮。无法使用。

### 三、使用Web自动化脚本

之前学过一点爬虫技术，使用 `selenium` 可实现自动化操作。一开始就打算采用这种方式的，但需要的依赖太多，且没在Linux中使用过，故没有最先尝试。实际上手过程中也确实遇到了很多问题。

起先选择了 `python` + `selenium` + `google-chrome` + `chromedriver` ，然而下载 `google-chrome` 的时候死活访问不上 `snap` （我的 `Ubuntu` 的 `apt` 命令默认使用 `snap` 作为应用商店，后面才找到解决办法），导致无法安装。

然后想着换个其他工具，找到了 `MechanicalSoup` 库，该库基于 `BeautifulSoup` 和 `requests` 库，不依赖于浏览器即可操作。

> 参考链接：[推荐一款小众且好用的 Python 爬虫库 - MechanicalSoup - 简书](https://www.jianshu.com/p/dcff834d1748)
> 官方文档：[Welcome to MechanicalSoup’s documentation!](https://mechanicalsoup.readthedocs.io/en/stable/)

然而实际上手使用过程中，如上文所述，校园网认证页面比较复杂， `<input>` 标签输入的账号密码并没有直接放在 `<form>` 表单里提交，也没有操作成功。所以最后还是选择老老实实地用 `selenium` 。

要使用 `selenium` 就要解决 `snap` 的问题。一开始想到的是使用网络代理，~~文章违规，总之没成功~~ 。

之后居然发现， `Ubuntu` 的 `snap` 其实是可以替换掉的，非常开心，将 `snap` 替换成了 `gnome-software` + `ppa` 。

> 参考链接：[Ubuntu 22.04 禁用（彻底移除）Snap | SYStem Inside](https://sysin.cn/blog/ubuntu-remove-snap/)

替换成功，并用 `apt` 下载了 `firefox` 和 `gekodriver` 。

> 参考链接：[How to Install geckodriver in Linux | Baeldung Linux](https://www.baeldung.com/linux/geckodriver-installation)

#### 使用 `python` + `selenium` + `firefox` + `geckodriver`

然后就是最简单的部分了：在Windows中编写自动化代码并测试、在Linux上用 `pip` 下载需要的依赖、更改代码细节、测试运行。

运行中遇到了类似这样的报错：

（自己的报错没有保存，此报错消息来自这里：[selenium + firefox + webdriver 遇到的坑 - 腾讯云开发者社区](https://cloud.tencent.com/developer/article/1400989)）

```python
Traceback (most recent call last):
 File "maimai_web.py", line 14, in <module>
 driver = webdriver.Firefox()
 File "/usr/local/python3.6/lib/python3.6/site-packages/selenium/webdriver/firefox/webdriver.py", line 152, in __init__
 keep_alive=True)
 File "/usr/local/python3.6/lib/python3.6/site-packages/selenium/webdriver/remote/webdriver.py", line 98, in __init__
 self.start_session(desired_capabilities, browser_profile)
 File "/usr/local/python3.6/lib/python3.6/site-packages/selenium/webdriver/remote/webdriver.py", line 188, in start_session
 response = self.execute(Command.NEW_SESSION, parameters)
 File "/usr/local/python3.6/lib/python3.6/site-packages/selenium/webdriver/remote/webdriver.py", line 256, in execute
 self.error_handler.check_response(response)
 File "/usr/local/python3.6/lib/python3.6/site-packages/selenium/webdriver/remote/errorhandler.py", line 194, in check_response
 raise exception_class(message, screen, stacktrace)
 selenium.common.exceptions.WebDriverException: Message: Process unexpectedly closed with status 1
```

之后尝试①在普通用户下运行代码、②加入无头模式、③加入 `display` 均没有解决问题。

值得一提的是，添加 `pyvirtualdisplay` 库并使用 `display` （具体如何使用在后面的代码中，参考链接里也有原版）后出现报错：

```python
...（此处省略，因为自己没有保存下来，总之是 display 相关行的报错）
FileNotFoundError: [Errno 2] No such file or directory: 'Xvfb'
```

解决方案：使用 `pip` 安装 `xvfb` 库即可。

**如果看到这篇文章的人出现了相同问题，在此说明**：在普通用户下运行代码应该是必要的，因为 `firefox` 不能在 `root` 用户下启动；后两者未必是必要的，如果各种尝试均没有解决问题，可以尝试这两种解决方案。

> 参考链接：
> [selenium自动化测试火狐浏览器驱动报错解决 Process unexpectedly closed with status: 1](https://blog.csdn.net/m0_63130386/article/details/122433611)
> [Message: Process unexpectedly closed with status 255 问题解决](https://blog.csdn.net/weixin_43693379/article/details/119992021)
> [selenium + firefox + webdriver 遇到的坑 - 腾讯云开发者社区](https://cloud.tencent.com/developer/article/1400989)

各种方案均未解决问题后，意识到可能是版本问题，因为在Windows下做测试的时候用的是 `Edge` + `Edge WebDriver` ，没有产生报错，故没有注意到这个问题。遂在浏览器找 `firefox` 和 `gekodriver` 的版本对应关系。对应关系如下：

> 参考链接：[Selenium 与（Firefox、GeckoDriver）和（Chrome、ChromeDriver）版本对应关系](https://idleman.blog.csdn.net/article/details/128000982)
> 官方文档：[Supported platforms — Firefox Source Docs documentation](https://firefox-source-docs.mozilla.org/testing/geckodriver/Support.html)

附上2025.3.21最新的版本对应关系：
<table><thead><tr><th align="center">geckodriver</th><th align="center">Selenium</th><th align="center">Firefox</th><th align="center"></th></tr></thead><tbody><tr><td align="center">min</td><td align="center">max</td><td align="center">min</td><td align="center">max</td></tr><tr><td align="center">0.36.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">128 ESR</td><td align="center">n/a</td></tr><tr><td align="center">0.35.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">115 ESR</td><td align="center">n/a</td></tr><tr><td align="center">0.34.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">115 ESR</td><td align="center">n/a</td></tr><tr><td align="center">0.33.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">102 ESR</td><td align="center">120</td></tr><tr><td align="center">0.32.2</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">102 ESR</td><td align="center">120</td></tr><tr><td align="center">0.32.1</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">102 ESR</td><td align="center">120</td></tr><tr><td align="center">0.32.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">102 ESR</td><td align="center">120</td></tr><tr><td align="center">0.31.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">91 ESR</td><td align="center">120</td></tr><tr><td align="center">0.30.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">78 ESR</td><td align="center">90</td></tr><tr><td align="center">0.29.1</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">60</td><td align="center">90</td></tr><tr><td align="center">0.29.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">60</td><td align="center">90</td></tr><tr><td align="center">0.28.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">60</td><td align="center">90</td></tr><tr><td align="center">0.27.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">60</td><td align="center">90</td></tr><tr><td align="center">0.26.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">60</td><td align="center">90</td></tr><tr><td align="center">0.25.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">57</td><td align="center">90</td></tr><tr><td align="center">0.24.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">57</td><td align="center">79</td></tr><tr><td align="center">0.23.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">57</td><td align="center">79</td></tr><tr><td align="center">0.22.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">57</td><td align="center">79</td></tr><tr><td align="center">0.21.0</td><td align="center">≥ 3.11 (3.14 Python)</td><td align="center">57</td><td align="center">79</td></tr><tr><td align="center">0.20.1</td><td align="center">≥ 3.5</td><td align="center">55</td><td align="center">62</td></tr><tr><td align="center">0.20.0</td><td align="center">≥ 3.5</td><td align="center">55</td><td align="center">62</td></tr><tr><td align="center">0.19.1</td><td align="center">≥ 3.5</td><td align="center">55</td><td align="center">62</td></tr><tr><td align="center">0.19.0</td><td align="center">≥ 3.5</td><td align="center">55</td><td align="center">62</td></tr><tr><td align="center">0.18.0</td><td align="center">≥ 3.4</td><td align="center">53</td><td align="center">62</td></tr><tr><td align="center">0.17.0</td><td align="center">≥ 3.4</td><td align="center">52</td><td align="center">62</td></tr></tbody></table>

经检查，发现版本确实有问题，香橙派官方 `Ubuntu` 系统自带的 `Python` 版本是3.10，版本过低（其实应该说是 `firefox` 版本太高了？）。升级后终于成功运行（经测试 `Python3.11` 也可以运行代码，但最好还是依照官方推荐的版本，以防出现各种问题）。

附 `python` 代码如下：

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.service import Service
from selenium.webdriver import FirefoxOptions
from pyvirtualdisplay import Display

path_geckodriver = Service('/tools/geckodriver')
# opts = FirefoxOptions()
# opts.add_argument("--headless")

display = Display(visible=0, size=(576, 720))
display.start()

url = 'http://10.10.100.102/'

driver = webdriver.Firefox(service=path_geckodriver)
driver.get(url)

# driver.implicitly_wait(3)

username = driver.find_element(by=By.ID, value='username')
pwd = driver.find_element(by=By.ID, value='pwd')
login_btn = driver.find_element(by=By.ID, value='loginLink')

driver.execute_script("arguments[0].value = 'xxx';", username)
driver.execute_script("arguments[0].value = 'xxx';", pwd)

login_btn.click()

driver.close()
```

### 四、使用 `cpolar` 做内网穿透

本想用花生壳做内网穿透，因为用过他们家的向日葵远程控制，使用体验非常好，可惜花生壳的Linux版仅支持 `x86_64` 和 `i386` 架构，遂选用 `cpolar` 。  
 香橙派 `Ubuntu` 镜像已提前安装好了 `ssh` ，再额外安装 `cpolar` 就行了。安装非常简单，官网教程也很详细。

> 官网链接：[cpolar官网-安全的内网穿透工具 | 无需公网ip | 远程访问 | 搭建网站](https://www.cpolar.com/)

然后创建隧道即可。

```
cpolar tcp 22 // 端口号换成想使用的端口即可
```

看有的文章说开放22端口很危险，有被暴力破解的风险，有需要可以注意一下，一般人估计也没什么危险。

### 五、写入 `.service` 文件使开机自动运行

现在已经解决了Linux联网以及主设备ssh远程连接的问题，再之后就是开机自动联网并创建隧道。这样用起来就很方便了。不用每天从宿舍出去时还要插线串口操作。  
 使用 `.service` 文件可以方便地指定执行用户，而如之前所说， `firefox` 不能再 `root` 用户下运行，故选用此方法。  
 先配置一下网络自动连接：

```bash
vim /etc/NetworkManager/system-connections/WIFI名.nmconnection
```

把其中 `autoconnect` 改成 `true` 就行了。  
 然后将 `cpolar` 配置为开机自启动：

```bash
systemctl enable cpolar
```

编写 `.service` 并赋予执行权限，放到 `/etc/systemd/system/` 路径下。

```powershell
[Unit]
Description=Run lint-start.py and cpolar at startup
After=network.target

[Service]
Type=idle
ExecStart=/usr/bin/python3.11 /tools/link-start.py
# ExecStartPost=/usr/local/bin/cpolar tcp 22
WorkingDirectory=/tools/
User=orangepi
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

本来想着还需要 `cpolar` 执行一下创建隧道的命令。后来发现把 `cpolar` 设为开机自启的话，就不用执行上文注释掉的命令，cpolar会自动创建本地所有网络服务的隧道；反之，如果不把 `cpolar` 设为开机自启，就需要手动创建隧道。  
 重启，成功连接，创建的隧道可以在 `cpolar` 的[仪表盘 - 状态](https://dashboard.cpolar.com/status)中查看。

