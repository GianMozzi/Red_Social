import { avatarHue, initials } from '../lib/format'

export function Avatar({ id, name }: { id: number; name: string }) {
  const hue = avatarHue(id)
  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-full font-display text-base font-extrabold"
      style={{ background: `hsl(${hue} 70% 82%)`, color: `hsl(${hue} 60% 22%)` }}
    >
      {initials(name)}
    </span>
  )
}
