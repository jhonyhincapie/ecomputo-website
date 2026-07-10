'use client'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Stagger offset in seconds, e.g. index * 0.06 */
  delay?: number
  className?: string
}

/**
 * Client island: fades content up as it enters the viewport.
 * Server components pass their rendered output as children.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
