'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Sparkles, Bot, Loader2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

/** ————— Types ————— */

type Provider = 'openai' | 'google'
type ModelId =
  | 'gpt-5'
  | 'gpt-5-mini'
  | 'gpt-5-nano'
  // ChatGPT-only "Thinking Pro" mode (not an API model) – shown disabled for clarity
  | 'gpt-5-thinking-pro'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-flash-lite'

interface ModelMeta {
  id: ModelId
  provider: Provider
  name: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  features: string[]
  apiAvailable?: boolean // if false, we render disabled with tooltip
}

interface ModelSelectorProps {
  selectedModel: ModelId
  onModelChange: (model: ModelId) => Promise<void> | void
  disabled?: boolean
  className?: string
}

/** ————— Registry ————— */

const MODELS: readonly ModelMeta[] = [
  // OpenAI (GPT-5 series) – API reasoning models
  {
    id: 'gpt-5',
    provider: 'openai',
    name: 'GPT-5',
    description: 'Reasoning model with minimal→high effort and verbosity controls',
    icon: Bot,
    color: 'from-slate-600 to-zinc-800',
    features: ['Reasoning', 'Verbosity control', 'Parallel tool calls'],
  },
  {
    id: 'gpt-5-mini',
    provider: 'openai',
    name: 'GPT-5 mini',
    description: 'Lower-latency, lower-cost GPT-5 reasoning',
    icon: Bot,
    color: 'from-slate-500 to-slate-700',
    features: ['Faster', 'Cost-efficient', 'Good default'],
  },
  {
    id: 'gpt-5-nano',
    provider: 'openai',
    name: 'GPT-5 nano',
    description: 'Fastest and cheapest GPT-5 tier for light tasks',
    icon: Bot,
    color: 'from-slate-400 to-slate-600',
    features: ['Ultra-fast', 'Low cost', 'Light tasks'],
  },
  // ChatGPT UI mode (not an API model) – exposed but disabled so users understand availability
  {
    id: 'gpt-5-thinking-pro',
    provider: 'openai',
    name: 'GPT-5 Thinking Pro (ChatGPT)',
    description: 'Deeper "Thinking Pro" mode is ChatGPT-only; no API model ID',
    icon: Bot,
    color: 'from-slate-700 to-black',
    features: ['ChatGPT UI mode', 'Not in API'],
    apiAvailable: false,
  },

  // Google (Gemini 2.5 series)
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    name: 'Gemini 2.5 Pro',
    description: 'Most capable Gemini 2.5 with adaptive thinking',
    icon: Sparkles,
    color: 'from-purple-600 to-indigo-800',
    features: ['Adaptive thinking', 'High capability', 'Complex reasoning'],
  },
  {
    id: 'gemini-2.5-flash',
    provider: 'google',
    name: 'Gemini 2.5 Flash',
    description: 'Fast and efficient Gemini 2.5 for most tasks',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-700',
    features: ['Fast', 'Efficient', 'Good balance'],
  },
  {
    id: 'gemini-2.5-flash-lite',
    provider: 'google',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Lightweight Gemini 2.5 for simple tasks',
    icon: Sparkles,
    color: 'from-purple-400 to-indigo-600',
    features: ['Lightweight', 'Simple tasks', 'Cost-effective'],
  },
]

export function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
  className,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [isChanging, setIsChanging] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const labelId = React.useId()

  const selected = React.useMemo(() => MODELS.find(m => m.id === selectedModel), [selectedModel])

  const byProvider = React.useMemo(() => {
    const groups: Record<Provider, ModelMeta[]> = { openai: [], google: [] }
    for (const m of MODELS) groups[m.provider].push(m)
    return groups
  }, [])

  const handleModelSelect = async (modelId: ModelId) => {
    if (disabled || isChanging) return
    const meta = MODELS.find(m => m.id === modelId)
    if (!meta || meta.apiAvailable === false) return
    if (modelId === selectedModel) { setOpen(false); return }
    setIsChanging(true)
    try { await onModelChange(modelId) }
    finally {
      setIsChanging(false)
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const Trigger = (
    <Button
      ref={triggerRef}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      aria-controls={open ? `${labelId}-listbox` : undefined}
      aria-haspopup="listbox"
      aria-labelledby={labelId}
      className={cn(
        'justify-between border-gray-300 hover:border-gray-400 bg-white text-sm h-9 px-3',
        (disabled || isChanging) && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled || isChanging}
    >
      {isChanging ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          <span>Switching…</span>
        </div>
      ) : selected ? (
        <span id={labelId} className="truncate">{selected.name}</span>
      ) : (
        <span id={labelId}>Select Model…</span>
      )}
      {isChanging
        ? <Loader2 className="ml-2 h-3 w-3 shrink-0 animate-spin opacity-50" aria-hidden="true" />
        : <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" aria-hidden="true" />}
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={v => !disabled && setOpen(v)}>
      <PopoverTrigger asChild>
        {disabled ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{Trigger}</TooltipTrigger>
              <TooltipContent>Model switching is disabled</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : Trigger}
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-3 shadow-lg border border-gray-200" align="start">
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-900">Select AI Model</h3>
          
          {/* All Models - Clean List */}
          <div className="space-y-1">
            {MODELS.map(m => {
              const isSelected = selectedModel === m.id
              const disabledItem = m.apiAvailable === false
              
              const ModelItem = (
                <button
                  key={m.id}
                  onClick={() => !disabledItem && handleModelSelect(m.id)}
                  disabled={disabledItem}
                  className={cn(
                    'w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors',
                    isSelected && 'bg-blue-50 text-blue-900',
                    disabledItem && 'opacity-50 cursor-not-allowed',
                    !disabledItem && 'cursor-pointer'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{m.name}</span>
                        {isSelected && <Check className="h-3 w-3 text-blue-600" />}
                        {disabledItem && <span className="text-xs text-gray-500">(ChatGPT only)</span>}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{m.description}</p>
                    </div>
                  </div>
                </button>
              )

              return disabledItem ? (
                <TooltipProvider key={m.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>{ModelItem}</TooltipTrigger>
                    <TooltipContent>
                      <span>Not available via API</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : ModelItem
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

