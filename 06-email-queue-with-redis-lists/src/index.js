import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const QUEUE_KEY='queue:emails'

app.post('/emails', async (req, res) => {
        const job ={ 
            to: req.body.to,
             subject: req.body.subject || 'No subject',
             body: req.body.body || 'No body',
                createdAt: new Date().toISOString()
        }
        await redis.lpush(QUEUE_KEY, JSON.stringify(job))
        res.status(201).json({ message: 'Email job added to the queue', job , job})
})

app.get('/emails/process-one', async (req, res) => {
    const jobData = await redis.rpop(QUEUE_KEY)
    if (!jobData) {
        return res.status(404).json({ message: 'No email jobs in the queue' })
    }
    const job = JSON.parse(jobData)
    res.json({ message: 'Processing email job', job })
})

app.listen(3000, () => {
    console.log('Email queue server is running on port 3000')
})