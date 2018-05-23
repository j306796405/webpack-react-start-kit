module.exports = {
  joinUrl: function (baseUrl, suffixUrl) {
    var newUrl = {}
    for (var k in suffixUrl) {
      if (suffixUrl.hasOwnProperty(k)) {
        newUrl[k] = baseUrl + suffixUrl[k]
      }
    }
    return newUrl
  },
  formatNum: function (num, shift, decimal, signed, unit, fstr) {
    //num, decimal, shift 均为Number
    var arr, sign
    if (!num && num !== 0) {
      return fstr || '--'
    }
    sign = (signed && num > 0) ? '+' : ''
    unit = unit || ''
    if (shift > 0) {
      num *= Math.pow(10, Math.abs(shift))
    } else if (shift < 0) {
      num /= Math.pow(10, Math.abs(shift))
    }
    //整数隔3位加","---保留小数点后"decimal"位(-1小数点不做处理)
    if (decimal >= 0) {
      num = this.toFixed(parseFloat(num), decimal)
    }
    arr = String(num).split('.')
    arr[0] = arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    return sign + (arr[0] + (arr[1] ? ('.' + arr[1]) : '')) + unit
  },
  formatDate: function (d, s, r1, r2) {
    //r取值示例: r1:"1-3", r2:"1-3"
    var a, a1, a2, i, len, rr1, rr2
    if (typeof d == 'number') {
      d = new Date(d)
    } else if (typeof d == 'string') {
      d = new Date(d.replace(/-/g, '/'))
    } else {
      return '--'
    }
    a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()]
    i = 1
    len = a.length
    for (; i < len; i++) {
      a[i] = a[i] < 10 ? '0' + a[i] : a[i]
    }
    if (r1) {
      rr1 = r1.split('-')
      a1 = a.slice(Number(rr1[0]) - 1, Number(rr1[1])).join(s)
    }
    if (r2) {
      rr2 = r2.split('-')
      a2 = a.slice(Number(rr2[0]) + 2, Number(rr2[1]) + 3).join(':')
    }
    if (r1 && r2) {
      a1 += ' '
    }
    return (a1 || '') + (a2 || '')
  },
  tenMillion: function (money) {
    //'千', '万' 格式转换, 用于限额
    var result
    if (money >= 1000) {
      result = money >= 10000 ? parseInt(money / 10000) + '万' : parseInt(money / 1000) + '千'
    }
    else if (money >= 0) {
      result = money
    }
    else {
      result = '无限额'
    }
    return result
  },
  valiIntNum: function (str) {
    //验证数字,正整数
    return /^[1-9]\d*$/.test(str)
  },
  valiEmail: function (str) {
    return /^([\w\-\.])+@([\w\-])+((\.[\w\-]{2,3}){1,2})$/.test(str)
  },
  setTitle: function (title, container) {
    if (!title) {
      return false
    }
    setTimeout(function () {
      document.title = title
      KQB.native('setPageTitle', {title: title})
      container && container.data('title', title)
    }, 10)
  },
  openPage: function (url, next, isOpenNewPage = true) {
    next = this.hasUrlDirect(next)
    //当前页面新开一个流程(url)，并指定新开流程完毕之后的回跳链接（如没有传入回跳链接，默认回到当前页面）
    var hash = (url.match(/#.*/) || [''])[0],
      modSearch = (url.indexOf('?') == -1 ? '?' : '&') + 'nextPage=' +
        encodeURIComponent(next || location.href) + hash;
    (KQB.Env.KQ && isOpenNewPage) ? KQB.native('openNewPage',
      {'targetUrl': url}) : location.assign((hash
      ? url.replace(hash, '')
      : url) + modSearch)
  },
  /* 判断当前地址地址是否包含direct=Y，如果包含需要加到next地址，保证回到next后,执行closePage可以关闭当前view */
  hasUrlDirect (url) {
    if (!url) {
      return url
    }

    const isDirect = location.search.match(/direct=Y/)
    const nextHash = (url.match(/#.*/) || [''])[0]
    url = (nextHash ? url.replace(nextHash, '') : url) + `${isDirect ? (url.indexOf('?') == -1 ? '?' : '&') + 'direct=Y' : ''}` + nextHash

    return url
  },
  closePage: function (direct, prev) {
    //关闭当前流程，回到前一个流程(prev)，如没有传入回到nextPage或者当前流程的首页
    var search = location.search,
      nextPage = decodeURIComponent(
        (search.match(/nextPage=[^&]*/) || [''])[0].replace(/nextPage=/,
          '')),
      curLink = location.href.replace(/[#].*/, ''),
      link = prev || nextPage || curLink
    direct = direct ||
      (search.match(/direct=[^&]*/) || [''])[0].replace(/direct=/, '')
    KQB.Env.KQ && !nextPage && !direct &&
    KQB.native('openNewPage', {'targetUrl': link});
    (KQB.Env.KQ && !nextPage) ? KQB.native('goback', {}) : location.assign(
      link)
  },
  movePoint: function (num, scale) {
    if (scale == 0) {
      return num
    }

    //补位
    function pad (str, scale) {
      var len = str.length,
        abs = Math.abs(scale)
      while (len < abs) {
        str = scale < 0 ? ('0' + str) : (str + '0')
        len++
      }
      return str
    }

    //拼接
    var str = String(num),
      ch = '.',
      sn = '',
      abs = Math.abs(scale),
      ps = str.split('.'),
      s1 = ps[0] ? ps[0] : '',
      s2 = ps[1] ? ps[1] : '',
      re = ''
    if (s1.slice(0, 1) == '-') {
      s1 = s1.slice(1)
      sn = '-'
    }
    if (scale < 0) {
      if (s1.length <= abs) {
        ch = '0.'
        s1 = pad(s1, scale)
      }
      re = sn + s1.slice(0, -abs) + ch + s1.slice(-abs) + s2
    }
    else {
      if (s2.length <= abs) {
        ch = ''
        s2 = pad(s2, scale)
      }
      re = sn + s1 + s2.slice(0, abs) + ch + s2.slice(abs)
    }
    return Number(re)
  },
  formatDay: (dateTime) => {
    const day = new Date(dateTime).getDay()
    return ['日', '一', '二', '三', '四', '五', '六'][day] || ''
  },
  bindViewUpdate: function (callback, name = 'view_update') {
    if (!KQB.Env.KQ) {
      return false
    }
    //打开新view后，通过local数据刷新页面
    app.local.set(name, false)
    var timer = setInterval(function () {
      if (app.local.get(name)) {
        app.local.set(name, false)
        callback && callback()
      }
    }, 1000)

    function clear () {
      clearInterval(timer)
      $$('body').off('touchstart', clear)
    }

    $$('body').on('touchstart', clear)
  },
  setViewUpdate: function (callback, name = 'view_update') {
    if (!KQB.Env.KQ) {
      return false
    }
    app.local.set(name, true)
    callback && callback()
  },
  pubData: function (b) {
    return JSON.stringify({'c': 'H5', 'b': b, 'id': '100', 't': new Date() / 1 + ''})
  },
  toFixed (number, n) {
    if (n > 20 || n < 0) {
      throw new RangeError('toFixed() digits argument must be between 0 and 20')
    }

    if (isNaN(number) || number >= Math.pow(10, 21)) {
      return number.toString()
    }
    if (typeof (n) == 'undefined' || n == 0) {
      return (Math.round(number)).toString()
    }

    let result = number.toString()
    const arr = result.split('.')

    // 整数的情况
    if (arr.length < 2) {
      result += '.'
      for (let i = 0; i < n; i += 1) {
        result += '0'
      }
      return result
    }

    const integer = arr[0]
    const decimal = arr[1]
    if (decimal.length == n) {
      return result
    }
    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i += 1) {
        result += '0'
      }
      return result
    }
    result = integer + '.' + decimal.substr(0, n)
    const last = decimal.substr(n, 1)

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
      const x = Math.pow(10, n)
      result = (Math.round((parseFloat(result) * x)) + 1) / x
      result = result.toFixed(n)
    }

    return result
  }
}
