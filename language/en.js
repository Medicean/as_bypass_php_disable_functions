module.exports = {
  title: "Bypass disable_functions",
  success: "Success",
  error: "Fail",
  no_mode: "Click on the button above, select the mode",
  form_not_comp: "Please complete the form",
  toolbar: {
    start: "Start",
    select_mode: "SelectMode",
  },
  status_cell: {
    title: "Shell Status",
    ver: "PHP Version",
    arch: "PHP Arch",
    os: "OS",
    phpself: "Current directory",
    func: "Function support",
  },
  precheck: {
    only_linux: "Only supports Linux operating system",
    only_win: "Only supports Windows operating system",
    require_func: (func) => `${func} function is not available`,
  },
  core: {
    base: {
      proxyscript: {
        success: (url) => `Upload proxy script succeeded: ${url}`,
        fail: "Upload proxy script failed",
      }
    },
    ld_preload: {
      title: "LD_PRELOAD",
      form: {
        phpbinary: 'php-cli Path (PHP>=5.3)',
      },
      msg: {
        genext_err: "Generate PHP extension failed",
      }
    },
    php_fpm: {
      title: "Fastcgi/PHP-FPM",
      form: {
        fpm_addr: 'FPM/FCGI Address',
        phpbinary: 'php-cli Path (PHP>=5.3)',
      },
      msg: {
        genext_err: "Generate PHP extension failed",
      }
    },
    apache_mod_cgi: {
      title: "Apache_mod_cgi",
      status_cell: {
        modcgi: "CGI",
        writable: "Writeable",
        htaccess: "htaccess",
      }
    },
    json_serializer_uaf: {
      title: "Json Serializer UAF",
      status_cell: {
        ver: 'PHP_VERSION',
      },
      err: {
        phpvererr: "PHP Version not support, only support 7.1.x, 7.2.0~7.2.18, 7.3.0~7.3.5"
      }
    },
    php7_gc_uaf: {
      title: "PHP7 GC with Certain Destructors UAF",
      status_cell: {
        ver: 'PHP_VERSION',
      },
      err: {
        phpvererr: "PHP Version not support, only support 7.0.x, 7.1.x, 7.2.x, 7.3.x"
      }
    },
    php7_backtrace_uaf: {
      title: "PHP7 Backtrace UAF",
      status_cell: {
        ver: 'PHP_VERSION',
      },
      err: {
        phpvererr: "PHP Version not support, only support 7.0.x, 7.1.x, 7.2.x, 7.3.0~7.3.14, 7.4.0~7.4.2"
      }
    },
    php74_ffi: {
      title: "PHP>=7.4 FFI Extension Execute Command",
      status_cell: {
        ver: 'PHP_VERSION',
        ffi: 'FFI_Extension',
        ffi_enable: 'FFI Enable',
      },
      err: {
        phpvererr: "PHP Version not support, need PHP>=7.4",
        ffi_not_loaded: "FFI Extension not loaded",
        ffi_not_enable: "ffi.enabled not On, can not exploit. default is preload(only call ffi in php-cli and preload)",
      }
    },
    iconv: {
      title: "iconv modules Execute Command",
      form: {
        phpbinary: 'php-cli Path (PHP>=5.3)',
      },
      msg: {
        genext_err: "Generate PHP extension failed",
      }
    },
    php7_reflectionproperty_uaf: {
      title: "PHP<=7.4.8 ReflectionProperty UAF",
      status_cell: {
        ver: 'PHP_VERSION',
      },
      err: {
        phpvererr: "PHP Version not support, need <=7.4.8 ",
      }
    },
  }
}