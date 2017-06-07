# layuiPlus（文档完善中。。。）

公司项目的一些补充插件（some addtional plug-ins for company.）

## 特性
- 基于 layui 样式 [layui文档](https://github.com/sentsin/layui/)
- 基于 jquery工具 [jquery](https://github.com/jquery/jquery)
- 在下拉列表中对列宽的调整引用了 colResizable工具 [colResizable](https://github.com/alvaro-prieto/colResizable)
- 仅引用layui样式，对其js库没有依赖可以不引入

## 目录结构
```bash
├── /dist/           # 项目构建输出目录
├── /lib/            # 项目依赖其他库的引入文件
├── /src/            # 项目开发源码目录
├── demo.html     	 # 项目演示文件
└── README.md  		 # 项目说明文档
```

## 使用简介
### 文件引入layui.css、jquery、和layuiPlus
```html
<!-- ... -->
<link rel="stylesheet" type="text/css" href="lib/layui.css">
<!-- ... -->
<script type="text/javascript" src="lib/jquery.min.js"></script>
<script type="text/javascript" src="dist/layui-plus0.1.js"></script>
<!-- ... -->
```
### 核心代码示例
```javascript
let mycombogrid = new Combogrid();
mycombogrid.init({
    // 对应要转换为控件的dom对象
    dom: document.getElementById('mycombogrid'),
    datagrid: {
        // 弹出表格的宽度单位PX
        width: 400,
        // 写入input对应的列名
        textField: 'mc',
        // 列设置其中align有（left、center、right）
        columns: [{
            field: 'dm',
            title: 'dm',
            width: 60,
            align: 'left',
        }, {
            field: 'id',
            title: 'id',
            width: 100,
            align: 'center',
        }, {
            field: 'mc',
            title: 'mc',
            width: 120,
            align: 'center',
        }, {
            field: 'rn',
            title: 'rn',
            width: 100,
            align: 'right',
        }],
        // 加载成功回调函数
        loadSuccess: function(keyword, pageNum, pageSize) {
            let newSrc = {
                pageNumber: pageNum + '',
                pageSize: pageSize + '',
                jsm: keyword,
                lx: "01"
            }
            let param = {
                "data": JSON.stringify(newSrc)
            };
            $.ajax({
                url: 'http://125.69.67.12:7080/hisapi/rest/queryDataBySql/000217/5',
                type: "POST",
                data: param,
                async: false,
                success: function(res) {
                    let dataObj = JSON.parse(res);
                    // 传入页码信息
                    let pageInfo = {
                        pageNum: pageNum,
                        pageSize: pageSize,
                        totalPage: Math.ceil(dataObj.data.total / pageSize)
                    }
                    // 加载完成写入数据
                    mycombogrid.setData(dataObj.data.rows, pageInfo);
                }
            });
        },
        // 行选中回调函数
        selectRow: function(rowData) {
            console.log(rowData);
        }
    }
});
```

## 有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(419like#163.com, 把#换成@)
* QQ: 897996541
* github: [layuiPlus](https://github.com/419like/layuiPlus)