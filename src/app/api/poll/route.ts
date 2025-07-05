import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emitSocketEvent } from "@/lib/socket";
import { createPollSchema } from "@/lib/validators";



export async function POST (req:Request){
const session = await getServerSession(authOptions);
if(!session || session.user.role !== "ADMIN"){
     return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}

const body = await req.json();

const  parsed = createPollSchema.safeParse(body)

if(!parsed.success){
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
}
const {question,options,published} = parsed.data;

if(!question || !Array.isArray(options) || options.length < 2 ){
     return NextResponse.json({ error: "Invalid poll data" }, { status: 400 });
}

const poll = await prisma.poll.create({
    data:{
        question,
        published,
        createdById:session.user.id,
        options:{
            create: options.map((text:string) => ({text:text.trim()}))
        },

    },
    include:{options:true},
})

if(published){
    await emitSocketEvent("new-poll", poll)
}


return NextResponse.json(poll);
}


export async function GET (){
    const polls = await prisma.poll.findMany({
        where:{published:true},
        include:{
            options:{ include:{votes:true}},
        },
        orderBy:{createdAt:"desc"}
    })
  if(polls.length < 1 ){
    return NextResponse.json({error:"Sondage indisponible"}, {status:400})
  }


    return NextResponse.json(polls);
}