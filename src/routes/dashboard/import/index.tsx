import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createFileRoute } from '@tanstack/react-router'
import { Globe, LinkIcon } from 'lucide-react'
import BulkImportForm from './-components/bulk-import-form'
import SingleImportForm from './-components/single-import-form'

export const Route = createFileRoute('/dashboard/import/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Import Content</h1>
          <p className="text-muted-foreground pt-1">
            Save web pages to your library for later reading
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="gap-2">
              <LinkIcon className="size-4" /> Single URL
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <Globe className="size-4" /> Bulk Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <SingleImportForm />
          </TabsContent>
          <TabsContent value="bulk">
            <BulkImportForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
