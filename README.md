# AntSword Bypass disable_function

突破 `disable_functions` 执行系统命令，绕过 Open_basedir 等安全机制

## php.ini 样例:

```
disable_functions = pcntl_alarm,pcntl_fork,pcntl_waitpid,pcntl_wait,pcntl_wifexited,pcntl_wifstopped,pcntl_wifsignaled,pcntl_wifcontinued,pcntl_wexitstatus,pcntl_wtermsig,pcntl_wstopsig,pcntl_signal,pcntl_signal_get_handler,pcntl_signal_dispatch,pcntl_get_last_error,pcntl_strerror,pcntl_sigprocmask,pcntl_sigwaitinfo,pcntl_sigtimedwait,pcntl_exec,pcntl_getpriority,pcntl_setpriority,pcntl_async_signals,exec,shell_exec,popen,proc_open,passthru,symlink,link,syslog,imap_open,ld,mail,system

open_basedir=.:/proc/:/tmp/
```

## 安装

### 商店安装

进入 AntSword 插件中心，选择「绕过disable_functions」，点击安装

### 手动安装

1.获取源代码

```bash
$ git clone https://github.com/Medicean/as_bypass_php_disable_functions.git
```

或者
	
点击 [这里](https://github.com/Medicean/as_bypass_php_disable_functions/archive/master.zip) 下载源代码，并解压。

2.拷贝源代码至插件目录

将插件目录拷贝至 `antSword/antData/plugins/` 目录下即安装成功

## 演示图

![bypass_disable_funcs_main.png](https://i.loli.net/2019/04/14/5cb2c1618ef1b.png)

## 如何使用

[绕过open_basedir思路（蚁剑插件演示）](https://mp.weixin.qq.com/s/GGnumPklkUNMLZKQL4NbKg)


## 测试环境

参见 [AntSword-Labs/bypass_disable_functions](https://github.com/AntSwordProject/AntSword-Labs/tree/master/bypass_disable_functions/)

## 支持情况:

模式 | Bypass 方式 | Linux | Windows |
:--|:--|:--|:--|
`LD_PRELOAD`|启动新WebServer| Yes | No |
`Fastcgi/PHP_FPM` | 启动新WebServer | Yes | Yes (不支持 IIS PIPE ) |
`Apache_mod_cgi` | 重定向输出到文件 | Yes | No (TODO) |
`JSON_Serializer_UAF` | stdout | Yes | No (TODO) |
`PHP7_GC_UAF` | stdout | Yes |  No (TODO) |
`PHP7_Backtrace_UAF`| stdout | Yes | No (TODO) |
`PHP74_FFI`| 重定向输出到文件| Yes | Yes | 
`iconv`|启动新WebServer| Yes |  No (TODO) |
`PHP7_ReflectionProperty_UAF`| stdout | Yes | No (TODO) |
`PHP7_UserFilter` | stdout | Yes | Yes |


- [x] LD_PRELOAD

  利用 LD_PRELOAD 环境变量加载 so 文件, LD_PRELOAD 只在 Linux 系统上才有

- [x] PHP-FPM/FCGI

 适用于PHP-FPM/FCGI 监听在 unix socket 或者 tcp socket 上时使用。常见的比如: `nginx + fpm`
 
 IIS+FPM 使用的是「管道」通信，不适用

- [x] COM (windown, php 5.3~5.6 已在antsword核心集成)
- [x] Apache Mod CGI
- [x] Json Serializer UAF ([PHP-Bug-#77843](https://bugs.php.net/bug.php?id=77843))
- [x] GC with Certain Destructors UAF ([PHP-Bug-#72530](https://bugs.php.net/bug.php?id=72530))
- [X] Backtrace UAF ([PHP-Bug-#76047](https://bugs.php.net/bug.php?id=76047))
- [x] PHP7 FFI
- [x] iconv
- [x] PHP7 ReflectionProperty UAF ([PHP-Bug-#79820](https://bugs.php.net/bug.php?id=79820))
- [x] PHP 7.0-8.0 user_filter ([PHP-Bug-#54350](https://bugs.php.net/bug.php?id=54350))

## 相关链接

* [AntSword 文档](http://doc.u0u.us)
* [dhtmlx 文档](http://docs.dhtmlx.com/)
* [mm0r1/exploits](https://github.com/mm0r1/exploits/)