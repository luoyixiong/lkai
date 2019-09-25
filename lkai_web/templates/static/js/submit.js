function submit($tab) {
    var atab=$tab.find('.tabBlock-tab.is-active');
    var forms=document.forms[(atab.index())].elements;
    // console.log('#form'+(atab.index()+1))
    // console.log($('#form'+(atab.index()+1)).serialize())
    console.log(forms);
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
                        console.log(forms[i]);
                        result[j].value[m].gender = forms[i].value;
                    } else if (forms[i].getAttribute("sid") === "age") {
                        result[j].value[m].age = forms[i].value;
                    } else if (forms[i].getAttribute("sid") === "fw") {
                        result[j].value[m].fw = forms[i].value;
                        m += 1;
                    }
                    console.log(result)
                    // }else if(forms[i].getAttribute("prop_id")==="lkai.prop.高于正常值"||forms[i].getAttribute("prop_id")==="lkai.prop.低于正常值"||forms[i].getAttribute("prop_id")==="lkai.prop.阳性"){
                }else if(forms[i].getAttribute("fid")==="lkai.prop.结果解读"){

                    if(forms[i].getAttribute("id").split('-')[2]==="高于正常值") {
                        result[j].eid = forms[i].getAttribute("eid");
                        result[j].propid = "lkai.prop.结果解读";
                        result[j].value=new Object();
                        result[j].value.high=new Object();
                        result[j].value.high.propid="lkai.prop.高于正常值";
                        result[j].value.high.value=forms[i].value;
                    }else if(forms[i].getAttribute("id").split('-')[2]==="低于正常值"){
                        result[j].value.low=new Object();
                        result[j].value.low.propid="lkai.prop.低于正常值";
                        result[j].value.low.value=forms[i].value;
                    }
                    else if(forms[i].getAttribute("id").split('-')[2]==="阳性"){
                        result[j].value.other=new Object();
                        result[j].value.other.propid="lkai.prop.阳性";
                        result[j].value.other.value=forms[i].value;
                    }
                    else if(forms[i].getAttribute("id").split('-')[2]==="阴性"){
                        result[j].value.other1=new Object();
                        result[j].value.other1.propid="lkai.prop.阴性";
                        result[j].value.other1.value=forms[i].value;
                    }
                    console.log(result)
                }
                else if(forms[i].getAttribute("fid")==="lkai.prop.建议与指导") {
                    //  console.log("没错没错没错"+forms[i].getAttribute('prop_id') )
                    if(forms[i].getAttribute("prop_id")==="高于正常值") {
                        result[j].eid = forms[i].getAttribute("eid");
                        result[j].propid =forms[i].getAttribute("fid") ;
                        result[j].value=new Object();
                        result[j].value.high=new Object();
                        result[j].value.high.propid="lkai.prop.高于正常值";
                        result[j].value.high.value=forms[i].value;
                    }else if(forms[i].getAttribute("prop_id")==="低于正常值"){
                        result[j].value.low=new Object();
                        result[j].value.low.propid="lkai.prop.低于正常值";
                        result[j].value.low.value=forms[i].value;
                    }
                    else if(forms[i].getAttribute("prop_id")==="阳性"){
                        result[j].value.other=new Object();
                        result[j].value.other.propid="lkai.prop.阳性";
                        result[j].value.other.value=forms[i].value;
                    } else if(forms[i].getAttribute("prop_id")==="阴性"){
                        result[j].value.other1=new Object();
                        result[j].value.other1.propid="lkai.prop.阴性";
                        result[j].value.other1.value=forms[i].value;
                    }
                    console.log(result)
                }
                else {
                    result[j].eid = forms[i].getAttribute("eid");
                    //console.log(forms[i].getAttribute("eid"))
                    result[j].propid = forms[i].getAttribute("prop_id");
                    result[j].value = forms[i].value;
                    // console.log(result)
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
    if (formIndex < 5) {
        change($tab);
    }
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: "./getEdit" ,//url 大佬需要修改的路径
        data: JSON.stringify(result),
        success: function (result) {
            //console.log(result);//打印服务端返回的数据(调试用)
            if (result.resultCode == 200) {
                if(formIndex == 5) {
                    alert("此条数据保存成功，请点击 下一项 按钮");
                }
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
            sendStatus();
        }
        var myDiv=document.getElementById('submit-button-div');
        var button1 = '<button id="nextData" class="btn btn-block btn-large btn-success" type="button" onclick=getNextData()>下一项</button>'
        myDiv.innerHTML+=button1;

    }else {
        var myDiv=document.getElementById('submit-button-div');
        myDiv.innerHTML='<button id="next" class="btn btn-block btn-large btn-success" type="button" onclick="submit($(\'.tabBlock-tabs\'))">>></button>';
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
    window.location.href = '/index';
}
