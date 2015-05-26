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
    this.$element    = $(element) // ����Ԫ�أ���Ϊ���ܵ����ĸ������ն���ת���� data-ride ="carousel"����Ԫ��
    this.$indicators = this.$element.find('.carousel-indicators') // ����СԲȦָʾ��Ԫ�ؼ���
    this.options     = options    // ������в��������ȼ���ߵ���������Ԫ���ϵ�data-���ԣ�Ȼ���������ϵ�data-���ԣ�������Ĭ��ֵ
    this.paused      =  // ��ͣ���
    this.sliding     =  // �ֲ����
    this.interval    =  // �ֲ�������
    this.$active     =  // ��ǰ�ͼƬ�Ķ���
    this.$items      = null  // ���е�ͼƬԪ�ض���

    this.options.pause == 'hover' && this.$element   // �����������ƶ���ȥ����ͣ�Ļ�
      .on('mouseenter', $.proxy(this.pause, this))   // ������ʱ��ִ��pause����������ͣ
      .on('mouseleave', $.proxy(this.cycle, this))   // ����Ƴ�ʱ��ִ��cycle������������
  }

  Carousel.DEFAULTS = {
    interval: 5000,  // Ĭ�ϼ��5��
    pause: 'hover',  // Ĭ�����ã�����ƶ���ȥͼƬ����ͣ
    wrap: true       // �ֲ��Ƿ����ѭ��
  }
    // �����ֲ�(Ĭ�ϴ�������)
  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false) // ���û��e����paused����Ϊfalse

    this.interval && clearInterval(this.interval)  // ���������interval������������

      // ���������options.interval���������û����ͣ
      // �ͽ�����һ�����֮��ִ��next����(������һ��ͼƬ)
    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this  // ����this���Ա���ʽ����
  }

    // �жϵ�ǰͼƬ�������ֲ�ͼƬ���е�����
  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')   // �ҵ���ǰactiveͼƬԪ��(��ʵ��Ԫ���ⲿ��div����)
    this.$items  = this.$active.parent().children()     // ���ҵ���Ԫ�صĸ�����(��carousel-inner��ʽ����)���Ӽ���(�����е�itemԪ�ؼ���)

    return this.$items.index(this.$active)  // �жϵ�ǰͼƬԪ���ڼ����е�����λ�ã�������
  }

    // ֱ���ֲ�ָ��������ͼƬ
  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()   // ���ҵ�ǰͼƬ������λ��

    if (pos > (this.$items.length - 1) || pos < 0) return    // ��������posֵ����ͼƬ����������С��0����ֱ�ӷ��ز����κβ���

      // �������ִ������ͼƬ�ֲ�������������Ժ�����ת��ָ����posͼƬ(ͨ������һ���Ե�slid�¼���ʵ��)
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
      // �����ǰ�ͼƬ������ָ����posͼƬ��������ͣ��Ȼ�����ִ��
    if (activeIndex == pos) return this.pause().cycle()

      // �ڶ��������ǽ�pos��Ӧ��itemԪ�ض��󴫽�ȥ(�������ò鿴�����slide����)
    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

    // ��ͣ�ֲ�
  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)   // ���û��e����paused����Ϊtrue(˵��Ҫ��ͣ)

      // �����next��prevԪ�أ�����֧�ֶ������򴥷�����
    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)  // ��������
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval) // ����this���Ա���ʽ����

    return this
  }

    // �ֲ���һ��ͼƬ
  Carousel.prototype.next = function () {
    if (this.sliding) return    // ��������ֲ�(��û����)��ֱ�ӷ���
    return this.slide('next')   // �����ֲ���һ��ͼƬ
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return   // ��������ֲ�(��û����)��ֱ�ӷ���
    return this.slide('prev')  // �����ֲ���һ��ͼƬ
  }

    // �ֲ��ľ����������
  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')   // �ҵ���ǰ���ͼƬ������Ŀ
    var $next     = next || $active[type]()   // ����ṩ��next��������ʹ��������������û�ṩ����ʹ�õ�ǰ���Ŀ����һ��ͼƬ��Ŀ(���磺$active.next();)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'  // ��ȡ�ƶ��ķ��������next�����������ƶ��������������ƶ�

      // �����ȡʧ�ܣ�ָ��һ��Ԫ�ؽ������⴦������ٴ�next����ָ����һ�ֵ�ͼƬ��������һ��ͼƬ��ʾ�Ժ󣬻�Ҫnext���Ǿ�����һ�ֵ�first
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this   // ��ȡ��ǰ�����ߵ�this���󣬷�ֹ��������Ⱦ

    if (!$next.length) {   // �����һ�����󲻴���
      if (!this.options.wrap) return   // �ж�wrap�Ƿ�Ϊ�٣�����ǣ���ֱ�ӷ���
      $next = this.$element.find('.item')[fallback]()   // ����ʹ��fallbackָ����Ԫ�ص��� $next����Ԫ��
    }

      // �趨�ֲ���Ҫ�������¼����Լ�Ҫ��¶�Ĳ���
    if ($next.hasClass('active')) return this.sliding = false  // �����һ��Ԫ���Ѿ��Ǹ����ˣ��������ֲ����Ϊfalse

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
    this.$element.trigger(e)    // ����slide�¼�
    if (e.isDefaultPrevented()) return   // ���Ҫ�ֲ��Ķ����Ѿ���active�����ˣ�ֱ�ӷ��ز�������

    this.sliding = true  // ����ֲ����ڽ���

    isCycling && this.pause()  // ����м��������ͣ�Զ�ִ��

    if (this.$indicators.length) {  // �����СԲȦָʾ��
      this.$indicators.find('.active').removeClass('active')   // ȥ��ԭ������ָʾ����active��ʽ,����һ����slid�¼����Ա����ֲ���ִ�и��¼����Ӷ����ø���ָʾ��
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])   // ��ȡ��ǰ����ͼƬ�����������ո������ҵ��Ե�ָʾ��
        $nextIndicator && $nextIndicator.addClass('active')   // ����ҵ��Ļ��������active��ʽʹ�����
      })
    }

      // ���֧�ֶ���������������slide��ʽ(ע�⣬���ﲻ��fadeЧ��)
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)   // ��Ҫ�ֲ���Ԫ�����type������ʽ(���磺next��prev)
      $next[0].offsetWidth   // force reflow  �ػ�UI
      $active.addClass(direction)   // ����ǰ��Ķ�����ӷ���(��left��right)
      $next.addClass(direction)     // ��Ҫ�ֲ���Ԫ����ӷ���(��left��right)
        debugger;

        // ����ǰ�Ԫ�ذ�һ���Զ����¼����ڸ��¼��ص���ִ�����²���
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active') // �ڽ�Ҫ�ֲ���Ԫ���ϣ�ɾ����Ӧtype�ͷ�����ʽ(��next left����prev right),Ȼ�����active��ʽ
          $active.removeClass(['active', direction].join(' '))  // ɾ����ǰ�Ԫ��(��������)�ϵ�active��ʽ�ͷ�����ʽ(��left��right)
          that.sliding = false  // �����ֲ�״̬����
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)  // Ȼ�󴥷�slid�¼�������ʹ����setTimeout��ȷ��UIˢ���̲߳�������
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {  // �����֧�ֶ���
      $active.removeClass('active')   // ɾ����ǰ����Ԫ���ϵ�active��ʽ
      $next.addClass('active')        // ��Ҫ�ֲ���Ԫ������Ӹ���active��ʽ
      this.sliding = false  // �����ֲ�״̬����
      this.$element.trigger('slid.bs.carousel')   // ����slid�¼�
    }

    isCycling && this.cycle()  // ����м���������¿�ʼ(�����)�Զ�ִ��

    return this  // ����this���Ա���ʽ����(�����this��data-ride="carousel"����Ԫ��)
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel // �����������$.fn.carousel����(�������Ļ�)���Ա���noConflict֮�󣬿��Լ���ʹ�ø��ϴ���

  $.fn.carousel = function (option) {
    return this.each(function () {  // �������з��Ϲ����Ԫ��
      var $this   = $(this)   // ��ǰ����Ԫ�ص�jQuery����
      var data    = $this.data('bs.carousel')
        // ��ȡ�Զ�������data-bs.carousel��ֵ (��ʵ��carouselʵ��)
        // �ϲ����������ȼ����ε���
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide  // ���option�������ַ�����ֱ��ʹ�ã�����ʹ��options���slide����

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))   // ���û��carouselʵ�����ͳ�ʼ��һ����������this�Ͳ���
      if (typeof option == 'number') data.to(option)  // ���option�����֣���ʾ����ֱ���л���ĳ��ͼ�ϣ�����ֱ��ʹ��.to()����
      else if (action) data[action]()   //�������ж����action���ڣ���ִ��action����Ӧ�ķ���
      else if (options.interval) data.pause().cycle()   // ������ָ����interval����������ͣȻ������ѭ��
    })
  }

  $.fn.carousel.Constructor = Carousel   // ��������������������ͨ�������Ի�ȡ�������ʵ�ຯ��


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

    // �󶨴����¼�
    // �ڴ���data-slide��data-slide-to���Ե�Ԫ���ϰ��¼�
  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
      // ����target������ָ�����۵�������id����ѡ��������û��target����ʹ��href���ֵ
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      // �ϲ�target�ϵ�data-���Ժʹ���Ԫ���ϵ�data-����
    var options = $.extend({}, $target.data(), $this.data())
      // ���ҵ���Ԫ�����Ƿ���data-slide-to����
      // ������ڣ���ȡ���������(��Ϊ����data-slide-to��ζ�����ֶ�������Ϊ�������ǲ���ѭ�����ŵ�)
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)  // ʵ�������

      // �ٴ��ж������������СԲȦdata-slide-to,
      // ��ֱ����ת������ͼ��($target.data('bs.carousel')�ǰ󶨵Ĳ��ʵ��)
    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()  // ��ֹĬ����Ϊ
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {  // �������з��Ϲ����Ԫ��
      var $carousel = $(this)
      $carousel.carousel($carousel.data())   // ʵ�������(���ռ�data-����)���Ա��Զ�����
    })
  })

}(jQuery);
