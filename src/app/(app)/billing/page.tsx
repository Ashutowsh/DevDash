'use client'

import { trpc } from '@/app/_trpc/client'
import { Info } from 'lucide-react'
import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
// import { createCheckOutSession } from '@/lib/razorpay'

function BillingPage() {
  const { data: credits } = trpc.getMyCredits.useQuery()
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100])
  const creditsToBuyAmount = creditsToBuy[0]
  const price = (creditsToBuyAmount / 50).toFixed(2)

  return (
    <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          You currently have <strong>{credits?.credits ?? 0}</strong> credits.
        </p>
      </div>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <p className="text-sm">
              Each credit allows you to index 1 file in a repository.
            </p>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-200">
            For example, indexing 100 files requires 100 credits.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-foreground">
            Credits to purchase: <span className="font-semibold">{creditsToBuyAmount}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            ${price} total
          </p>
        </div>

        <Slider
          defaultValue={[100]}
          min={10}
          max={500}
          step={10}
          value={creditsToBuy}
          onValueChange={(value) => setCreditsToBuy(value)}
        />

        <div className="pt-2">
          <Button className="w-full sm:w-auto" onClick={() => {
            // createCheckOutSession(creditsToBuyAmount)
          }}>
            Buy {creditsToBuyAmount} credits for ${price}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BillingPage
