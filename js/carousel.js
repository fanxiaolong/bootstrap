/* ========================================================================
 * Bootstrap: carousel.js v3.1.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element) // 容器元素，因为不管单击哪个，最终都会转换到 data-ride ="carousel"容器元素
    this.$indicators = this.$element.find('.carousel-indicators') // 查找小圆圈指示符元素集合
    this.options     = options    // 插件运行参数，优先级最高的是所单击元素上的data-属性，然后是容器上的data-属性，最后才是默认值
    this.paused      =  // 暂停标记
    this.sliding     =  // 轮播标记
    this.interval    =  // 轮播间隔标记
    this.$active     =  // 当前活动图片的对象
    this.$items      = null  // 所有的图片元素对象

    this.options.pause == 'hover' && this.$element   // 如果设置鼠标移动上去就暂停的话
      .on('mouseenter', $.proxy(this.pause, this))   // 鼠标进入时，执行pause方法进行暂停
      .on('mouseleave', $.proxy(this.cycle, this))   // 鼠标移出时，执行cycle方法重启开启
  }

  Carousel.DEFAULTS = {
    interval: 5000,  // 默认间隔5秒
    pause: 'hover',  // 默认设置，鼠标移动上去图片就暂停
    wrap: true       // 轮播是否持续循环
  }
    // 开启轮播(默认从右向左)
  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false) // 如果没传e，将paused设置为false

    this.interval && clearInterval(this.interval)  // 如果设置了interval间隔，就清除它

      // 如果设置了options.interval间隔，并且没有暂停
      // 就将在下一个间隔之后，执行next方法(播放下一张图片)
    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this  // 返回this，以便链式操作
  }

    // 判断当前图片在整个轮播图片集中的索引
  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')   // 找到当前active图片元素(其实是元素外部的div容器)
    this.$items  = this.$active.parent().children()     // 在找到该元素的父容器(即carousel-inner样式容器)的子集合(即所有的item元素集合)

    return this.$items.index(this.$active)  // 判断当前图片元素在集合中的索引位置，并返回
  }

    // 直接轮播指定索引的图片
  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()   // 查找当前图片的索引位置

    if (pos > (this.$items.length - 1) || pos < 0) return    // 如果传入的pos值大于图片总数，或者小于0，则直接返回不做任何操作

      // 如果正在执行其他图片轮播，则在其结束以后再跳转到指定的pos图片(通过触发一次性的slid事件来实现)
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
      // 如果当前活动图片正好是指定的pos图片，则先暂停，然后继续执行
    if (activeIndex == pos) return this.pause().cycle()

      // 第二个参数是将pos对应的item元素对象传进去(具体作用查看下面的slide方法)
    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

    // 暂停轮播
  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)   // 如果没传e，将paused设置为true(说明要暂停)

      // 如果有next或prev元素，并且支持动画，则触发动画
    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)  // 触发动画
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval) // 返回this，以便链式操作

    return this
  }

    // 轮播下一张图片
  Carousel.prototype.next = function () {
    if (this.sliding) return    // 如果正在轮播(还没结束)，直接返回
    return this.slide('next')   // 否则，轮播下一张图片
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return   // 如果正在轮播(还没结束)，直接返回
    return this.slide('prev')  // 否则，轮播上一张图片
  }

    // 轮播的具体操作方法
  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')   // 找到当前活动的图片对象条目
    var $next     = next || $active[type]()   // 如果提供了next参数，就使用这个参数，如果没提供，就使用当前活动条目的下一个图片条目(例如：$active.next();)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'  // 获取移动的方向：如果是next，则是向左移动，否则是向右移动

      // 如果获取失败，指定一个元素进行特殊处理，如果再传next，则指向下一轮的图片即如果最后一个图片显示以后，还要next，那就是下一轮的first
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this   // 获取当前调用者的this对象，防止作用域污染

    if (!$next.length) {   // 如果下一个对象不存在
      if (!this.options.wrap) return   // 判断wrap是否为假，如果是，则直接返回
      $next = this.$element.find('.item')[fallback]()   // 否则，使用fallback指定的元素当做 $next对象元素
    }

      // 设定轮播后要触发的事件，以及要暴露的参数
    if ($next.hasClass('active')) return this.sliding = false  // 如果下一个元素已经是高亮了，则设置轮播标记为false

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
    this.$element.trigger(e)    // 触发slide事件
    if (e.isDefaultPrevented()) return   // 如果要轮播的对象已经是active高亮了，直接返回不做处理

    this.sliding = true  // 标记轮播正在进行

    isCycling && this.pause()  // 如果有间隔，则暂停自动执行

    if (this.$indicators.length) {  // 如果有小圆圈指示符
      this.$indicators.find('.active').removeClass('active')   // 去除原来高亮指示符的active样式,设置一次性slid事件，以便在轮播后执行该事件，从而设置高亮指示符
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])   // 获取当前高亮图片的索引，按照该索引找到对的指示符
        $nextIndicator && $nextIndicator.addClass('active')   // 如果找到的话，就添加active样式使其高亮
      })
    }

      // 如果支持动画，并且设置了slide样式(注意，这里不是fade效果)
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)   // 给要轮播的元素添加type类型样式(比如：next、prev)
      $next[0].offsetWidth   // force reflow  重绘UI
      $active.addClass(direction)   // 给当前活动的对象添加方法(如left、right)
      $next.addClass(direction)     // 给要轮播的元素添加方法(如left、right)
        debugger;

        // 给当前活动元素绑定一次性动画事件，在该事件回调里执行以下操作
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active') // 在将要轮播的元素上，删除对应type和方向样式(如next left或者prev right),然后添加active样式
          $active.removeClass(['active', direction].join(' '))  // 删除当前活动元素(即将隐藏)上的active样式和方向样式(如left或right)
          that.sliding = false  // 设置轮播状态结束
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)  // 然后触发slid事件，这里使用了setTimeout是确保UI刷新线程不被阻塞
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {  // 如果不支持动画
      $active.removeClass('active')   // 删除当前高亮元素上的active样式
      $next.addClass('active')        // 给要轮播的元素上添加高亮active样式
      this.sliding = false  // 设置轮播状态结束
      this.$element.trigger('slid.bs.carousel')   // 触发slid事件
    }

    isCycling && this.cycle()  // 如果有间隔，则重新开始(间隔后)自动执行

    return this  // 返回this，以便链式操作(这里的this是data-ride="carousel"容器元素)
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel // 保留其他库的$.fn.carousel代码(如果定义的话)，以便在noConflict之后，可以继续使用该老代码

  $.fn.carousel = function (option) {
    return this.each(function () {  // 遍历所有符合规则的元素
      var $this   = $(this)   // 当前触发元素的jQuery对象
      var data    = $this.data('bs.carousel')
        // 获取自定义属性data-bs.carousel的值 (其实是carousel实例)
        // 合并参数，优先级依次递增
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide  // 如果option参数是字符串，直接使用，否则使用options里的slide参数

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))   // 如果没有carousel实例，就初始化一个，并传入this和参数
      if (typeof option == 'number') data.to(option)  // 如果option是数字，表示是想直接切换到某张图上，所以直接使用.to()方法
      else if (action) data[action]()   //否则，再判断如果action存在，就执行action所对应的方法
      else if (options.interval) data.pause().cycle()   // 最后，如果指定了interval参数，先暂停然后重新循环
    })
  }

  $.fn.carousel.Constructor = Carousel   // 并重设插件构造器，可以通过该属性获取插件的真实类函数


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

    // 绑定触发事件
    // 在带有data-slide或data-slide-to属性的元素上绑定事件
  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
      // 查找target，即所指定的折叠地区的id或者选择符，如果没有target，就使用href里的值
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      // 合并target上的data-属性和触发元素上的data-属性
    var options = $.extend({}, $target.data(), $this.data())
      // 查找单击元素上是否有data-slide-to属性
      // 如果存在，则取消间隔设置(因为单击data-slide-to意味着是手动触发行为，后续是不会循环播放的)
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)  // 实例化插件

      // 再次判断如果单击的是小圆圈data-slide-to,
      // 则直接跳转到那张图上($target.data('bs.carousel')是绑定的插件实例)
    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()  // 阻止默认行为
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {  // 遍历所有符合规则的元素
      var $carousel = $(this)
      $carousel.carousel($carousel.data())   // 实例化插件(并收集data-参数)，以便自动运行
    })
  })

}(jQuery);
