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
	git clone https://github.com/Medicean/as_bypass_php_disable_functions.git
```

或者
	
点击 [这里](https://github.com/Medicean/as_bypass_php_disable_functions/archive/master.zip) 下载源代码，并解压。

2.拷贝源代码至插件目录

将插件目录拷贝至 `antSword/antData/plugins/` 目录下即安装成功

## 如何使用

[绕过open_basedir思路（蚁剑插件演示）](https://mp.weixin.qq.com/s/GGnumPklkUNMLZKQL4NbKg)

## TODO:

[x] LD_PRELOAD (linux only)
[ ] COM (windown, php 5.3~5.6)

## 相关链接

* [AntSword 文档](http://doc.u0u.us)
* [dhtmlx 文档](http://docs.dhtmlx.com/)
