// 功能：加载数据结构
var tabs=new Array("名称","指标信息","指标意义","检查须知","实验室相关");

//加载导航栏的tab
function loadTab() {
    document.getElementById('tabs').innerHTML="hhhhhhh";
    var html="";
    for (var i=0;i<tabs.length;i++)
    {
        if(i==0){
            html+="<li class=\"tabBlock-tab is-active\">"+tabs[i]+"</li>";
        }
        else {
            html+="<li class=\"tabBlock-tab\">"+tabs[i]+"</li>";
        }
    }
    document.getElementById('tabs').innerHTML=html;
}

//获取用户基本信息
function getUserInfo() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var jsonObj = JSON.parse(xmlhttp.responseText);
            var j=0;
            var userInfo=new Array();
            for (var i in jsonObj["userInfo"][0]){
                //console.log(jsonObj["userInfo"][0][i]);
                userInfo[j]=jsonObj["userInfo"][0][i];
                j+=1;
            }
            //
            // console.log(userInfo[2])
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
                    case 6:itemData(userInfo[6]);
                    default:break;

                }
            }

        }
        else {
        }
    }
    xmlhttp.open("GET",'./getUserInfo',true);//获取用户信息 大佬改url
    xmlhttp.send();
}

//加载结构
function loadStru() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var jsonObj = JSON.parse(xmlhttp.responseText);
            var html=analyzingStrus(jsonObj);
            document.getElementById("contents").innerHTML=html;

        }
        else {
        }
    }
    xmlhttp.open("GET",'./bussiness2',true);//获取结构数据 大佬改url
    xmlhttp.send();

}

//分析结构数据 设计新旧数据的布局
function analyzingStrus(json) {
    var html='';
    var eid_value='';
    var name_value='';
    for(var ele in json){
        if(ele==='EID'){
            eid_value=json[ele];
            //console.log(eid_value);
        }
        else if(ele=='name'){
            name_value=json[ele];
        }
        else{
            if(ele==='DEF_1'){
                html+='<div class="tabBlock-pane" style="display: block">';
            }
            else{
                html+='<div class="tabBlock-pane" style="display: none">';
            }
            html+='<form action="##" id=form'+ele.charAt(ele.length-1)+'  class="form-horizontal" onsubmit="return false">';
            html+='<div class="container-fluid">'
            for(var prop in json[ele]){
                //console.log(json[ele][prop]);//DEF_n
                //console.log(json[ele][prop]["type"]);//type
                html+='<div class="row-fluid" style="display: table;padding:5px">';
                html+='<div class="span6" style="float: none;display: table-cell;height:auto;vertical-align: top;border:1px dashed#c0c0c0" >' ;
                html+=getObjectData(json[ele][prop],eid_value,"old");
                html+='</div>';//span6
                html+='<div class="span6" style="float: none;display: table-cell;vertical-align: top;height:100%;overflow: hidden;">' +
                    '<div class="box1" style="float:none;padding-left:10px;padding-right:3px;display: inline-block;vertical-align: top;height:inherit;width: 90%">';
                html+=getObjectData(json[ele][prop],eid_value,"new");
                html+='</div>';
                html+='&ensp;<div class="box2" style="display: inline-block;">' +
                    '<label class="checkbox"><input type="checkbox" value="" name="checkbox'+ele.charAt(ele.length-1)+'"/>存疑</label>' +
                    '</div></div>';//span6
                html+='</div>';
            }
            html+='</div></form></div>'
        }
    }
    html+='<div class="container-fluid">\n' +
        '\t<div class="row-fluid">\n' +
        '\t\t<div class="span12" id="submit-button-div">\n' +
        '\t\t\t <button id="next" class="btn btn-block btn-large btn-success" type="button" onclick="submit($(\'.tabBlock-tabs\'))">>></button>\n' +
        '\t\t</div>\n' +
        '\t</div>\n' +
        '</div>'
    return html;
}

//生成每项数据的结构
function getObjectData(json,eid,datatype) {
    var html="";
    html+='<label class="form-inline" style="font-weight: bold" >'+json["name"]+'</label>';//名称
    if(datatype==="old")
    {
        html+='<p  id="'+eid+'-'+json["propid"]+'">'+getOlddata(eid,json["propid"])+'</p>';
    }
    else if(datatype==="new")
    {
        if(json["type"]==="string"){

            html += '<textarea fid="'+json["propid"]+'" id="'+eid+'-'+json["propid"]+'-'+"new"+'" dtype="'+json["type"]+'" eid=' + eid + ' prop_id=' + json["propid"] + ' name="propname">' + getPropDataString(eid, json["propid"]) + '</textarea>'
        }
        else if(json["type"]==="select"){
            if (json["enum_list"] instanceof Array) {
                html += '<div class="side-by-side clearfix"><div class="side-by-side clearfix"><div>';
                html +='<select fid="'+json["propid"]+'" data-placeholder="" class="chosen-select" tabindex="5" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option fid="'+json["propid"]+'" id="'+eid+'-'+json["propid"]+'-'+"new"+'" dtype="'+json["type"]+'" eid=' + eid + ' prop_id=' + json["propid"] + ' value="">' + getPropDataString(eid, json["propid"]) + '</option>';
                for (var subProp in json["enum_list"]) {
                    //console.log(); //单层下拉列表值
                    html += '<option>' + json["enum_list"][subProp] + '</option>';
                }
                html += '</select></div></div></div>';
            } else if (json["enum_list"] instanceof Object) {
                html += '<div class="side-by-side clearfix"><div class="side-by-side clearfix"><div>';
                html +='<select fid="'+json["propid"]+'"  data-placeholder="qing" class="chosen-select" tabindex="5" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option fid="'+json["propid"]+'" id="'+eid+'-'+json["propid"]+'-'+"new"+'" dtype="'+json["type"]+'" eid=' + eid + ' prop_id=' + json["propid"] + ' value="">' + getPropDataString(eid, json["propid"]) + '</option>';
                for (var subTitle in json["enum_list"]) {
                    //console.log(subTitle);//list第一层名称
                    html += '<optgroup label=' + subTitle + '>'
                    for (var i in json["enum_list"][subTitle]) {
                        //console.log(json[ele][prop]["enum_list"][subTitle][i]);//list第二层名称
                        html += '<option>' + json["enum_list"][subTitle][i] + '</option>';
                    }
                    html += '</optgroup>';
                }
                html += '</select></div></div></div>'
            }
        }
        else if (json["type"]==="object"){
            if(json["name"]==="结果解读"){
                //如果是object类型还需要修改
                for(var i in json["fields"]){
                    html+='<label class="form-inline" style="font-weight: bold" >'+json["fields"][i]+'</label>';
                    html+='<textarea fid="'+json["propid"]+'" id="'+eid+'-'+json["propid"]+'-'+json["fields"][i] +'" eid=' + eid + ' prop_id=' + json["propid"] + ' name="propname">' + getPropDataO(eid, json["propid"],json["fields"][i]) + '</textarea>'
                }
            }
            else if(json["name"]==="建议与指导"){
                for(var i in json["fields"]){
                    html+='<label class="form-inline" style="font-weight: bold" >'+json["fields"][i]+'</label>';
                    html+='<textarea fid="'+json["propid"]+'" prop_id="'+json["fields"][i]+'" id="'+eid+'-'+json["propid"]+'-'+json["fields"][i] +'" eid=' + eid + ' prop_id=' + json["propid"] + ' name="propname">' + getPropDataO(eid, json["propid"],json["fields"][i]) + '</textarea>'
                }
            }
            else {
                for(var i in json["fields"]){
                    html+='<label class="form-inline" style="font-weight: bold" >'+json["fields"][i]+'</label>';
                    html+='<input prop_id="'+json["fields"][i]+'" fid="'+json["propid"]+'" type="text" id="'+eid+'-'+json["propid"]+'-'+json["fields"][i] +'"  eid=' + eid + ' data-role="tagsinput" value="'+getPropDataOt(eid, json["propid"],json["fields"][i])+'">';
                }
                //相关疾病、相关症状
            }
        }
        else if(json["type"]==="list"){
                var num=json["num"];
                var propid=json["propid"]
                var gender=new Array("男","女","无");
                var age=new Array("老人","成人","儿童","婴儿","无");
                html+='<div id="addItemPosition">'
                html+='<div class="itemC">';
                html+='<div style="float:left;width: 30%">'
                html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
                html +='<select name="lists" fid="'+json["propid"]+'" data-placeholder=""  class="chosen-select" tabindex="5" style="width: 100%"  sid="gender" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option value="" sid="gender" fid="'+json["propid"]+'" class="mylist" eid=' + eid + ' prop_id=' + json["propid"] + ' value="">' + getPropDataList(eid, json["propid"]) + '</option>';
                for (var g in gender) {
                    //console.log(); //单层下拉列表值
                    html += '<option>' + gender[g]  + '</option>';
                }
                html += '</select></div></div></div>';
                html+='</div>';//选择性别
                html+='<div style="float:left;width: 30%">'
                html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
                html +='<select name="lists" fid="'+json["propid"]+'" data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%"  sid="age" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option value="" sid="age" fid="'+json["propid"]+'" class="mylist"  eid=' + eid + ' prop_id= ' + json["propid"] + '  value=""></option>';
                for (var a in age) {
                    //console.log(); //单层下拉列表值
                    html += '<option>' + age[a] + '</option>';
                }
                html += '</select></div></div></div>';
                html+='</div>';//年龄选择
                html+='<div style="float: left; width: 25%"><input fid="'+json["propid"]+'" class="mylist" eid=' + eid + ' prop_id=' + json["propid"] + ' sid="fw" style="width: 100%" /></div>';
                html+='<div style="float: left;width: 15%"><button onclick=addItem("'+eid+'","'+propid+'","'+propid+'")>+</button></div>'
                html+='</div>';
            if(num>1) {
                for (var i=0;i<num-1;i++){
                   html+='<div class="itemC" style="float:left; width: 100%">';
                    html+='<div  style="float:left;width: 30%">'
                    html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
                    html +='<select name="lists" fid="'+json["propid"]+'" data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%" sid="gender" eid=' + eid + ' prop_id= ' + propid +'>';
                    html += '<option value="" sid="gender" fid="'+json["propid"]+'" class="mylist" eid=' + eid + ' prop_id=' + propid + ' value=""></option>';
                    for (var g in gender) {
                        //console.log(); //单层下拉列表值
                        html += '<option>' + gender[g]  + '</option>';
                    }
                    html += '</select></div></div></div>';
                    html+='</div>';//选择性别
                    html+='<div  style="float:left;width: 30%">'
                    html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
                    html +='<select name="lists" fid="'+json["propid"]+'"  data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%" sid="age" eid=' + eid + ' prop_id= ' + propid +'>';
                    html += '<option value="" sid="age" fid="'+json["propid"]+'" class="mylist"  eid=' + eid + ' prop_id= ' + propid + '  value=""></option>';
                    for (var a in age) {
                        //console.log(); //单层下拉列表值
                        html += '<option>' + age[a] + '</option>';
                    }
                    html += '</select></div></div></div>';
                    html+='</div>';//年龄选择
                    html+='<div  style="float: left; width: 25%"><input fid="'+json["propid"]+'" class="mylist" eid=' + eid + ' prop_id=' +propid + ' sid="fw" style="width: 100%"/></div>'//参考范围
                    html+='<div style="float: left;width: 15%"><button onclick="delItem($(\'button\'))">-</button></div>';
                   html+='</div>';
                }


            }
            html+='</div>';
        }

    }
    return html;
}
//获取旧数据
function getOlddata(eid,propid) {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var jsonObj = xmlhttp.responseText;

            document.getElementById(eid+'-'+propid).innerText=jsonObj;
        }
        else {
        }
    }
    xmlhttp.open("GET",'./getProp?propid='+propid+'&datatype=old',true); //请求旧表数据 大佬需要修改url 发送 eid、propid 数据类型 old 返回字符串
    xmlhttp.send();
}
//获取新数据
function getPropDataString(eid,propid) {
    //获取简单结构数据 如string 及select
    var xmlhttp;
    var a=1;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var jsonObj = xmlhttp.responseText;
            document.getElementById(eid+'-'+propid+'-'+"new").innerText=jsonObj;

        }
        else {
        }
    }
    xmlhttp.open("GET",'./getProp?propid='+propid+'&datatype=new',true); //请求旧表数据 大佬需要修改url 发送 eid、propid 数据类型 new 返回字符串
    xmlhttp.send();
}
function getPropData() {
    
}
function getPropDataO(eid,propid,name) {
    var xmlhttp;
    //console.log(eid+'-'+propid+'-'+name)
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var jsonObj = xmlhttp.responseText;
            document.getElementById(eid+'-'+propid+'-'+name).innerText=jsonObj;

        }
        else {
        }
    }
    xmlhttp.open("GET",'./getProp?propid='+propid+'&subpropid='+name+'&datatype=new',true); //请求新表数据 大佬需要修改url 发送 eid、propid name（高于正常值。。。） 返回字符串
    xmlhttp.send();
}

function getPropDataOt(eid,propid,name) {
    var xmlhttp;
    var jsonObj;
    console.log(eid+'-'+propid+'-'+name)
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
             jsonObj = xmlhttp.responseText;
            //document.getElementById("'eid+'-'+propid+'-'+name'").value=jsonObj;
        }
        else {
        }
    }
    xmlhttp.open("GET",'./getProp?propid='+propid+'&subpropid='+name+'&datatype=new',false); //请求新表数据 大佬需要修改url 发送 eid、propid name（高于正常值。。。） 返回字符串
    xmlhttp.send();
    return jsonObj;
}
function getPropDataList(eid,propid) {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            console.log('参考范围',xmlhttp.responseText)
            var jsonObj = JSON.parse(xmlhttp.responseText);

            for (var m in jsonObj){
                for (var n in jsonObj[m]){
                    console.log(jsonObj[m][n])
                }
            }
            var x=document.getElementsByClassName("mylist");
            var y=document.getElementsByName("lists");
            var l=x.length;
            var l1=l/3;
            for(var i=0;i<l1;i++){
                for (var j=0;j<3;j++){
                    if (j!=2){
                        console.log(y[i*2+j]);
                        // console.log($(".chosen-select").length)
                        // $(".chosen-select").val(jsonObj[i][j]);
                        for (var s=0;s<y[i*2+j].options.length;s++) {
                            if (y[i * 2 + j].options[s].text===jsonObj[i][j]){
                                y[i * 2 + j].options[s].selected=true;
                            }
                                }
                    }else{
                        x[i*3+j].value=jsonObj[i][j];
                    }
                }
            }

        }

        else {
        }
    }
    xmlhttp.open("GET",'./getProp?propid='+propid+'&datatype=new',true); //请求新表数据 大佬需要修改url 发送 eid、propid name（高于正常值。。。） 返回字符串
    xmlhttp.send();
}

function addItem(eid,propid,fpropid) {
    var html="";
    var gender=new Array("男","女","无");
    var age=new Array("老人","成人","儿童","婴儿","无");
    //html+='<div class="itemC" style="float: left; width: 100%">'
    html+='<div  style="float:left;width: 30%">'
    html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
    html +='<select name="lists" fid='+fpropid+' data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%" sid="gender" eid=' + eid + ' prop_id= ' + propid +'>';
    html += '<option sid="gender" eid=' + eid + ' prop_id=' + propid + ' value=""></option>';
    for (var g in gender) {
        //console.log(); //单层下拉列表值
        html += '<option>' + gender[g]  + '</option>';
    }
    html += '</select></div></div></div>';
    html+='</div>';//选择性别
    html+='<div  style="float:left;width: 30%">'
    html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
    html +='<select name="lists" fid='+fpropid+' data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%" sid="age" eid=' + eid + ' prop_id= ' + propid +'>';
    html += '<option sid="age" eid=' + eid + ' prop_id= ' + propid + '  value=""></option>';
    for (var a in age) {
        //console.log(); //单层下拉列表值
        html += '<option>' + age[a] + '</option>';
    }
    html += '</select></div></div></div>';
    html+='</div>';//年龄选择
    html+='<div   style="float: left; width: 25%"><input fid='+fpropid+' eid=' + eid + ' prop_id=' +propid + ' sid="fw" style="width: 100%" value=""/></div>'//参考范围
    html+='<div style="float: left;width: 15%"><button onclick="delItem($(\'button\'))">-</button></div>';
    //html+='</div>';
    //console.log("hhhhhhh")
    // $("#addItemPosition").append(html);
    var tmp=document.createElement('div');
    tmp.className='itemC'
    tmp.style.cssFloat='left';
    tmp.innerHTML=html;
    tmp.style.width='100%';
    document.getElementById("addItemPosition").appendChild(tmp);
}
function delItem(item) {
    //console.log(item.parents('.itemC'));
    console.log(item.closest('.itemC:first'))
    //console.log(item.parents('.itemC').length);
    //item.parents('.itemC')[item.parents('.itemC').length-item.parents('.itemC').index()-1].remove();
    //item.closest('.itemC:first').remove();
    item.parents('.itemC')[0].remove();
}


function searchItem() {
    var str=document.getElementById('searchBox').value;
    var category=document.getElementById('sel').value;

    if (str === "" ){

        alert("请输入要搜索的指标名称！")

    }else {
        var result = new Object();
        result['str'] = str;
        result['category'] = category;
        $.ajax({
            //几个参数需要注意一下
            type: "POST",//方法类型
            dataType: "json",//预期服务器返回的数据类型
            url: "./search",//url 大佬需要修改的路径
            data: JSON.stringify(result),
            success: function (result) {
                console.log(result);//打印服务端返回的数据(调试用)
                if (result.resultCode == 200) {
                    window.location.href = '/index?eid=lkai.ent.'+str
                }else {
                    alert("搜索的指标不存在");
                };
            },
            error: function () {
                alert("hhh");
            }
        });
    }
}