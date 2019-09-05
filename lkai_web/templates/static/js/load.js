var tabs=new Array("名称","指标信息","指标意义","检查须知","实验室相关");

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
function loadContent() {
    var str=document.getElementById('searchBox').value;
    var category=document.getElementById('sel').value;
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
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
    xmlhttp.open("GET",'./bussiness2',true);//传送类别及搜索内容
    xmlhttp.send();
}
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

            //console.log(name_value);
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
                html+=getObjectData(json[ele][prop],json[ele][prop]["propid"],eid_value,"old");
                html+='</div>';//span6
                html+='<div class="span6" style="float: none;display: table-cell;vertical-align: top;height:100%;overflow: hidden;">' +
                    '<div class="box1" style="float:none;padding-left:10px;padding-right:3px;display: inline-block;vertical-align: top;height:inherit;width: 90%">';
                html+=getObjectData(json[ele][prop],json[ele][prop]["propid"],eid_value,"new");
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
function submit($tab) {
    var atab=$tab.find('.tabBlock-tab.is-active');
    var forms=document.forms[(atab.index())].elements;
    // console.log('#form'+(atab.index()+1))
    // console.log($('#form'+(atab.index()+1)).serialize())
    //console.log(forms);
    var result=new Array();
    var j=0;
    result[0]=new Object();
    var obj=new Object();
    var m=0;
    var o=0;
    var p=0;
    var q=0;
    for (var i=0;i<forms.length;i++){
        //console.log(forms[i].type);
        if(forms[i].getAttribute("fid")!==null){
        if (forms[i].type==="textarea"||forms[i].type==="select-one"||forms[i].type==="text"){ //加&&
            if(forms[i].getAttribute("prop_id")==="lkai.prop.参考范围") {
                //console.log("参考范围参考范围")
                if (forms[i].getAttribute("sid") === "gender") {
                    // console.log("性别性别")
                    result[j].eid = forms[i].getAttribute("eid");
                    //console.log(result[j].eid)
                    result[j].propid = forms[i].getAttribute("prop_id");
                    if (m === 0) {
                        result[j].value = new Array();
                    }
                    result[j].value.push(new Object());
                    result[j].value[m].gender = forms[i].value;
                } else if (forms[i].getAttribute("sid") === "age") {
                    result[j].value[m].age = forms[i].value;
                } else if (forms[i].getAttribute("sid") === "fw") {
                    result[j].value[m].fw = forms[i].value;
                    m += 1;
                }

                // }else if(forms[i].getAttribute("prop_id")==="lkai.prop.高于正常值"||forms[i].getAttribute("prop_id")==="lkai.prop.低于正常值"||forms[i].getAttribute("prop_id")==="lkai.prop.阳性"){
            }else if(forms[i].getAttribute("fid")==="lkai.prop.结果解读"){
                if(forms[i].getAttribute("prop_id")==="lkai.prop.高于正常值") {
                    result[j].eid = forms[i].getAttribute("eid");
                    result[j].propid = "lkai.prop.结果解读";
                    result[j].value=new Object();
                    result[j].value.high=new Object();
                    result[j].value.high.propid=forms[i].getAttribute("prop_id");
                    result[j].value.high.value=forms[i].value;
                }else if(forms[i].getAttribute("prop_id")==="lkai.prop.低于正常值"){
                    result[j].value.low=new Object();
                    result[j].value.low.propid=forms[i].getAttribute("prop_id");
                    result[j].value.low.value=forms[i].value;
                }
                else if(forms[i].getAttribute("prop_id")==="lkai.prop.阳性"){
                    result[j].value.other=new Object();
                    result[j].value.other.propid=forms[i].getAttribute("prop_id");
                    result[j].value.other.value=forms[i].value;
                }

            }
            else if(forms[i].getAttribute("fid")==="lkai.prop.相关疾病"||forms[i].getAttribute("fid")==="lkai.prop.相关症状"||forms[i].getAttribute("fid")==="lkai.prop.建议与指导") {
              //  console.log("没错没错没错"+forms[i].getAttribute('prop_id') )
                if(forms[i].getAttribute("prop_id")==="lkai.prop.高于正常值") {
                    result[j].eid = forms[i].getAttribute("eid");
                    result[j].propid =forms[i].getAttribute("fid") ;
                    result[j].value=new Object();
                    result[j].value.high=new Object();
                    result[j].value.high.propid=forms[i].getAttribute("prop_id");
                    result[j].value.high.value=forms[i].value;
                }else if(forms[i].getAttribute("prop_id")==="lkai.prop.低于正常值"){
                    result[j].value.low=new Object();
                    result[j].value.low.propid=forms[i].getAttribute("prop_id");
                    result[j].value.low.value=forms[i].value;
                }
                else if(forms[i].getAttribute("prop_id")==="lkai.prop.阳性"){
                    result[j].value.other=new Object();
                    result[j].value.other.propid=forms[i].getAttribute("prop_id");
                    result[j].value.other.value=forms[i].value;
                }

            }
            else {
                result[j].eid = forms[i].getAttribute("eid");
                //console.log(forms[i].getAttribute("eid"))
                result[j].propid = forms[i].getAttribute("prop_id");
                result[j].value = forms[i].value;
            }
        }}
        if(forms[i].type==="checkbox"){
            result[j].ischecked=forms[i].checked;
            j=j+1;
            result[j]=new Object();
        }
    }
    $atab=$tab.find('.tabBlock-tab.is-active');
    var formIndex = $atab.next().index();
    if (formIndex===-1){
        formIndex = 5;
    }
    result[j] = formIndex;

    change($tab)    
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "./getEdit" ,//url 大佬需要修改的路径
        data: JSON.stringify(result),
        success: function (result) {
            //console.log(result);//打印服务端返回的数据(调试用)
            if (result.resultCode == 200) {
                alert("SUCCESS");
                change($tab)

            };

        },
        error : function() {
            //alert("hhh");
        }
    });

}
function change($tab) {
    $atab=$tab.find('.tabBlock-tab.is-active');
    //alert('content'+$atab.next().index()+0)
    // document.getElementById('content'+$atab.index()+0).blur();
    // document.getElementById('content'+$atab.next().index()+0).focus();//focus前不能使用alert
    $tabBlock=$('.tabBlock')
    $panes = $tabBlock.find('.tabBlock-pane');
    $activeTab = $tabBlock.find('.tabBlock-tab.is-active');
    $panes.hide();
    $($panes[$activeTab.index()]).show();
    var $context = $atab.next().closest('.tabBlock');

    if (!$atab.next().hasClass('is-active')) {
        $atab.next().siblings().removeClass('is-active');
        $atab.next().addClass('is-active');
        TabBlock.showPane($atab.next().index(), $context);
    }
    if($atab.next().index()==4){
        document.getElementById('next').innerText='保存此条数据';
        document.getElementById('next').onclick=function ( ) {
            submit($tab);
            //console.log("数据保存")
            sendStatus();
        }
        var myDiv=document.getElementById('submit-button-div');
        var button1 = '<button id="nextData" class="btn btn-block btn-large btn-success" type="button" onclick=getNextData()>下一项</button>'
        myDiv.innerHTML+=button1;

    }

}
function sendStatus() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            alert("保存成功");

        }
        else {
            alert("失败")
        }
    }
    xmlhttp.open("GET",'new.json',true);//发送一个url来改变数据状态
    xmlhttp.send();
}
function getNextData() {
    window.location.reload();
}
function getUserInfo() {
    //获取用户基本信息
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
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
                console.log(jsonObj["userInfo"][0][i]);
                userInfo[j]=jsonObj["userInfo"][0][i];
                j+=1;
            }
            console.log(userInfo[2])
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
    xmlhttp.open("GET",'./getUserInfo',true);//传送类别及搜索内容
    xmlhttp.send();

}
function getPropData(eid,propid,datatype) {
    var xmlhttp;
    var myvalue="";
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            
            myvalue=xmlhttp.responseText;
        }
        else {
            //console.log("失败")
        }
    }
    xmlhttp.open("GET",'./getProp?propid='+propid+'&datatype='+datatype,false);//传送类别及搜索内容
    xmlhttp.send();
    return myvalue;
}
function dataProcess() {

}
function getObjectData(json,fpropid,eid,datatybe) {
    var html='';
    html+='<label class="form-inline" style="font-weight: bold" >'+json["name"]+'</label>';
    //console.log(json);

    if(json["type"]==="string"){
        if(json["name"]==="参考范围"){
            if (datatybe=='new'){
                var propid=json["propid"]
                var gender=new Array("男","女","无");
                var age=new Array("老人","成人","儿童","婴儿","无");
                html+='<div id="addItemPosition">'
                html+='<div class="itemC">';
                html+='<div style="float:left;width: 30%">'
                html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
                html +='<select data-placeholder=""  class="chosen-select" tabindex="5" style="width: 100%" fid='+fpropid+' sid="gender" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option eid=' + eid + ' prop_id=' + json["propid"] + ' value="">' + getPropData(eid, json["propid"],datatybe) + '</option>';
                for (var g in gender) {
                    //console.log(); //单层下拉列表值
                    html += '<option>' + gender[g]  + '</option>';
                }
                html += '</select></div></div></div>';
                html+='</div>';//选择性别
                html+='<div style="float:left;width: 30%">'
                html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
                html +='<select data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%" fid='+fpropid+' sid="age" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option  eid=' + eid + ' prop_id= ' + json["propid"] + '  value="">' + getPropData(eid, json["propid"],datatybe) + '</option>';
                for (var a in age) {
                    //console.log(); //单层下拉列表值
                    html += '<option>' + age[a] + '</option>';
                }
                html += '</select></div></div></div>';
                html+='</div>';//年龄选择
                html+='<div style="float: left; width: 25%"><input fid='+fpropid+' eid=' + eid + ' prop_id=' + json["propid"] + ' sid="fw" style="width: 100%" value="'+getPropData(eid, json["propid"],datatybe)+'"/></div>';
                html+='<div style="float: left;width: 15%"><button onclick=addItems("'+eid+'","'+propid+'","'+fpropid+'")>+</button></div>'
                html+='</div>';
                html+='</div>';
                // html+='<div id="addItemPosition" ></div>'
            }
            else {
                html+='<p >'+getPropData(eid, json["propid"],datatybe)+'</p>'
                //参考范围读数据
            }
        }
        else {
            if (datatybe === 'new') {
                html += '<textarea fid='+fpropid+' eid=' + eid + ' prop_id=' + json["propid"] + ' name="propname">' + getPropData(eid, json["propid"],datatybe) + '</textarea>'
            } else {
                html += '<p fid='+fpropid+' eid=' + eid + ' prop_id=' + json["propid"] + ' name="propname">' + getPropData(eid, json["propid"],datatybe) + '</p>'
            }
        }
    }else if(json["type"]==="select"){
        // console.log(json[ele][prop]["enum_list"]);
        if(datatybe==='old'){
            html+='<p fid='+fpropid+' eid=' + eid + ' prop_id=' + json["propid"] + ' name="propname">' + getPropData(eid, json["propid"]) + '</p>';
        }
        else {
            if (json["enum_list"] instanceof Array) {
                html += '<div class="side-by-side clearfix"><div class="side-by-side clearfix"><div>';
                html +='<select fid='+fpropid+' data-placeholder="" class="chosen-select" tabindex="5" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option fid='+fpropid+' eid=' + eid + ' prop_id=' + json["propid"] + ' value="">' + getPropData(eid, json["propid"],datatybe) + '</option>';
                for (var subProp in json["enum_list"]) {
                    //console.log(); //单层下拉列表值
                    html += '<option>' + json["enum_list"][subProp] + '</option>';
                }
                html += '</select></div></div></div>';
            } else if (json["enum_list"] instanceof Object) {
                html += '<div class="side-by-side clearfix"><div class="side-by-side clearfix"><div>';
                html +='<select fid='+fpropid+' data-placeholder="qing" class="chosen-select" tabindex="5" eid=' + eid + ' prop_id= ' + json["propid"] +'>';
                html += '<option fid='+fpropid+' eid=' + eid + ' prop_id=' + json["propid"] + ' value="">' + getPropData(eid, json["propid"],datatybe) + '</option>';
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
    }
    else if(json["type"]==="object"){
        //console.log(json["fields"])
        //console.log(json["fields_new"]);
        if(datatybe==='old') {
            if (json["fields_old"]) {
                for (var j in json["fields_old"]) {
                    //console.log(json["fields_old"]);
                    html += getObjectData(json["fields_old"][j],json["propid"], eid, datatybe);
                }
            }
        }else if(datatybe==='new') {
            if (json["fields_new"]) {
                for (var j in json["fields_new"]) {
                    //console.log(json["fields_new"]);
                    //html+='<div prop_id='+json["propid"]+'>';
                    html += getObjectData(json["fields_new"][j],json["propid"], eid, datatybe);
                    //html+='</div>';
                }
            }
        }
    }
    else if (json["type"]==="tag"){
        if (datatybe==="old"){
            html+='<p  fid='+fpropid+' eid=' + eid + 'prop_id=' + json["propid"] +' >'+getPropData(eid, json["propid"],datatybe)+'</p>'
        }
        else {
            html+='<label>'+json['name']+' ——高</label>'
            html+='<input fid='+fpropid+' type="text" eid=' + eid + ' prop_id="lkai.prop.高于正常值" value="'+getPropData(eid, json["propid"],datatybe)+'" data-role="tagsinput"/>';
            html+='<label>'+json['name']+' ——低</label>'
            html+='<input type="text" fid='+fpropid+' eid=' + eid + ' prop_id="lkai.prop.低于正常值" value="'+getPropData(eid, json["propid"],datatybe)+'" data-role="tagsinput"/>';
            html+='<label>'+json['name']+' ——阳性</label>'
            html+='<input type="text" fid='+fpropid+' eid=' + eid + ' prop_id="lkai.prop.阳性" value="'+getPropData(eid, json["propid"],datatybe)+'" data-role="tagsinput"/>';
        }
    }
    return html;
}
function addItems(eid,propid,fpropid) {
    var html="";
    var gender=new Array("男","女","无");
    var age=new Array("老人","成人","儿童","婴儿","无");
    //html+='<div class="itemC" style="float: left; width: 100%">'
    html+='<div  style="float:left;width: 30%">'
    html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
    html +='<select fid='+fpropid+' data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%" sid="gender" eid=' + eid + ' prop_id= ' + propid +'>';
    html += '<option eid=' + eid + ' prop_id=' + propid + ' value=""></option>';
    for (var g in gender) {
        //console.log(); //单层下拉列表值
        html += '<option>' + gender[g]  + '</option>';
    }
    html += '</select></div></div></div>';
    html+='</div>';//选择性别
    html+='<div  style="float:left;width: 30%">'
    html += '<div class="side-by-side clearfix" ><div class="side-by-side clearfix"><div>';
    html +='<select fid='+fpropid+' data-placeholder="" class="chosen-select" tabindex="5" style="width: 100%" sid="age" eid=' + eid + ' prop_id= ' + propid +'>';
    html += '<option  eid=' + eid + ' prop_id= ' + propid + '  value=""></option>';
    for (var a in age) {
        //console.log(); //单层下拉列表值
        html += '<option>' + age[a] + '</option>';
    }
    html += '</select></div></div></div>';
    html+='</div>';//年龄选择
    html+='<div  style="float: left; width: 25%"><input fid='+fpropid+' eid=' + eid + ' prop_id=' +propid + ' sid="fw" style="width: 100%" value=""/></div>'//参考范围
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
    loadContent();
    console.log("搜索完成")
}