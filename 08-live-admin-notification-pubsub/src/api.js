import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())

const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

app.post('/notifications', async (req, res) => {
  const payload= {
    title: req.body.title,
    timestamp: new Date().toISOString()
  }

  const receivers = await publisher.publish('notifications', JSON.stringify(payload))
  console.log('Published notification to %d receivers', receivers)
  res.status(200).json({ message: 'Notification sent' })

})

app.listen(3000, () => {
  console.log('API server listening on port 3000')
})