import{E as _,d as B,j as N,a as U,b as q,p as $,m as L,q as T}from"./element-plus.ec180c6b.js";import{r as I}from"./request.39193e0d.js";import{_ as A}from"./index.3b8d7347.js";import{_ as j,o as m,c as r,a as l,F as f,a8 as C,V as n,P as a,T as c,U as u,S as H,ax as M,ay as P}from"./@vue.7a8f7aed.js";import"./lodash-es.2e98bc53.js";import"./@vueuse.65cb1fed.js";import"./@element-plus.b6e46eba.js";import"./@popperjs.c75af06c.js";import"./@ctrl.f8748455.js";import"./dayjs.de1d8cda.js";import"./async-validator.dee29e8b.js";import"./memoize-one.297ddbcb.js";import"./normalize-wheel-es.ed76fb12.js";import"./@floating-ui.c9ffdb72.js";import"./axios.28bc18a3.js";import"./vue-router.f6176e51.js";const G=p=>(M("data-v-afe72955"),p=p(),P(),p),J=G(()=>l("div",{class:"outer"},[l("span",null,"时光相册"),l("span",{style:{"font-size":"16px"}},"(点击放大图片)"),l("em",{style:{"font-size":"14px"}},"如侵权，请右上角联系删除")],-1)),K={class:"image-list"},Q={style:{"text-align":"center",padding:"0 0 5px 0"}},R={key:0,class:"comment-list"},W={class:"comment-content"},X={class:"comment-content"},Y={class:"comment-date"},Z={class:"dialog-footer"},O={__name:"image",setup(p){(()=>{_({type:"success",dangerouslyUseHTMLString:!0,title:"照片可以评论喔",offset:100,duration:1500})})();const o=j({outerImg:[],id:"",imageId:"",Commentname:"",douyuId:"",dialogFormVisible:!1}),g=()=>{I.get("/machine/showImage",{}).then(e=>{o.outerImg=e.data||[]}).catch(e=>{console.error("加载数据失败:",e)})};g();const b=e=>{e.showComments=!e.showComments},h=e=>new Date(e).toLocaleString(),v={douyuId:[{required:!0,message:"请输入你的斗鱼ID",trigger:"blur"}],Commentname:[{required:!0,message:"请输入评论",trigger:"blur"}]},V=e=>{console.log(e),o.imageId=e.id,_({title:"温馨提醒",message:"请注意你的行为，不要上传违反法律的内容，后台能监控到你",type:"warning"}),o.douyuID="",o.Commentname="",o.dialogFormVisible=!0},k=e=>{console.log(e),e.douyuID===""||e.Commentname===""?_.error("请输入斗鱼id或输入评论"):I.post("/machine/addCommentname",{id:"",imageId:o.imageId,douyuID:e.douyuID,createdAt:"",commentname:e.Commentname}).then(s=>{g(),_.success("评论成功"),o.dialogFormVisible=!1}).catch(s=>{console.error("加载数据失败:",s)})};return(e,s)=>{const w=N,i=U,y=q,x=$,D=L,E=B,F=T;return m(),r(f,null,[J,l("div",K,[(m(!0),r(f,null,C(o.outerImg,(t,z)=>(m(),r("div",{key:z,class:"image-block"},[n(w,{"zoom-rate":1.2,"max-scale":7,"min-scale":.2,"hide-on-click-modal":!0,src:t.url,"preview-src-list":[t.url],fit:"cover",lazy:"",style:{width:"250px",height:"300px"}},null,8,["src","preview-src-list"]),l("div",Q,[n(i,{style:{width:"230px","font-size":"16px","white-space":"normal","word-break":"break-word"}},{default:a(()=>[c(u(t.date),1)]),_:2},1024)]),n(i,{onClick:d=>b(t),style:{"font-size":"18px","margin-left":"15px","box-sizing":"border-box"}},{default:a(()=>[c(u(t.showComments?"隐藏评论":"显示评论"),1)]),_:2},1032,["onClick"]),t.showComments?(m(),r("div",R,[(m(!0),r(f,null,C(t.comments,(d,S)=>(m(),r("div",{key:S,class:"comment-item"},[l("span",W,u(d.douyuID)+" :",1),l("span",X,u(d.commentname),1),l("span",Y,u(h(d.createdAt)),1)]))),128))])):H("",!0),n(i,{type:"success",plain:"",onClick:d=>V(t),style:{"font-size":"18px","box-sizing":"border-box"}},{default:a(()=>[c(" 我要评论 ")]),_:2},1032,["onClick"])]))),128))]),n(E,{modelValue:o.dialogFormVisible,"onUpdate:modelValue":s[4]||(s[4]=t=>o.dialogFormVisible=t),draggable:"",title:"评论"},{footer:a(()=>[l("div",Z,[n(i,{onClick:s[2]||(s[2]=t=>o.dialogFormVisible=!1)},{default:a(()=>[c("关闭")]),_:1}),n(i,{type:"primary",onClick:s[3]||(s[3]=t=>k(o))},{default:a(()=>[c(" 评论并关闭 ")]),_:1})])]),default:a(()=>[n(D,{model:o,"label-width":"100px",rules:v,"label-position":"right"},{default:a(()=>[n(x,{label:"你的斗鱼id",prop:"douyuID"},{default:a(()=>[n(y,{modelValue:o.douyuID,"onUpdate:modelValue":s[0]||(s[0]=t=>o.douyuID=t),autocomplete:"off"},null,8,["modelValue"])]),_:1}),n(x,{label:"评论内容",prop:"Commentname"},{default:a(()=>[n(y,{modelValue:o.Commentname,"onUpdate:modelValue":s[1]||(s[1]=t=>o.Commentname=t),autocomplete:"off"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),n(F,{right:50,bottom:50})],64)}}},ye=A(O,[["__scopeId","data-v-afe72955"]]);export{ye as default};
