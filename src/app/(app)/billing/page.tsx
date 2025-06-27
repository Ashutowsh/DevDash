'use client'

import { trpc } from '@/app/_trpc/client'
import { Info } from 'lucide-react'
import React, { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from '@/components/ui/button'
import { createCheckOutSession } from '@/lib/razorpay'

function BillingPage() {
    const {data: credits} = trpc.getMyCredits.useQuery()
    const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100])
    const creditsToBuyAmount = creditsToBuy[0]
    const price = (creditsToBuyAmount / 50).toFixed(2)
  return (
    <div>
      <h1 className='text-xl font-semibold'>Billing</h1>
      <div className="h-2"></div>
      <p className="text-sm text-gray-500">
        You currently have {credits?.credits} credits.
      </p>
      <div className="h-2"></div>
      <div className='bg-blue-50 px-4 py-2 rounded-md border border-blue-200 text-blue-700'>
        <div className='flex items-center gap-2'>
            <Info className='size-4'/>
            <p className='text-sm'>Each credit allows you to index 1 file in a repository</p>
        </div>
        <p>E.g. If your project has 100 files, you wil need 100 credits to index it.</p>
      </div>
      <div className='h-4'></div>
      <Slider defaultValue={[100]} max={10} step={10} onValueChange={value => setCreditsToBuy(value)} value={creditsToBuy}>
        <div className="h-4"></div>
        <Button onClick={() => {
            createCheckOutSession(creditsToBuyAmount)
        }}>
            Buy {creditsToBuyAmount} credits for ${price}
        </Button>
      </Slider>
    </div>
  )
}

export default BillingPage
