import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())


const redis = new Redis('redis://localhost:6379')

app.post("/user/:id/json", async (req,res)=>{
    await redis.set(`user:${req.params.id}`, JSON.stringify(req.body))
    res.json({message: "User profile cached as JSON", savedAs:"json"})
})

app.get("/user/:id/json", async (req,res)=>{
    const raw = await redis.get(`user:${req.params.id}`)
    if (!raw) {
        return res.status(404).json({message: "User profile not found"})
    }
    res.json({user: JSON.parse(raw)})
})

app.post("/user/:id/hash", async (req,res)=>{
    await redis.hset(`user:${req.params.id}`, req.body)
    res.json({message: "User profile cached as Hash", savedAs:"hash"})
})

app.get("/user/:id/hash", async (req,res)=>{
    const user = await redis.hgetall(`user:${req.params.id}`)
    if (Object.keys(user).length === 0) {
        return res.status(404).json({message: "User profile not found"})
    }
    res.json({user})
})

app.listen(4000, ()=>{
    console.log("Server running on port 4000")
})