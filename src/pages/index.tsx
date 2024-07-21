// Packages:
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Inter, Playfair_Display } from 'next/font/google'
import generateScript from '@/utils/generateScript'
import { useToast } from '@/components/ui/use-toast'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Typescript:
interface ScriptLine { text: string, html: string }

// Constants:
const inter = Inter({ subsets: ['latin'] })
const playfair_display = Playfair_Display({ subsets: ['latin'] })

// Components:
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { TypeAnimation } from 'react-type-animation'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Functions:
const App = () => {
  // Constants:
  const { toast } = useToast()

  // State:
  const [isGeneratingScript, setIsGeneratingScript] = useState(false)
  const [scriptForm, setScriptForm] = useState({
    username: {
      value: '',
      error: '',
    },
    topic: {
      value: '',
      error: '',
    },
    pageDescription: {
      value: '',
      error: '',
    },
    request: {
      value: '',
      error: '',
    },
  })
  const [script, setScript] = useState<ScriptLine[]>([])
  const [currentScriptLine, setCurrentScriptLine] = useState(0)
  const [focusedLine, setFocusedLine] = useState<number>()

  // Functions:
  const _generateScript = async () => {
    try {
      if (
        !scriptForm.username.error &&
        !scriptForm.topic.error &&
        !scriptForm.pageDescription.error &&
        !scriptForm.request.error
      )
      setIsGeneratingScript(true)
  
      const { status, payload } = await generateScript({
        username: scriptForm.username.value,
        topic: scriptForm.topic.value,
        pageDescription: scriptForm.pageDescription.value,
        request: scriptForm.request.value,
      })

      if (status) {
        const lines = payload
          .split(/(?:\r\n|\r|\n)/g)
          .filter(line => line.trim().length > 0)
        
        const _script: ScriptLine[] = []
        for await (const text of lines) {
          const html = DOMPurify.sanitize(await marked.parse(text))
          _script.push({
            text,
            html,
          })
        }
        setScript(_script)
      } else {
        console.error(payload)
        toast({
          title: 'Could not generate the script!',
          description: 'Encountered an issue while trying to generate the script, please check the console',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Could not generate the script!',
        description: 'Encountered an issue while trying to generate the script, please check the console',
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingScript(false)
    }
  }

  useEffect(() => {
    _generateScript()
  }, [])
  
  // Return:
  return (
    <div className={cn('flex flex-col w-screen h-screen', inter.className)}>
      <div className='flex justify-center items-center w-full h-[5%] border-b-2'>
        <div className={cn('text-xl font-bold select-none', playfair_display.className)}>reel-gen</div>
      </div>
      <div className='w-full h-[95%]'>
        <ResizablePanelGroup
          direction='horizontal'
          className='w-full h-full rounded-none'
        >
          <ResizablePanel defaultSize={33}>
            <ResizablePanelGroup
              direction='vertical'
              className='w-full h-full rounded-none'
            >
              <ResizablePanel defaultSize={75}>
                <ScrollArea className='w-full h-full'>
                  <div className='flex flex-col gap-4 p-6'>
                    {
                      script.map((line, index) => (
                        <>
                          {currentScriptLine === index ? (
                            <TypeAnimation
                              sequence={[
                                line.text,
                                () => setCurrentScriptLine(index + 1),
                              ]}
                              speed={{
                                type: 'keyStrokeDelayInMs',
                                value: 10
                              }}
                              wrapper='div'
                              className='text-base'
                            />
                          ) : currentScriptLine >= index + 1 ? (
                            <Popover onOpenChange={open => setFocusedLine(open ? index : undefined)}>
                              <PopoverTrigger asChild>
                                <div
                                  className={cn('text-base cursor-pointer transition-all', focusedLine === index && '-m-2 p-2 bg-gray-100 rounded-md')}
                                  dangerouslySetInnerHTML={{
                                    __html: line.html
                                  }}
                                />
                              </PopoverTrigger>
                              <PopoverContent className='p-2 right-0'>
                                Place content for the popover here.
                              </PopoverContent>
                            </Popover>
                          ) : null}
                        </>
                      ))
                    }
                  </div>
                </ScrollArea>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={25}>
                
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={33}>

          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={33}>

          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

// Exports:
export default App
