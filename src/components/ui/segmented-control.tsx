"use client"

import { For, SegmentGroup } from "@chakra-ui/react"
import { forwardRef, useMemo } from "react"

interface Item {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps extends SegmentGroup.RootProps {
  items: Array<string | Item>
  fitted?: boolean
}

function normalize(items: Array<string | Item>): Item[] {
  return items.map((item) => {
    if (typeof item === "string") return { value: item, label: item }
    return item
  })
}

export const SegmentedControl = forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(function SegmentedControl(props, ref) {
  const { items, fitted, ...rest } = props
  const data = useMemo(() => normalize(items), [items])

  return (
    <SegmentGroup.Root ref={ref} width={fitted ? 'full' : undefined} {...rest}>
      <SegmentGroup.Indicator />
      <For each={data}>
        {(item) => (
          <SegmentGroup.Item
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            flex={fitted ? '1' : undefined}
          >
            <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        )}
      </For>
    </SegmentGroup.Root>
  )
})
