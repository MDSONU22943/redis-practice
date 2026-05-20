import {Job, Worker} from 'bullmq'
import {connection} from './queue'

const worker =new Worker(
    'emails',
    async job => {
        console.log(`Processing job ${job.id} with data ${JSON.stringify(job.data)}`)
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log(`Email sent to ${job.data.email}`)
    },
    {connection}
    
)

worker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`)
})

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`)
})

