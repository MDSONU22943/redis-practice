import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())
const redis = new Redis('redis://localhost:6379')

function otpKey(phone){
    return `otp:${phone}`
}

app.post('/send-otp', async (req, res) => {
    const { phone } = req.body
    if(!phone) return res.status(400).json({ error: 'Phone number is required' })
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await redis.set(otpKey(phone), otp, 'EX', 300) // OTP valid for 5 minutes
    console.log(`OTP for ${phone}: ${otp}`)
    res.json({ message: 'OTP sent successfully' })
})

app.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body
    if(!phone || !otp) return res.status(400).json({ error: 'Phone number and OTP are required' })
    const storedOtp = await redis.get(otpKey(phone))
    if(!storedOtp) return res.status(400).json({ error: 'Invalid or expired OTP' })
    if(storedOtp !== otp) return res.status(400).json({ error: 'Incorrect OTP' })
    await redis.del(otpKey(phone)) // Remove OTP after successful verification
    res.json({ message: 'OTP verified successfully' })
})

app.get('/otp/:phone/ttl', async (req, res) => {
    const { phone } = req.params
    const ttl = await redis.ttl(otpKey(phone))
    res.json({ ttl })
})

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000')
})