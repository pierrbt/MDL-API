function e(e,r,t,n,s,a,c){try{var i=e[a](c),o=i.value}catch(e){t(e);return}i.done?r(o):Promise.resolve(o).then(n,s)}function r(r){return function(){var t=this,n=arguments;return new Promise(function(s,a){var c=r.apply(t,n);function i(r){e(c,s,a,i,o,"next",r)}function o(r){e(c,s,a,i,o,"throw",r)}i(void 0)})}}function t(e,r){var t,n,s,a,c={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(t)throw TypeError("Generator is already executing.");for(;c;)try{if(t=1,n&&(s=2&a[0]?n.return:a[0]?n.throw||((s=n.return)&&s.call(n),0):n.next)&&!(s=s.call(n,a[1])).done)return s;switch(n=0,s&&(a=[2&a[0],s.value]),a[0]){case 0:case 1:s=a;break;case 4:return c.label++,{value:a[1],done:!1};case 5:c.label++,n=a[1],a=[0];continue;case 7:a=c.ops.pop(),c.trys.pop();continue;default:if(!(s=(s=c.trys).length>0&&s[s.length-1])&&(6===a[0]||2===a[0])){c=0;continue}if(3===a[0]&&(!s||a[1]>s[0]&&a[1]<s[3])){c.label=a[1];break}if(6===a[0]&&c.label<s[1]){c.label=s[1],s=a;break}if(s&&c.label<s[2]){c.label=s[2],c.ops.push(a);break}s[2]&&c.ops.pop(),c.trys.pop();continue}a=r.call(e,c)}catch(e){a=[6,e],n=0}finally{t=s=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}}import n from"fastify";import{PrismaClient as s}from"@prisma/client";import a from"zod";var c,i,o,u,l=new s,m=n(),f=a.object({firstName:a.string().min(2).max(20),lastName:a.string().min(2).max(20),age:a.number().min(10).max(99),role:a.string(),class:a.string()}),d=a.object({author:a.string(),message:a.string().min(5),email:a.string().email()});m.get("/members",(c=r(function(e,r){return t(this,function(e){switch(e.label){case 0:return e.trys.push([0,2,,3]),[4,l.member.findMany()];case 1:return[2,{message:"Successfully fetched members.",data:e.sent()}];case 2:return e.sent(),r.code(500).send({message:"Error while fetching members!"}),[3,3];case 3:return[2]}})}),function(e,r){return c.apply(this,arguments)})),m.post("/members",(i=r(function(e,r){var n,s;return t(this,function(t){switch(t.label){case 0:return t.trys.push([0,5,,6]),[4,f.safeParse(e.body)];case 1:if((n=t.sent()).success)return[3,2];return[2,r.code(400).send({message:"Invalid parameters",error:n.error})];case 2:return[4,prismaClient.member.create({data:n.data})];case 3:return[2,{message:"Successfully added member.",data:t.sent()}];case 4:return[3,6];case 5:return s=t.sent(),r.code(500).send({message:"Unexpected error while adding member",error:s}),[3,6];case 6:return[2]}})}),function(e,r){return i.apply(this,arguments)})),m.get("/messages",(o=r(function(e,r){var n;return t(this,function(e){switch(e.label){case 0:return e.trys.push([0,2,,3]),[4,l.message.findMany()];case 1:return[2,{message:"Successfully fetched messages",data:e.sent()}];case 2:return n=e.sent(),[2,r.code(500).send({message:"Unexpected error while fetching messages.",error:n})];case 3:return[2]}})}),function(e,r){return o.apply(this,arguments)})),m.post("/messages",(u=r(function(e,r){var n,s,a;return t(this,function(t){switch(t.label){case 0:return t.trys.push([0,5,,6]),[4,d.safeParse(e.body)];case 1:if((n=t.sent()).success)return[3,2];return r.code(400).send({message:"Invalid parameters",error:n.error}),[3,4];case 2:return[4,l.message.create({data:n.data})];case 3:s=t.sent(),r.code(200).send({message:"Successfully created a new message.",data:s}),t.label=4;case 4:return[3,6];case 5:return a=t.sent(),[2,r.code(500).send({message:"Unexpected error while adding a message.",error:a})];case 6:return[2]}})}),function(e,r){return u.apply(this,arguments)})),m.all("/",r(function(){return t(this,function(e){return[2,{message:"Welcome on the MDL-API. This is excellent API !"}]})}));try{await l.$connect();var h=await m.listen({port:3e3});console.log("\uD83D\uDE80 Server listening on ".concat(h))}catch(e){m.log.error(e),await l.$disconnect(),process.exit(1)}
