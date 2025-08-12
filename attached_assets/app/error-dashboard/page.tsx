'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ErrorDashboard from '@/components/error-tracking/error-dashboard'
import ErrorTestPanel from '@/components/error-tracking/error-test-panel'
import { BarChart3, TestTube } from 'lucide-react'

export default function ErrorDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center">
            <TestTube className="h-4 w-4 mr-2" />
            Testing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <ErrorDashboard />
        </TabsContent>
        
        <TabsContent value="testing" className="mt-6">
          <ErrorTestPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}