let tabs=["名称","指标信息","指标意义","检查须知","实验室相关"];
let contents = [["报告名称\xa0\xa0\xa0\xa0\xa0", "首字母缩写\xa0\xa0", "别\xa0\xa0\xa0\xa0\xa0\xa0称\xa0\xa0\xa0\xa0\xa0\xa0", "英文名称\xa0\xa0\xa0\xa0\xa0", "英文缩写\xa0\xa0\xa0\xa0\xa0", "大红本编码\xa0"],
            ["定义\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0", "科室归类\xa0\xa0\xa0\xa0", "人群划分\xa0\xa0\xa0\xa0", "检查归类\xa0\xa0\xa0\xa0", "是否空腹\xa0\xa0\xa0\xa0", "参考价格\xa0\xa0\xa0\xa0", "适宜人群\xa0\xa0\xa0\xa0", "不适宜人群\xa0", "何时检测\xa0\xa0\xa0\xa0", "何地检测\xa0\xa0\xa0\xa0", "出单时间\xa0\xa0\xa0\xa0"],
            ["临床意义\xa0\xa0\xa0\xa0", "参考范围\xa0\xa0\xa0\xa0", "结果解读\xa0\xa0\xa0\xa0", "相关疾病\xa0\xa0\xa0\xa0", "相关症状\xa0\xa0\xa0\xa0", "建议与指导\xa0"],
            ["检查过程\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0", "检查注意事项\xa0\xa0\xa0\xa0", "不良反应与风险\xa0"],
            ["检测方法\xa0", "样本要求\xa0", "采样要求\xa0", "保存条件\xa0", "拒收标准\xa0"]];



function loadTab(tabs) {
    var html="";
    for (var i=0;i<tabs.length;i++)
    {
        if(i===0){
            html+="<li class=\"tabBlock-tab is-active\">"+tabs[i]+"</li>";
        }
        else {
            html+="<li class=\"tabBlock-tab\">"+tabs[i]+"</li>";
        }

    }
    return html;
}
//还需要为每个textarea赋值
function loadTabContents(tabs,contents,values_old,values_new,userInfo) {
    var html='';
    for (var n=0;n<userInfo.length;n++){
        switch (n) {
            case 0:document.getElementById('userName').innerText=userInfo[0];
                break;
            case 1:document.getElementById('itemName').innerText=userInfo[1];
                break;
            case 2:document.getElementById('finishedNumber').innerText=userInfo[2];
                break;
            case 3:document.getElementById('unfinishNumber').innerText=userInfo[3];
                break;
            case 4:document.getElementById('all').innerText=userInfo[4];
                break;
            case 5:document.getElementById('doubt').innerText=userInfo[5];
                break;

        }
    }
    for (var i=0;i<tabs.length;i++){
        html+=''
        if(i==0){
            html+='<div class="tabBlock-pane" style="display: block">';
        }
        else{
            html+='<div class="tabBlock-pane" style="display: none">';
        }
        html+='<form action="##" id=form'+i+'  class="form-horizontal" onsubmit="return false">';
        html+='<div class="container-fluid">'
        html+='<div class="row-fluid">'
        html+='<div class="span6" sty><h5>参考数据：</h5></div><div  class="span6"><h5>校验数据：</h5></div>'
        html+='</div>'
        for (var j=0;j<contents[i].length;j++){
            html+='<div class="row-fluid" style="display: table;padding:5px">';
            html+='<div class="span6" style="float: none;display: table-cell;height:auto;vertical-align: top;border:1px dashed#c0c0c0" ><div class="box1" style="display: inline-block;">' +
                '<label class="form-inline" style="font-weight: bold" >'+contents[i][j]+'</label>'+
                '<div name="text1" required="required" style="width: 80%" id="content"'+j+' >'+values_old[i][j]+'</div>' +
                '</div>';
            html+='</div>';
            // html+='<div class="span2"></div>'
            html+='<div class="span6" style="float: none;display: table-cell;vertical-align: top;height:100%;overflow: hidden;">' +
                '<div class="box1" style="float:none;padding-left:10px;padding-right:3px;display: inline-block;vertical-align: top;height:inherit;width: 80%">' +
                '<label class="form-inline" style="font-weight: bold" >'+contents[i][j]+'</label>'+
                '<div  name="text1" required="required" style="width: 100%;height:inherit" id=content'+i+j+'  >'+values_new[i][j]+'</div>' +
                '</div>';
            html+='&ensp;<div class="box2" style="display: inline-block">' +
                '<label class="checkbox"><input type="checkbox" name="checkbox'+i+'" id="check"'+j+' value='+j+'>存疑</label>' +
                '</div></div>';
            html+='</div>';
        }
        html+='</div></form></div>'
        // html+='<div class="row-fluid">'
        // html+='<div class="span6"><h5>参考数据：</h5>';
        // for (var j=0;j<contents[i].length;j++){
        //     html+='<div class="container" ><div class="box1" style="display: inline-block"><label class="form-inline"  >'+contents[i][j]+'<div name="texta" required="required" style="width: 279px;height: 77px" id="content_"'+j+' >'+values_old[i][j]+'</div></label></div>';
        //     html+='&ensp;<div class="box2" style="display: inline-block"></div></div>';
        // }
        // html+='</div>';
        // html+='<div class="span6"><h5>校验数据：</h5><form action="##" id=form'+i+'  class="form-horizontal" onsubmit="return false">';
        // for (var j=0;j<contents[i].length;j++){
        //
        //     html+='<div class="container" ><div class="box1" style="display: inline-block"><label class="form-inline"  >'+contents[i][j]+'<div  name="texta" required="required" style="width: 279px;height: 77px" id=content'+i+j+'  >'+values_new[i][j]+'</div></label></div>';
        //     html+='&ensp;<div class="box2" style="display: inline-block"><label class="checkbox"><input type="checkbox" name="checkbox'+i+'" id="check"'+j+' value='+j+'>存疑</label></div></div>';
        // }
        // html+='</form></div>';
        // html+='</div></div>';

    }
    html+='<div class="container-fluid">\n' +
        '\t<div class="row-fluid">\n' +
        '\t\t<div class="span12">\n' +
        '\t\t\t <button id="next" class="btn btn-block btn-large btn-success" type="button" onclick="submit($(\'.tabBlock-tabs\'))">>></button>\n' +
        '\t\t</div>\n' +
        '\t</div>\n' +
        '</div>'
    return html;
}
function countNumber() {
    //计算完成数量

}

function searchItem(){
    //alert("a")
    document.getElementById('tabs').innerHTML=loadTab(tabs);
    var xmlhttp;
    var str=document.getElementById('searchBox').value;
    var category=document.getElementById('sel').value;
    //alert(str);
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        //alert(window.XMLHttpRequest+"2")
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var jsonObj = JSON.parse(xmlhttp.responseText);
            loadSearchContents(jsonObj);
            //document.getElementById('content00').focus()
        }
        else {
        }
    };
    xmlhttp.open("GET","./bussiness/",true);//传送类别及搜索内容
    xmlhttp.send();
}
function searchItem_s(){
    //alert("a")
    document.getElementById('tabs').innerHTML=loadTab(tabs);
    var xmlhttp;
    var str=document.getElementById('searchBox').value;
    var category=document.getElementById('sel').value;
    //alert(str);
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        //alert(window.XMLHttpRequest+"2")
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var jsonObj = JSON.parse(xmlhttp.responseText);
            loadSearchContents(jsonObj);
            //document.getElementById('content00').focus()
        }
        else {
        }
    };
    xmlhttp.open("GET","./bussiness_search/?str="+str,true);//传送类别及搜索内容
    xmlhttp.send();
}
//查找、完成、页面重新加载均调用此方法
function loadSearchContents(json){
    var values_new=new Array();
    var values_old=new Array();
    var checks=new Array();
    var userInfo = new Array();
    var i=0;
    for (var ele in json){
        //ele 每个板块的信息的名称
        i=i+1;
        values_old[i-1]=new Array();
        values_new[i-1]=new Array();
        var j=0;
        for (var key in json[ele][0]) {
            //console.log(key)
             var html_old='';
             var html_new='';
             var val = json[ele][0][key];//每一条指标项的值
             j = j + 1;
             if (i == 1) {
                 userInfo[j - 1] = json[ele][0][key]//存储用户信息
             }
             //if (key != "doubt"&&i!=1) {
            else {
                if(val instanceof Object){
                    for(var ele1 in val){
                        if(ele1==='prop_new'){
                            console.log($.isEmptyObject(val[ele1]));
                            if ($.isEmptyObject(val[ele1])){
                                html_new+='<div style="padding: 5px;height: 100%"><textarea name="texta"style="display: inline-block;height: 100% ">暂无数据</textarea></div>';
                            }
                            else {
                                for (s in val[ele1]) {
                                    html_new += getMyHtmlNew(val[ele1][s],1);
                                }
                            }
                            //console.log(html_new);

                        }
                        if (ele1==='prop_old'){
                            if (val[ele1]==null){
                                //html_old='<br/><textarea style="display: inline-block"></textarea></div>'
                            }
                            else {
                                for (s in val[ele1]) {
                                    html_old += getMyHtml(val[ele1][s],2);
                                }
                            }
                            //console.log(html_old);
                        }
                    }
                }
                else {
                    console.log(val);
                    checks[i - 2] =val;
                    //check
                }
                 values_old[i - 2][j - 1] = html_old;
                 values_new[i - 2][j - 1] = html_new;
                }


         }

    }
    var html=loadTabContents(tabs,contents,values_old,values_new,userInfo);
    document.getElementById("contents").innerHTML=html
    checkboxs(checks);
}
function getMyHtmlNew(json,c) {
    console.log(typeof json)
    //console.log(typeof json)
    var html = '';
    if ($.isEmptyObject(json)) {
        // console.log("123321")
        html += '<div style="padding: 5px"><textarea  name="texta" style="display: inline-block">暂无数据</textarea></div>';
    }
    for (var ele in json) {
        //console.log(ele)
        //console.log(json[ele])
        if (json[ele] instanceof Array || json[ele] instanceof Object) {
            html += '<div style="padding: 5px">';
            //console.log(json[ele])
            for (var ele1 in json[ele]) {
                //console.log( typeof json[ele][ele1]);
                //console.log(json[ele][ele1]['value'])
                html += getMyHtml(json[ele][ele1], c);
            }
            html += '</div>'

        } else {
            html+='<div style="padding: 5px">';
            // if (ele === 'origin') {

                // html += '<div style="display: inline-block">' + '来源：' + json['origin'] + '</div>'
            // }
            if (ele === 'name') {
                html += '<div style="display: inline-block">' + json['name'] + '</div>\n'
            }
            if (ele === 'value') {
                if (c === 1) {
                    html += '<br/><textarea name="texta" style="display: inline-block">' + json['value'] + '</textarea>'
                } else {
                    html += '<br/><p style="display: inline-block" readonly="readonly">' + json['value'] + '</p>'
                }


            }
            html+='</div>';


        }

    }
    return html;
}
function getMyHtml(json,c) {
    console.log(typeof json)
    //console.log(typeof json)
    var html='';
    if ($.isEmptyObject(json)){
        // console.log("123321")
        html+='<div style="padding: 5px"><textarea   style="display: inline-block">暂无数据</textarea></div>';
    }
    for(var ele in json){
        //console.log(ele)
        //console.log(json[ele])
        if( json[ele] instanceof Array || json[ele] instanceof Object){
            html+='<div style="padding: 5px">';
            //console.log(json[ele])
            for (var ele1 in json[ele]){
                //console.log( typeof json[ele][ele1]);
                //console.log(json[ele][ele1]['value'])
                html+=getMyHtml(json[ele][ele1],c);
            }
            html+='</div>'

        }
        else {
            if (ele==='origin'){

                html+='<div style="padding: 5px"><div style="display: inline-block">'+'来源：'+json['origin']+'</div>'
            }
            if (ele==='name'){
                html+='<div style="display: inline-block">'+json['name']+'</div>\n'
            }
            if(ele==='value'){
                if(c==1){
                    html += '<br/><textarea style="display: inline-block">' + json['value'] + '</textarea></div>'
                }
                else{
                html += '<br/><p style="display: inline-block" readonly="readonly">' + json['value'] + '</p></div>'};

            }

        }

    }
    return html;
}
function checkboxs(che) {
    for(var i=0;i<che.length;i++){
        var val=che[i].split(",");
        var boxes = document.getElementsByName("checkbox"+i);
        for(var j=0;j<boxes.length;j++){
            for(var k=0;k<val.length;k++){
                if(boxes[j].value === val[k]){
                    boxes[j].checked = true;
                    break
                }
            }
        }
    }
}


function validate_required(field,alerttxt)
{
    with (field)
    {
        if (value==null||value=="")
        {alert(alerttxt);return false}
        else {return true}
    }
}

function validate_form(thisform)
{
    with (thisform)
    {
        //var texts=document.getElementsByName("text");

        if (validate_required(texta,"有缺失项")==false)
        {texta.focus();return false}
    }
}
//关于文本框高度无法自动填充的问题  自动填充父元素剩余空间