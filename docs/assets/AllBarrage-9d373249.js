/* empty css               *//* empty css                *//* empty css                     *//* empty css                     *//* empty css               *//* empty css                *//* empty css                   */import{r as m}from"./request-5572bcba.js";import{_ as S,q as I,o as N,c as z,a as p,b as a,w as l,z as r,E as A,A as D,L as Q,M as T,f as d,N as q,O as j,D as H,J,G as L,H as M,I as O,B as W,C as $}from"./index-2ce4d307.js";const G=u=>(q("data-v-63970b15"),u=u(),j(),u),Z={class:"card"},K=G(()=>p("b",{class:"copyCount"},"复制次数",-1)),R={class:"pagination-wrapper"},X={class:"dialog-footer"},Y={__name:"AllBarrage",setup(u){const _={table:[{required:!0,message:"请选择分栏",trigger:"blur"}],barrage:[{required:!0,message:"请输入弹幕",trigger:"blur"}]},e=I({tableData:[],total:0,pageSize:15,currentPage:1,dialogFormVisible:!1,table:"",barrage:"",ip:""}),c=(o=1)=>{m.get("/machine/allBarrage/Page",{params:{status:0}}).then(t=>{var n;console.log(t),e.tableData=t.data||[],e.total=((n=t.data)==null?void 0:n.total)||0,console.log(e.tableData)}).catch(t=>{console.error("加载数据失败:",t)})};c(e.currentPage);const f=o=>{e.currentPage=o,c(o)},h=()=>{c(),r({message:"复制成功",type:"success"})},v=()=>{r.error("复制失败，请更换浏览器或手动复制,请勿使用夸克浏览器")},y=o=>{navigator.clipboard.writeText(o.barrage).then(()=>{h(),console.log("内容已复制到剪贴板"),m.post("/machine/addCnt",{PageNum:e.currentPage,table:"allbarrage",id:o.id})}).catch(t=>{console.error("复制失败:",t),v()})},V=()=>{r({title:"温馨提醒",message:"请注意你的行为，不要上传违反法律的内容，后台能监控到你",type:"warning"}),e.table="",e.barrage="",e.dialogFormVisible=!0},w=()=>{e.table===""||e.barrage===""?r.error("请选择分栏或输入弹幕"):m.post("/machine/addUnaudit",{table:e.table,barrage:e.barrage}).then(o=>{c(),e.dialogFormVisible=!1,o.code==="200"?r.success("投稿成功，待审核(一天内)"):r.error("请求失败")})},C=()=>{e.table===""||e.barrage===""?r.error("请选择分栏或输入弹幕"):m.post("/machine/addUnaudit",{table:e.table,barrage:e.barrage}).then(o=>{c(),e.barrage="",o.code==="200"?r.success("投稿成功，待审核(一天内)"):r.error("请求失败")})};return(o,t)=>{const n=A,b=H,E=D,x=Q,B=J,i=L,k=M,g=O,P=W,U=$,F=T;return N(),z("div",null,[p("div",Z,[a(n,{type:"primary",class:"handleAdd",onClick:V},{default:l(()=>[d(" 投稿弹幕 ")]),_:1}),K,a(E,{stripe:"",data:e.tableData,"empty-text":"我还没有加载完喔~~",class:"eldtable","header-cell-style":{color:"#ff0000",fontSize:"13px",whitespace:"normal !important"},"cell-style":{}},{default:l(()=>[a(b,{width:"70",prop:"id",label:"序号"}),a(b,{prop:"barrage","min-width":"90",label:"弹幕"}),a(b,{label:"",align:"center",width:"85"},{default:l(s=>[a(n,{type:"primary",label:"操作",onClick:ee=>y(s.row)},{default:l(()=>[d("复制")]),_:2},1032,["onClick"])]),_:1}),a(b,{prop:"cnt",label:"",width:"65"})]),_:1},8,["data"])]),p("div",R,[p("div",null,[a(x,{background:"",layout:"prev, pager, next, jumper",total:e.total,"page-size":e.pageSize,onCurrentChange:f},null,8,["total","page-size"])])]),a(B,{right:50,bottom:50}),a(F,{modelValue:e.dialogFormVisible,"onUpdate:modelValue":t[3]||(t[3]=s=>e.dialogFormVisible=s),draggable:"",title:"投稿弹幕",width:"82%"},{footer:l(()=>[p("div",X,[a(n,{onClick:t[2]||(t[2]=s=>e.dialogFormVisible=!1)},{default:l(()=>[d("关闭")]),_:1}),a(n,{type:"primary",onClick:w},{default:l(()=>[d(" 投稿并关闭 ")]),_:1}),a(n,{type:"primary",onClick:C},{default:l(()=>[d(" 连续投稿 ")]),_:1})])]),default:l(()=>[a(U,{model:e,"label-width":"100px",rules:_,"label-position":"right"},{default:l(()=>[a(g,{label:"分栏","label-width":100,prop:"table"},{default:l(()=>[a(k,{modelValue:e.table,"onUpdate:modelValue":t[0]||(t[0]=s=>e.table=s),placeholder:"选择上传的分栏"},{default:l(()=>[a(i,{label:"喷玩机器篇",value:"penWJQ"}),a(i,{label:"直播间互喷篇",value:"ZbjHuPen"}),a(i,{label:"喷选手篇",value:"penPlayer"}),a(i,{label:"+1",value:"p1"}),a(i,{label:"群魔乱舞篇",value:"QMLW"}),a(i,{label:"QUQU",value:"QUQU"})]),_:1},8,["modelValue"])]),_:1}),a(g,{label:"弹幕内容",prop:"barrage"},{default:l(()=>[a(P,{maxlength:"255",modelValue:e.barrage,"onUpdate:modelValue":t[1]||(t[1]=s=>e.barrage=s),autocomplete:"off"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},de=S(Y,[["__scopeId","data-v-63970b15"]]);export{de as default};
