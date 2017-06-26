/**
 
 @Name : layui.laypage 分页组件
 @Author：贤心
 @License：MIT
 
 */

layui.define(function(exports){
  "use strict";

  function laypage(options){
    var skin = 'laypagecss';
    new Page(options);
  }

  var doc = document, id = 'getElementById', tag = 'getElementsByTagName';
  var index = 0, Page = function(options){
    var that = this;
    var conf = that.config = options || {};
    conf.item = index++;
    that.render(true);
  };

  Page.on = function(elem, even, fn){
    elem.attachEvent ? elem.attachEvent('on'+ even, function(){
      fn.call(elem, window.even); //for ie, this指向为当前dom元素
    }) : elem.addEventListener(even, fn, false);
    return Page;
  };

  //判断传入的容器类型
  Page.prototype.type = function(){
    var conf = this.config;
    if(typeof conf.cont === 'object'){
      return conf.cont.length === undefined ? 2 : 3;
    }
  };

  //分页视图
  Page.prototype.view = function(){
    var that = this, conf = that.config, view = [], dict = {};
    conf.pages = conf.pages|0;
    conf.curr = (conf.curr|0) || 1;
    conf.groups = 'groups' in conf ? (conf.groups|0) : 5;
    conf.first = 'first' in conf ? conf.first : '&#x9996;&#x9875;';
    conf.last = 'last' in conf ? conf.last : '&#x672B;&#x9875;';
    conf.prev = 'prev' in conf ? conf.prev : '&#x4E0A;&#x4E00;&#x9875;';
    conf.next = 'next' in conf ? conf.next : '&#x4E0B;&#x4E00;&#x9875;';
    if(conf.pages <= 0){
      return '';
    }
    
    if(conf.groups > conf.pages){
      conf.groups = conf.pages;
    }
    
    //计算当前组
    dict.index = Math.ceil((conf.curr + ((conf.groups > 1 && conf.groups !== conf.pages) ? 1 : 0))/(conf.groups === 0 ? 1 : conf.groups));
    
    //当前组非首组，则输出首页
    if(dict.index > 1 && conf.first && conf.groups !== 0){
      view.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+ conf.first +'</a>');
    }
    
    //当前页非首页，则输出上一页
    if(conf.curr > 1 && conf.prev){
      view.push('<a href="javascript:;" class="layui-laypage-prev" data-page="'+ (conf.curr - 1) +'">'+ conf.prev +'</a>');
    }
    
    //输出当前页组
    dict.poor = Math.floor((conf.groups-1)/2);
    dict.start = dict.index > 1 ? conf.curr - dict.poor : 1;
    dict.end = dict.index > 1 ? (function(){
      var max = conf.curr + (conf.groups - dict.poor - 1);
      return max > conf.pages ? conf.pages : max;
    }()) : conf.groups;
    if(dict.end - dict.start < conf.groups - 1){ //最后一组状态
      dict.start = dict.end - conf.groups + 1;
    }
    for(; dict.start <= dict.end; dict.start++){
      if(dict.start === conf.curr){
        view.push('<span class="layui-laypage-curr"><em class="layui-laypage-em" '+ (/^#/.test(conf.skin) ? 'style="background-color:'+ conf.skin +';"' : '') +'></em><em>'+ dict.start+'/'+conf.pages +'</em></span>');
      } else {
        view.push('<a href="javascript:;" data-page="'+ dict.start +'">'+ dict.start +'</a>');
      }
    }
    
      //当前页不为尾页时，输出下一页
    dict.flow = !conf.prev && conf.groups === 0;
    if(conf.curr !== conf.pages && conf.next || dict.flow){
      view.push((function(){
        return (dict.flow && conf.curr === conf.pages) 
        ? '<span class="layui-laypage-nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+ conf.next +'</span>'
        : '<a href="javascript:;" class="layui-laypage-next" data-page="'+ (conf.curr + 1) +'">'+ conf.next +'</a>';
      }()));
    }
    //总页数大于连续分页数，且当前组最大页小于总页，输出尾页
    if(conf.pages > conf.groups && dict.end < conf.pages && conf.last && conf.groups !== 0){
       view.push('<a href="javascript:;" class="layui-laypage-last" title="&#x5C3E;&#x9875;"  data-page="'+ conf.pages +'">'+ conf.last +'</a>');
    }
    

    return '<div class="layui-box layui-laypage layui-laypage-'+ (conf.skin ? (function(skin){
      return /^#/.test(skin) ? 'molv' : skin;
    }(conf.skin)) : 'default') +'" id="layui-laypage-'+ that.config.item +'">'+ view.join('') + function(){
      return conf.skip 
      ? '<span class="layui-laypage-total">&#x5230;&#x7B2C; <input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" value="'+ conf.curr +'" class="layui-laypage-skip"> &#x9875; '
      + '<button type="button" class="layui-laypage-btn">&#x786e;&#x5b9a;</button></span>' 
      : '';
    }()+'<span style="float:right;">共'+ conf.total +'条记录</span>'  + function(){
    	return conf.changepagesize ? 
    	'<span class="laypage_total" style="width:100px;float:right;">'
    	+ '<label>每页</label>'
    	+ '<select id="ddlPageSize" name="pagesize" style="color:rgb(153,153,153);height: 24px;line-height: 24px;width: 40px;margin: 0 5px;">'
    	+ (conf.pageSize == 5 ? '<option value="5" selected="selected">5</option>' : '<option value="5">5</option>')
    	+ (conf.pageSize == 10 ? '<option value="10" selected="selected">10</option>' : '<option value="10">10</option>')
    	+ (conf.pageSize == 20 ? '<option value="20" selected="selected">20</option>' : '<option value="20">20</option>')
    	+ (conf.pageSize == 30 ? '<option value="30" selected="selected">30</option>' : '<option value="30">30</option>')
    	+ (conf.pageSize == 40 ? '<option value="40" selected="selected">40</option>' : '<option value="40">40</option>')
    	+ (conf.pageSize == 50 ? '<option value="50" selected="selected">50</option>' : '<option value="50">50</option>')
    	+ '</select><label>条</label></span>'
    	: '';
    }() + '</div>';
  };

  //跳页
  Page.prototype.jump = function(elem){
    if(!elem) return;
    var that = this, conf = that.config, childs = elem.children;
    var btn = elem[tag]('button')[0];
    var input = elem[tag]('input')[0];
    for(var i = 0, len = childs.length; i < len; i++){
      if(childs[i].nodeName.toLowerCase() === 'a'){
        Page.on(childs[i], 'click', function(){
          var curr = this.getAttribute('data-page')|0;
          conf.curr = curr;
          that.render();
          
        });
      }
    }
    if(btn){
      Page.on(btn, 'click', function(){
        var curr = input.value.replace(/\s|\D/g, '')|0;
        if(curr && curr <= conf.pages){
          conf.curr = curr;
          that.render();
        }
      });
    }
    if(input){
    	Page.on(input, 'keyup', function(e){
    		if(e.keyCode === 13){
    			var curr = input.value.replace(/\s|\D/g, '')|0;
		        if(curr && curr <= conf.pages){
		          conf.curr = curr;
		          that.render();
		        }
    		}
       
      });
    }
  };

  	//增加每页显示条数控制的支持
	Page.prototype.selectpagesize = function(){
		var that = this, conf = that.config;
		var elem = doc[id]('layui-laypage-' + conf.item);
		var selectObj = elem[tag]('select')[0];
		if (selectObj) {
			Page.on(selectObj, 'change', function(){
				var index = selectObj.selectedIndex;
				conf.pageSize = selectObj.options[index].value;
				conf.curr = 1; //修改每页显示条数时，重设定当前页码为1
				that.render();
			});
		}
	};
  //渲染分页
  Page.prototype.render = function(load){
    var that = this, conf = that.config, type = that.type();
    var view = that.view();
    if(type === 2){
      conf.cont.innerHTML = view;
    } else if(type === 3){
      conf.cont.html(view);
    } else {
      doc[id](conf.cont).innerHTML = view;
    }
    conf.jump && conf.jump(conf, load, that);
    that.jump(doc[id]('layui-laypage-' + conf.item));
    if(conf.hash && !load){
      location.hash = '!'+ conf.hash +'='+ conf.curr;
    }
    that.selectpagesize();
  };
  
  Page.prototype.render_view = function(load){
    var that = this, conf = that.config, type = that.type();
    var view = that.view();
    if(type === 2){
      conf.cont.innerHTML = view;
    } else if(type === 3){
      conf.cont.html(view);
    } else {
      doc[id](conf.cont).innerHTML = view;
    }
    that.jump(doc[id]('layui-laypage-' + conf.item));
    if(conf.hash && !load){
      location.hash = '!'+ conf.hash +'='+ conf.curr;
    }
    that.selectpagesize();
    
  };
  
  exports('laypage', laypage);

});