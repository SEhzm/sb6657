/* empty css               *//* empty css                *//* empty css                     *//* empty css                     *//* empty css               *//* empty css                   */import{r as m}from"./request-5572bcba.js";import{_ as z,q as F,o as j,c as B,a as p,b as a,w as l,E as H,A as I,L as N,M as Q,f as c,N as Z,O as D,z as s,D as T,G as q,H as A,I as L,B as M,C as O}from"./index-a3943ac6.js";const W=u=>(Z("data-v-647da28a"),u=u(),D(),u),$={class:"card"},G=W(()=>p("b",{class:"copyCount"},"复制次数",-1)),J={class:"pagination-wrapper"},K={class:"dialog-footer"},R={__name:"ZbjHuPen",setup(u){const g={table:[{required:!0,message:"请选择分栏",trigger:"blur"}],barrage:[{required:!0,message:"请输入弹幕",trigger:"blur"}]},e=F({tableData:[],total:0,pageSize:15,currentPage:1,dialogFormVisible:!1,table:"",barrage:""}),b=(o=1)=>{m.get("/machine/ZbjHuPen/Page",{params:{pageNum:o,pageSize:e.pageSize}}).then(t=>{var r,i;e.tableData=((r=t.data)==null?void 0:r.list)||[],e.total=((i=t.data)==null?void 0:i.total)||0}).catch(t=>{console.error("加载数据失败:",t)})};b(e.currentPage);const f=o=>{e.currentPage=o,b(o)},h=()=>{s({message:"复制成功",type:"success"})},v=()=>{s.error("复制失败，请更换浏览器或手动复制,请勿使用夸克浏览器")},y=o=>{navigator.clipboard.writeText(o.barrage).then(()=>{h(),console.log("内容已复制到剪贴板"),m.post("/machine/addCnt",{PageNum:e.currentPage,table:"ZbjHuPen",id:o.id})}).catch(t=>{console.error("复制失败:",t),v()})},V=()=>{e.table="",e.barrage="",e.dialogFormVisible=!0},P=()=>{e.table===""||e.barrage===""?s.error("请选择分栏或输入弹幕"):m.post("/machine/addUnaudit",{table:e.table,barrage:e.barrage}).then(o=>{b(),e.dialogFormVisible=!1,o.code==="200"?s.success("投稿成功，待审核(一天内)"):s.error("请求失败")})},C=()=>{e.table===""||e.barrage===""?s.error("请选择分栏或输入弹幕"):m.post("/machine/addUnaudit",{table:e.table,barrage:e.barrage}).then(o=>{b(),e.barrage="",o.code==="200"?s.success("投稿成功，待审核(一天内)"):s.error("请求失败")})};return(o,t)=>{const r=H,i=T,w=I,x=N,d=q,E=A,_=L,S=M,k=O,U=Q;return j(),B("div",null,[p("div",$,[a(r,{type:"primary",class:"handleAdd",onClick:V},{default:l(()=>[c(" 投稿弹幕 ")]),_:1}),G,a(w,{stripe:"",data:e.tableData,"empty-text":"我还没有加载完喔~~",class:"eldtable","header-cell-style":{color:"#ff0000",fontSize:"13px",whitespace:"normal !important"},"cell-style":{}},{default:l(()=>[a(i,{width:"60",prop:"id",label:"序号"}),a(i,{prop:"barrage","min-width":"90",label:"弹幕"}),a(i,{label:"",align:"center",width:"85"},{default:l(n=>[a(r,{type:"primary",label:"操作",onClick:X=>y(n.row)},{default:l(()=>[c("复制")]),_:2},1032,["onClick"])]),_:1}),a(i,{prop:"cnt",label:"",width:"65"})]),_:1},8,["data"])]),p("div",J,[p("div",null,[a(x,{background:"",layout:"prev, pager, next, jumper",total:e.total,"page-size":e.pageSize,onCurrentChange:f},null,8,["total","page-size"])])]),a(U,{modelValue:e.dialogFormVisible,"onUpdate:modelValue":t[3]||(t[3]=n=>e.dialogFormVisible=n),draggable:"",title:"投稿弹幕",width:"82%"},{footer:l(()=>[p("div",K,[a(r,{onClick:t[2]||(t[2]=n=>e.dialogFormVisible=!1)},{default:l(()=>[c("关闭")]),_:1}),a(r,{type:"primary",onClick:P},{default:l(()=>[c(" 投稿并关闭 ")]),_:1}),a(r,{type:"primary",onClick:C},{default:l(()=>[c(" 连续投稿 ")]),_:1})])]),default:l(()=>[a(k,{model:e,"label-width":"100px",rules:g,"label-position":"right"},{default:l(()=>[a(_,{label:"分栏","label-width":100,prop:"table"},{default:l(()=>[a(E,{modelValue:e.table,"onUpdate:modelValue":t[0]||(t[0]=n=>e.table=n),placeholder:"选择上传的分栏"},{default:l(()=>[a(d,{label:"喷玩机器篇",value:"penWJQ"}),a(d,{label:"直播间互喷篇",value:"ZbjHuPen"}),a(d,{label:"喷选手篇",value:"penPlayer"}),a(d,{label:"+1",value:"p1"}),a(d,{label:"群魔乱舞篇",value:"QMLW"}),a(d,{label:"QUQU",value:"QUQU"})]),_:1},8,["modelValue"])]),_:1}),a(_,{label:"弹幕内容",prop:"barrage"},{default:l(()=>[a(S,{maxlength:"255",modelValue:e.barrage,"onUpdate:modelValue":t[1]||(t[1]=n=>e.barrage=n),autocomplete:"off"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},se=z(R,[["__scopeId","data-v-647da28a"]]);export{se as default};
